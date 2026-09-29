---
title: Background Services Broad Reference
description: Hosted service patterns, workers and consumers in .NET.
type: reference
audience: People implementing .NET background processes.
canonical: false
canonicalSource: /engineering/backend/dotnet/background-services/
---

# Background Services

> [!IMPORTANT]
> For producer and relay design, use [Transactional Outbox](/engineering/messaging/outbox). For shared retry, duplicate and DLQ guarantees, use [Reliable Message Delivery](/engineering/messaging/reliable-delivery). This page keeps .NET worker examples.

Implementation of event consumers in .NET using `BackgroundService` and the worker pattern. Recommended for asynchronous processing of events published by the Web API.

## Base Pattern: BackgroundService

.NET provides the abstract class `BackgroundService` (implements `IHostedService`) for long-running background tasks:

```csharp
public class OrderProcessingWorker : BackgroundService
{
    private readonly ILogger<OrderProcessingWorker> _logger;

    public OrderProcessingWorker(ILogger<OrderProcessingWorker> logger)
    {
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Worker started: {Time}", DateTimeOffset.UtcNow);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessNextEventAsync(stoppingToken);
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                _logger.LogError(ex, "Error processing event.");
                await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
            }
        }
    }

    private async Task ProcessNextEventAsync(CancellationToken cancellationToken)
    {
        // Consumption logic here
        await Task.Delay(1000, cancellationToken);
    }
}
```

Registration in `Program.cs`:

```csharp
builder.Services.AddHostedService<OrderProcessingWorker>();
```

## Consumer with Kafka / Redpanda

Using `Confluent.Kafka`:

```csharp
public class OrderCreatedConsumer : BackgroundService
{
    private readonly IConsumer<string, string> _consumer;
    private readonly IMediator _mediator;
    private readonly ILogger<OrderCreatedConsumer> _logger;

    public OrderCreatedConsumer(
        IOptions<KafkaSettings> settings,
        IMediator mediator,
        ILogger<OrderCreatedConsumer> logger)
    {
        _mediator = mediator;
        _logger = logger;

        var config = new ConsumerConfig
        {
            BootstrapServers = settings.Value.BootstrapServers,
            GroupId = settings.Value.ConsumerGroup,
            AutoOffsetReset = AutoOffsetReset.Earliest,
            EnableAutoCommit = false
        };

        _consumer = new ConsumerBuilder<string, string>(config).Build();
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _consumer.Subscribe("orders.created.v1");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var consumeResult = _consumer.Consume(stoppingToken);
                var @event = JsonSerializer.Deserialize<OrderCreatedEvent>(consumeResult.Message.Value);

                if (@event is not null)
                {
                    await _mediator.SendAsync(new ProcessOrderCreatedCommand(@event), stoppingToken);
                    _consumer.Commit(consumeResult);

                    _logger.LogInformation(
                        "Event processed: {EventType} {EventId}",
                        @event.EventType,
                        @event.EventId);
                }
            }
            catch (ConsumeException ex)
            {
                _logger.LogError(ex, "Error consuming message from Kafka.");
            }
        }
    }

    public override void Dispose()
    {
        _consumer.Close();
        _consumer.Dispose();
        base.Dispose();
    }
}
```

## Configuration with IOptions\<T\>

Use `IOptions<T>` for broker configuration, not primitive parameters in constructors:

```csharp
public class KafkaSettings
{
    public string BootstrapServers { get; set; } = string.Empty;
    public string ConsumerGroup { get; set; } = string.Empty;
    public string ProducerClientId { get; set; } = string.Empty;
}
```

```json
// appsettings.json
{
  "Kafka": {
    "BootstrapServers": "localhost:9092",
    "ConsumerGroup": "sales-service",
    "ProducerClientId": "sales-producer"
  }
}
```

```csharp
builder.Services.Configure<KafkaSettings>(builder.Configuration.GetSection("Kafka"));
```

## Integration with Transactional Outbox

A `BackgroundService` can host the relay: claim pending deliveries, publish with the broker's appropriate acceptance signal, and close only those the destination accepted. With several instances, coordinate claims and recover abandoned work. Propagate `CancellationToken` and release resources when the host stops.

The producer records the business mutation and `OrderPlaced` delivery in one transaction. The consumer records its idempotency key with its durable effect in another local transaction; checking for an ID before writing the effect leaves a race. See [Transactional Outbox](/engineering/messaging/outbox) for relay design and [Reliable Message Delivery](/engineering/messaging/reliable-delivery) for shared guarantees.

## Cross Reference

- [EDA: Concepts](/engineering/messaging/event-driven-architecture) — event-driven architecture principles and patterns.
- [Kafka/Redpanda as Event Store](/engineering/messaging/kafka-redpanda-event-store)
- [C# with Minimal APIs](/engineering/backend/dotnet/minimal-apis/) — event generation from commands.
