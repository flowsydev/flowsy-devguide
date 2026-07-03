# MySQL and MariaDB Conventions

Naming and modeling guidelines for MySQL and MariaDB databases.

MySQL and MariaDB object names in this page are examples unless explicitly described as engine syntax or built-in behavior. Types and functions such as `timestamp`, `datetime`, `json`, `SYSDATE(6)`, `UTC_TIMESTAMP(6)`, `CURRENT_TIMESTAMP(6)` and `NOW(6)` are real MySQL or MariaDB artifacts.

## General Naming

Use the naming convention adopted by the target database community. For MySQL and MariaDB, use lower `snake_case` identifiers to avoid case-sensitivity surprises across operating systems and server settings:

| Object | Convention | Example |
| --- | --- | --- |
| Databases | lower `snake_case` | `ecommerce` |
| Schemas | lower `snake_case` when the database engine or tool uses schema-like grouping | `sales`, `identity` |
| Tables | lower `snake_case` | `shopping_cart`, `user_account` |
| Columns | lower `snake_case` | `shopping_cart_id`, `created_at` |
| Indexes | `ix_<table>_<columns>` | `ix_shopping_cart_user_account_id` |
| Foreign keys | `fk_<table>_<referenced_table>` | `fk_shopping_cart_user_account` |
| CHECK constraints | `ck_<table>_<description>` | `ck_shopping_cart_record_status` |
| Routines | `<aggregate_prefix>_<operation>_<detail>` | `shopping_cart_get_open_by_user_account_id` |

For primary and foreign key column names, keep lower `snake_case` and follow the project language strategy: English names usually use `id` as a suffix, such as `shopping_cart_id`; Spanish names usually use `id` as a prefix, such as `id_carrito_compra`. See [Data and Migrations: Relational Modeling](../relational-modeling.md#primary-and-foreign-keys).

Avoid reserved words, spaces and names that require backticks. MySQL and MariaDB support quoted identifiers, but ordinary project objects should remain unquoted.

## Temporal Types

### Storage Semantics

- Use `timestamp` or `datetime` consistently according to the project storage policy.
- Use `timestamp(6)` with UTC session settings or `datetime(6)` with a strict UTC rule for UTC instants.
- Use `datetime(6)` for canonical system time-zone values and local business date/time values without offset.
- Store the canonical time-zone identifier in global configuration when the project persists internal values in one reference zone.
- For scheduled events tied to a place, store the local date/time and a separate time-zone identifier, such as `scheduled_at_local datetime(6)` plus `time_zone_id varchar(100)`.

| Strategy | MySQL / MariaDB Type | Example |
| --- | --- | --- |
| UTC instant | `timestamp(6)` with UTC session settings, or `datetime(6)` with a strict UTC rule | `created_at_utc timestamp(6) NOT NULL DEFAULT (UTC_TIMESTAMP(6))` |
| Canonical system time zone | `datetime(6)` plus global zone configuration | `created_at datetime(6) NOT NULL` and `global_config.default_time_zone_id = 'America/Mexico_City'` |
| Per-entity time zone | `datetime(6)` plus row zone | `scheduled_at_local datetime(6) NOT NULL`, `time_zone_id varchar(100) NOT NULL` |
| Date-only / time-only | `date`, `time(6)` | `business_date date NOT NULL`, `cutoff_time time(6) NOT NULL` |

### Language and Provider Mapping

MySQL and MariaDB temporal values are sensitive to the selected type, session time zone, driver options and ORM converters. Treat this table as a baseline and verify the exact behavior in integration tests.

| MySQL / MariaDB Type | Meaning | .NET / MySqlConnector or Connector/NET | Java / Connector/J | Python / mysqlclient or mysql-connector-python | Node.js / mysql2 |
| --- | --- | --- | --- | --- | --- |
| `timestamp` | Stored with UTC/session conversion semantics in MySQL-compatible engines. Use carefully for UTC instants. | Usually `DateTime`; keep session time zone and `Kind` policy explicit. | `Instant`, `OffsetDateTime` or `LocalDateTime` according to driver and ORM configuration. | `datetime`; verify whether values are naive or time-zone-aware in the selected driver. | JavaScript `Date` by default in many configurations; verify session time zone and precision. |
| `datetime` | Literal date/time without offset. Use for canonical system time, local values or UTC-by-policy. | `DateTime`. | `LocalDateTime`. | Naive `datetime`. | `Date` or string depending on options; prefer explicit parsing for canonical/local semantics. |
| `date` | Calendar date only. | `DateOnly` or `DateTime` depending on provider and target framework. | `LocalDate`. | `date`. | String, `Date`, or date-only library type according to driver configuration. |
| `time` | Time of day or elapsed time depending on schema meaning. | `TimeOnly` or `TimeSpan` according to provider and meaning. | `LocalTime` or duration type according to meaning. | `time` or `timedelta` according to driver behavior and meaning. | String or time/duration library type. |

Do not rely on server, session or process time-zone defaults without documenting them. For canonical system time, store the reference zone in configuration and treat `datetime` values as local to that zone. For UTC instants, keep the connection/session policy and serialization behavior covered by tests.

### Audit and Domain Columns

- Audit columns should follow the project and domain audit model. Choose actor columns according to what can create or update records: users, applications, service accounts, integrations, devices, tenants or background processes.

Common English examples:

```sql
created_at         timestamp(6) NOT NULL DEFAULT (SYSDATE(6)),
created_by         char(36)     NULL,
updated_at         timestamp(6) NOT NULL DEFAULT (SYSDATE(6)),
updated_by         char(36)     NULL,
active             boolean      NOT NULL DEFAULT TRUE,
-- or: record_status varchar(40) NOT NULL DEFAULT 'Active',
active_from        timestamp(6) NULL,
active_until       timestamp(6) NULL,
public_id          char(36)     NOT NULL
```

Spanish names can be appropriate when the project deliberately keeps the data model in Spanish:

```sql
creado         timestamp(6) NOT NULL DEFAULT (SYSDATE(6)),
creado_por     char(36)     NULL,
modificado     timestamp(6) NOT NULL DEFAULT (SYSDATE(6)),
modificado_por char(36)     NULL,
activo         boolean      NOT NULL DEFAULT TRUE,
-- o: estado_registro varchar(40) NOT NULL DEFAULT 'Activo',
activo_desde timestamp(6) NULL,
activo_hasta timestamp(6) NULL,
id_publico   char(36)     NOT NULL
```

Adjust actor identity types when the project uses binary UUIDs, numeric identifiers, external identity-provider subjects or different actor identifiers.
Use `active` / `activo` for simple existence state, or `record_status` / `estado_registro` when the record needs states such as `Active`, `SoftDeleted` and `HardDeleted`. Add active-state columns such as `active_from`, `active_until`, `activo_desde` and `activo_hasta` only when analysis and design show that the entity needs to record when the record itself is active.
Use `valid` / `vigente` for simple business validity, or `validity_status` / `estado_vigencia` when the domain needs states such as `Valid`, `Revoked` and `Expired`. Use domain-specific validity names when they add clarity, such as `assignment_valid_from` or `asignacion_vigente_desde`.
Do not expose numeric auto-increment primary keys outside backend boundaries. Add `public_id` / `id_publico` with UUID v4 or v7 when records must be referenced from APIs, frontend models or integration contracts.
Update `updated_at` or `modificado` from the routine, trigger or persistence layer that performs the change, using `SYSDATE(6)` when the database engine allows that function at the assignment point.

### Date and Time Functions

Common MySQL and MariaDB date and time functions:

Prefer `SYSDATE(6)` inside routines, triggers or explicit assignments when the value must represent the actual invocation instant. Use automatic timestamp defaults only when statement-start time is acceptable for the project.

| Function | Description | Use Case |
| --- | --- | --- |
| `SYSDATE(6)` | Returns the actual current time at the moment the function is executed. | Routines, triggers or explicit assignments that must capture the real invocation instant. |
| `UTC_TIMESTAMP(6)` | Returns the current UTC timestamp for the statement. | Defaults or assignments where UTC storage matters and statement-level consistency is acceptable. |
| `CURRENT_TIMESTAMP(6)` / `NOW(6)` | Returns the current timestamp in the session time zone for the statement. | Legacy or session-time-zone-aware designs; avoid for cross-system audit fields unless the project has a clear policy. |
| `CURDATE()` | Returns the current date in the session time zone. | Date-only business values where time of day is not relevant. |

## Entity Event Logs

When maintaining an event log per entity, use at least:

```sql
event_timestamp   timestamp(6) NOT NULL DEFAULT (SYSDATE(6)),
event_type        varchar(200) NOT NULL,
payload           json NOT NULL,
operation_context json NULL
```

## SQL Routines

Use the aggregate-oriented routine design from [Migration Concepts](../migration-concepts.md#aggregate-based-routine-design). This page only defines the MySQL and MariaDB physical naming style: lower `snake_case`.

```text
[aggregate_prefix]_[operation_type]_[detail]
```

Examples:

- `shopping_cart_create`
- `shopping_cart_get_open_by_user_account_id`
- `shopping_cart_modify_add_item`

## Change Control

- Manage MySQL or MariaDB schema changes with an explicit migration strategy.
- Keep DDL, indexes, constraints, routines, views and seed/reference changes under source control.
- Choose the migration tool according to the owning stack and database support: Flyway, Liquibase, Sqitch, Atlas, DbUp, EF Core or another approved approach.
- See [Database Migrations: Concepts](/technologies/backend/data-and-migrations/migration-concepts) and [Migration Tools and Strategies](/technologies/backend/data-and-migrations/tools-and-strategies).

## References

- [MySQL Language Structure](https://dev.mysql.com/doc/en/language-structure.html)
- [MariaDB Identifier Names](https://mariadb.com/docs/server/reference/sql-structure/sql-language-structure/identifier-names)
