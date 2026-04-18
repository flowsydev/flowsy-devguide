# Kafka and Redpanda as Event Store

Guide for using Apache Kafka or Redpanda as an event store in systems with Event Sourcing. Both platforms offer an append-only distributed log with configurable retention, suitable for storing event streams per aggregate.

## Why Kafka/Redpanda for Event Sourcing?

| Feature | Kafka / Redpanda |
| --- | --- |
| Persistence | Durable on disk, configurable by time or size |
| Retention | Configurable: days, weeks, indefinite (`retention.ms = -1`) |
| Replay | Consumers can read from the beginning of the log (`earliest`) |
| Partitioning | Ordered streams by partition key (e.g. aggregate ID) |
| Scalability | Millions of events per second |
| Compatibility | Redpanda is compatible with the Kafka protocol |

## Streams per Aggregate

Each aggregate instance has its own stream (topic with partition key):

```text
Topic: shopping-cart-events
  Partition 0: cartId=abc123 → [CartCreated, ItemAdded, ItemAdded, ItemRemoved]
  Partition 1: cartId=def456 → [CartCreated, ItemAdded]
```

Recommendation: use the `aggregateId` as the **partition key** to guarantee order within an aggregate.

## Retention Configuration

For event sourcing, configure indefinite (or very long) retention:

```properties
# Indefinite retention (event sourcing)
retention.ms=-1
retention.bytes=-1

# Or time-based retention (e.g. 5 years)
retention.ms=157680000000
```

## Basic Configuration in .NET

Using `Confluent.Kafka` with `IOptions<T>`:

### Configuration Model

```csharp
public class KafkaSettings
{
    public string BootstrapServers { get; set; } = string.Empty;
    public string ProducerClientId { get; set; } = string.Empty;
    public string ConsumerGroup { get; set; } = string.Empty;
    public string SchemaRegistryUrl { get; set; } = string.Empty;
}
```

```json
// appsettings.json
{
  "Kafka": {
    "BootstrapServers": "localhost:9092",
    "ProducerClientId": "sales-producer",
    "ConsumerGroup": "sales-projections",
    "SchemaRegistryUrl": "http://localhost:8081"
  }
}
```

### Event Publication (Producer)

```csharp
public class KafkaEventStore : IEventStore
{
    private readonly IProducer<string, string> _producer;
    private readonly ILogger<KafkaEventStore> _logger;

    public KafkaEventStore(IOptions<KafkaSettings> settings, ILogger<KafkaEventStore> logger)
    {
        _logger = logger;
        var config = new ProducerConfig
        {
            BootstrapServers = settings.Value.BootstrapServers,
            ClientId = settings.Value.ProducerClientId,
            Acks = Acks.All,           // wait for confirmation from all replicas
            EnableIdempotence = true   // guarantee exactly-once in the log
        };
        _producer = new ProducerBuilder<string, string>(config).Build();
    }

    public async Task AppendEventAsync<TEvent>(
        string streamName,
        string aggregateId,
        TEvent @event,
        CancellationToken cancellationToken = default)
        where TEvent : class
    {
        var payload = JsonSerializer.Serialize(@event);
        var message = new Message<string, string>
        {
            Key = aggregateId,       // guarantees order per aggregate
            Value = payload
        };

        var result = await _producer.ProduceAsync(streamName, message, cancellationToken);
        _logger.LogInformation(
            "Event persisted: {Stream} offset={Offset} partition={Partition}",
            streamName,
            result.Offset,
            result.Partition);
    }
}
```

### State Reconstruction from the Log (Consumer)

```csharp
public class ShoppingCartProjectionBuilder
{
    private readonly IConsumer<string, string> _consumer;

    public ShoppingCartProjectionBuilder(IOptions<KafkaSettings> settings)
    {
        var config = new ConsumerConfig
        {
            BootstrapServers = settings.Value.BootstrapServers,
            GroupId = settings.Value.ConsumerGroup,
            AutoOffsetReset = AutoOffsetReset.Earliest,  // read from beginning
            EnableAutoCommit = false
        };
        _consumer = new ConsumerBuilder<string, string>(config).Build();
    }

    public async Task<ShoppingCartState> ReconstructAsync(
        string cartId,
        CancellationToken cancellationToken = default)
    {
        _consumer.Assign(new TopicPartitionOffset("shopping-cart-events", 0, Offset.Beginning));

        var state = new ShoppingCartState();

        while (!cancellationToken.IsCancellationRequested)
        {
            var result = _consumer.Consume(TimeSpan.FromMilliseconds(500));
            if (result is null) break;
            if (result.Message.Key != cartId) continue;

            var eventEnvelope = JsonSerializer.Deserialize<EventEnvelope>(result.Message.Value);
            state.Apply(eventEnvelope);
        }

        return state;
    }
}
```

## Event Envelope

Include standard metadata in all stored events:

```csharp
public record EventEnvelope(
    string EventId,
    string EventType,
    string EventVersion,
    string AggregateId,
    string AggregateType,
    DateTimeOffset Timestamp,
    string CorrelationId,
    JsonElement Payload);
```

## Redpanda vs Kafka

| Aspect | Apache Kafka | Redpanda |
| --- | --- | --- |
| API Compatibility | Native protocol | Kafka compatible (drop-in replacement) |
| Operation | Requires ZooKeeper (or KRaft) | No ZooKeeper, simpler to operate |
| Latency | Good | Lower p99 latency |
| Ecosystem | Very mature, extensive documentation | Growing, compatible with Kafka tools |
| Recommended use | Large-scale production | Local development, smaller-scale environments |

Redpanda can be used as a Kafka replacement in local development without code changes in .NET (same `Confluent.Kafka` library).

## Cross Reference

- [Event Sourcing: Concepts](./concepts.md)
- [EDA: Background Services in C#](../event-driven-architecture/csharp-background-services.md)
- [EDA: Concepts](../event-driven-architecture/concepts.md)
