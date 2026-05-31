# Background Services

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

## Integration with Outbox Pattern

The Outbox Pattern guarantees that events published to the broker are consistent with database changes.

### Flow

```
CommandHandler
    └── Saves mutation + event to outbox table (same transaction)
        └── OutboxPublisherWorker (Background Service)
                └── Reads pending events → publishes to broker → marks as published
```

### OutboxPublisherWorker

```csharp
public class OutboxPublisherWorker : BackgroundService
{
    private readonly IDbConnectionHub _connectionHub;
    private readonly IProducer<string, string> _producer;
    private readonly ILogger<OutboxPublisherWorker> _logger;

    public OutboxPublisherWorker(
        IDbConnectionHub connectionHub,
        IOptions<KafkaSettings> settings,
        ILogger<OutboxPublisherWorker> logger)
    {
        _connectionHub = connectionHub;
        _logger = logger;

        var config = new ProducerConfig
        {
            BootstrapServers = settings.Value.BootstrapServers,
            ClientId = settings.Value.ProducerClientId,
            Acks = Acks.All,
            EnableIdempotence = true
        };
        _producer = new ProducerBuilder<string, string>(config).Build();
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await PublishPendingEventsAsync(stoppingToken);
            await Task.Delay(TimeSpan.FromSeconds(2), stoppingToken);
        }
    }

    private async Task PublishPendingEventsAsync(CancellationToken cancellationToken)
    {
        var db = await _connectionHub.CreateSessionAsync("Main", cancellationToken);
        var pendingEvents = await db.QueryFromRoutineAsync<OutboxEvent>(
            "outbox_get_pending",
            cancellationToken: cancellationToken);

        foreach (var outboxEvent in pendingEvents)
        {
            var message = new Message<string, string>
            {
                Key = outboxEvent.AggregateId,
                Value = outboxEvent.Payload
            };

            await _producer.ProduceAsync(outboxEvent.EventType, message, cancellationToken);
            await db.ExecuteRoutineAsync(
                "outbox_mark_published",
                new { outboxEvent.EventId },
                cancellationToken);

            _logger.LogInformation("Published: {EventType} {EventId}", outboxEvent.EventType, outboxEvent.EventId);
        }
    }
}
```

## Idempotence in Consumers

Consumers must be idempotent: processing the same event more than once must not cause incorrect side effects.

Recommended strategy: record `eventId` in a processed events table and verify before executing:

```csharp
var alreadyProcessed = await db.QuerySingleOrDefaultFromRoutineAsync<bool?>(
    "processed_event_exists",
    new { EventId = @event.EventId },
    cancellationToken);

if (alreadyProcessed is true)
{
    _logger.LogWarning("Duplicate event ignored: {EventId}", @event.EventId);
    return;
}
```

## Cross Reference

- [EDA: Concepts](../event-driven-architecture/concepts.md) — event-driven architecture principles and patterns.
- [Kafka/Redpanda as Event Store](../event-sourcing/kafka-redpanda.md)
- [C# with Minimal APIs](./csharp-minimal-apis.md) — event generation from commands.
