# MySQL and MariaDB Conventions

Naming and modeling guidelines for MySQL and MariaDB databases.

## General Naming

Use lower `snake_case` identifiers to avoid case-sensitivity surprises across operating systems and server settings:

| Object | Convention | Example |
| --- | --- | --- |
| Databases | `snake_case` | `ecommerce` |
| Tables | `snake_case` | `shopping_cart`, `user_account` |
| Columns | `snake_case` | `shopping_cart_id`, `created_at` |
| Indexes | `ix_<table>_<columns>` | `ix_shopping_cart_user_account_id` |
| Foreign keys | `fk_<table>_<referenced_table>` | `fk_shopping_cart_user_account` |
| CHECK constraints | `ck_<table>_<description>` | `ck_shopping_cart_record_status` |
| Routines | `<aggregate_abbreviation>_<operation>_<detail>` | `shpcrt_get_open_by_user_account_id` |

Avoid reserved words, spaces and names that require backticks. MySQL and MariaDB support quoted identifiers, but ordinary project objects should remain unquoted.

## Temporal Types

- Use `timestamp` or `datetime` consistently according to the project storage policy.
- Store auditable instants in UTC.
- Minimum audit columns per table:

```sql
created_at         timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
created_by_user_id char(36)  NOT NULL,
updated_at         timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
updated_by_user_id char(36)  NOT NULL
```

Adjust identity types when the project uses binary UUIDs or numeric user IDs.

## Entity Event Logs

When maintaining an event log per entity, use at least:

```sql
event_timestamp   timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
event_type        varchar(200) NOT NULL,
payload           json NOT NULL,
operation_context json NULL
```

## Change Control

- Manage MySQL or MariaDB schema changes with an explicit migration strategy.
- Keep DDL, indexes, constraints, routines, views and seed/reference changes under source control.
- Choose the migration tool according to the owning stack and database support: Flyway, Liquibase, Sqitch, Atlas, DbUp, EF Core or another approved approach.
- See [Database Migrations: Concepts](/technologies/backend/database-migrations/concepts) and [Migration Tools and Strategies](/technologies/backend/database-migrations/tools-and-strategies).

## References

- [MySQL Language Structure](https://dev.mysql.com/doc/en/language-structure.html)
- [MariaDB Identifier Names](https://mariadb.com/docs/server/reference/sql-structure/sql-language-structure/identifier-names)
