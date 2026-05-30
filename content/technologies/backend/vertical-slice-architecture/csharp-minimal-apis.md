# VSA: C# with Minimal APIs

Complete implementation examples of Vertical Slices in C# using Minimal APIs, following the conventions of the Flowsy ecosystem.

This page is the C#/.NET implementation companion to the technology-agnostic [VSA concepts](./concepts.md). Start with the concepts when deciding slice boundaries, then use this page for concrete files, libraries and code.

The examples use English domain terminology, aligned with the predominant language and community context of this guide. Projects should adapt business identifiers to the ubiquitous language chosen for their own domain.

For HTTP API maturity, status codes and RFC 9457 Problem Details, see [HTTP API Design](../api-design.md).

## Feature-Set Folder Structure

A complete feature-set organizes its slices under a module and submodule path. `Commands` and `Queries` contain one subfolder per slice. `Infrastructure` holds shared finders and services. `Model` holds data structures and enums shared by multiple slices.

```text
📁 Features/[Module]/[Submodule]/
├── 📁 Commands/
│   └── 📁 [ActionName]/
│       ├── 📄 [ActionName]Endpoint.cs           ← Minimal API endpoint
│       ├── 📄 [ActionName]Command.cs            ← Command + Result + Handler
│       ├── 📄 [ActionName]CommandValidator.cs   ← Validation with FluentValidation
│       └── 📄 [ActionName]State.cs              ← State + IStateHandler + StateHandler
├── 📁 Infrastructure/
│   ├── 📄 [EntityName]Finder.cs                ← read-only lookups shared across slices
│   ├── 📄 [ServiceName]Gateway.cs              ← external API or service integration
│   └── 📄 [ServiceName]Publisher.cs            ← event or message publishing
├── 📁 Model/
│   ├── 📄 ShoppingCartOverview.cs              ← decision data loaded into State classes
│   ├── 📄 CartCheckoutPreview.cs               ← full cart data for checkout and confirmation
│   ├── 📄 ProductOption.cs                     ← minimal product data for the item picker
│   └── 📄 ShoppingCartStatus.cs               ← shared enums
└── 📁 Queries/
    └── 📁 [ActionName]/
        ├── 📄 [ActionName]Endpoint.cs           ← Minimal API endpoint
        ├── 📄 [ActionName]Query.cs              ← Query + Result + Handler
        └── 📄 [ActionName]QueryValidator.cs     ← Validation with FluentValidation (optional)
```

## Endpoints

Endpoints are the HTTP entry point for each slice. A single static class with a `Map(RouteGroupBuilder)` method registers the route and wires it to its command or query.

- Keep endpoints thin — bind input, dispatch to the handler, return a typed result. No business logic or domain rules.
- Name the file `[ActionName]Endpoint.cs`.
- Map to HTTP verbs with `MapPost`, `MapGet`, `MapPut` or `MapDelete`.
- Dispatch through `IMediator`, or inject the handler directly if the project does not use the Mediator pattern.
- Use `.WithSummary()` for a one-line title and `.WithDescription()` for extended context — preconditions, enforced rules, return behavior and notable failure scenarios. Declare known responses with `.Produces<>()` and `.ProducesValidationProblem()`.

```csharp
routeGroup.MapPost("/projects", CreateProjectAsync)
    .WithSummary("Create a project.")
    .WithDescription("""
        Creates a new project under the authenticated organization.
        The project name must be unique within the organization.
        Returns the project summary including the assigned identifier and creation timestamp.
        """)
    .Produces<ProjectSummary>(StatusCodes.Status201Created)
    .ProducesValidationProblem(StatusCodes.Status422UnprocessableEntity)
    .Produces<ProblemDetails>(StatusCodes.Status404NotFound, "application/problem+json")
    .Produces<ProblemDetails>(StatusCodes.Status409Conflict, "application/problem+json");
```

### HTTP Results and Problem Details

Centralize repeated domain-error mapping in a global exception handler that returns RFC 9457 Problem Details.

## Commands

- Name in **imperative** form using the selected business language: `CreateShoppingCart`, `SuspendUserAccount`, `AddItemToCart`.
- Files:
  - `[ActionName]Command.cs` — `record Command`, `record CommandResult`, `class CommandHandler`.
  - `[ActionName]CommandValidator.cs` — validation with FluentValidation.
  - `[ActionName]State.cs` — `class State`, `interface IStateHandler`, `class StateHandler`.

## Queries

- Name as **report or screen titles**: `AbandonedCarts`, `SuspendedUsers`.
- Files:
  - `[ActionName]Query.cs` — `record Query`, `record QueryResult`, `class QueryHandler`.
  - `[ActionName]QueryValidator.cs` — optional.

## Model

Data structures in the `Model` folder are shared by multiple commands and queries of the same module. Each model should be named after its purpose and context of use — not after a technical level of completeness. The same aggregate may need several read models for different scenarios: one loaded into `State` classes for decision-making, another for a detail review screen, and a third with only the fields needed for a lookup picker. Each deserves a name that makes its role immediately clear.

### Naming Recommendations

#### Name models after their context of use

Choose names that describe what the model is used for and which data it exposes in that context. Avoid mechanical tier patterns (`EntityCompact` + `EntityOverview` + `EntityDetail`) — add a model only when a specific behavior requires a data shape that no existing model covers, and name it after that need.

| Context | Example | Avoid |
| --- | --- | --- |
| Decision data loaded into `State` classes | `ShoppingCartOverview` | `ShoppingCartDto`, `ShoppingCartData` |
| Full data for a review or confirmation screen | `CartCheckoutPreview` | `ShoppingCartDetail`, `ShoppingCartFull` |
| Minimal data for a lookup — no sensitive fields | `ProductOption` | `ProductCompact`, `ProductLight` |
| Categorized states of an aggregate | `ShoppingCartStatus` | `CartStatusEnum`, `Status` |

#### Avoid suffixes that describe structure or size, not purpose

Technical suffixes — `Dto`, `Model`, `Data`, `Base` — describe structure rather than domain meaning. Generic completeness suffixes — `Compact`, `Slim`, `Light`, `Full` — describe size without conveying the model's actual role.

```csharp
// Prefer: name reflects the model's role in the domain
public record ShoppingCartOverview(...);   // decision context for State classes
public record CartCheckoutPreview(...);    // full data for checkout screens
public record ProductOption(...);          // minimal data for the product picker

// Avoid: suffix describes structure or size, not domain role
public record ShoppingCartDto(...);
public record ShoppingCartCompact(...);
public record ProductLight(...);
```

#### Enum values must reflect the agreed domain vocabulary

Enum names should be self-contained. Values must express the actual states the domain recognizes, not generic lifecycle terms or technical sequences.

| Prefer | Avoid | Reason |
| --- | --- | --- |
| `Open`, `Abandoned`, `Converted` | `Active`, `Inactive`, `State1` | Generic lifecycle terms and numeric sequences hide business meaning. |
| `ShoppingCartStatus` | `CartStatusEnum`, `Status` | The `Enum` suffix and single-word names add noise without adding clarity. |

## State and StateHandler

`State` and `StateHandler` are the VSA pair that implements the DCB mental model: load the minimum decision data, validate the business rules, then persist the result with an explicit consistency boundary. See [Domain-Driven Design](../../../discovery/domain-driven-design.md) for the design principle and implementation path guidance.

### Responsibilities

| Component | Responsibility |
| --- | --- |
| `State` | Holds the decision data and exposes methods that enforce domain invariants. Contains no I/O. |
| `IStateHandler` | Defines the load and persist contract for one behavior or a group of behaviors that share the same aggregate scope. |
| `StateHandler` | Implements `IStateHandler`. Handles all database interaction — loads data into `State` and persists the result. Contains no domain rules. |

### Naming

#### Name `State` after the behavior, not the entity

The `State` class models the decision context of a specific behavior. Naming it after the entity is too broad and hides which rules it enforces.

```csharp
// Prefer: names the behavior
public sealed class StudentJoinsCourseState { ... }
public interface IStudentJoinsCourseStateHandler
    : IStateHandler<StudentJoinsCourseState, StudentCourseKey>;

// Avoid: names the entity — too broad, hides intent
public sealed class StudentState { ... }
```

#### Name shared `State` after the aggregate condition

When two or more commands share the same decision data, the `State` name should describe the aggregate condition that makes the behavior possible, not one specific action.

```csharp
// AddItemToCart and RemoveItemFromCart both require an open cart
public sealed class OpenShoppingCartState { ... }
public interface IOpenShoppingCartStateHandler
    : IStateHandler<OpenShoppingCartState, Guid>;
```

#### Naming conventions for State and StateHandler

| Concept | Convention | Example |
| --- | --- | --- |
| Behavior-specific State | `[BehaviorName]State` | `StudentJoinsCourseState` |
| Shared State | `[AggregateCondition]State` | `OpenShoppingCartState` |
| Handler interface | `I[StateName]Handler` | `IStudentJoinsCourseStateHandler` |
| Handler implementation | `[StateName]Handler` | `StudentJoinsCourseStateHandler` |

Avoid generic or entity-named suffixes: `StudentStateModel`, `CartStateData`, `IShoppingCartStateHandlerInterface`.

### Implementation Recommendations

#### `State` only holds data and validates rules — no I/O

The constructor receives plain decision data. Services, repositories and database connections have no place inside `State`.

```csharp
public sealed class StudentJoinsCourseState
{
    public StudentJoinsCourseState(
        IReadOnlyCollection<CourseEnrollment> studentEnrollments,
        IReadOnlyCollection<CourseEnrollment> courseEnrollments)
    {
        StudentEnrollments = studentEnrollments;
        CourseEnrollments = courseEnrollments;
    }

    public IReadOnlyCollection<CourseEnrollment> StudentEnrollments { get; }
    public IReadOnlyCollection<CourseEnrollment> CourseEnrollments { get; }

    public void EnsureStudentHasCapacity() { ... }
    public void EnsureCourseHasCapacity() { ... }
    public void EnsureStudentIsNotAlreadyEnrolled() { ... }
}
```

#### Validation methods throw on violation — they do not return booleans

Throwing keeps the command handler clean and makes the violated invariant unambiguous.

```csharp
// Prefer: throws, so the handler needs no conditional logic
public void EnsureStudentHasCapacity()
{
    if (StudentEnrollments.Count(e => e.IsActive) >= 5)
        throw new DomainStateValidationException("The student cannot exceed 5 active courses.");
}

// Avoid: the caller must interpret the return value and decide what to do
public bool CanStudentJoin() => StudentEnrollments.Count(e => e.IsActive) < 5;
```

#### `StateHandler` is an orchestrator — no domain logic

The handler calls the database and delegates all rule evaluation to `State`. It should contain no `if` statements that encode business rules.

#### `State` is independently testable

Because `State` receives plain data in its constructor and has no I/O dependencies, it can be unit-tested by instantiating it directly — no mocks required.

```csharp
[Fact]
public void EnsureCourseHasCapacity_ThrowsWhenFull()
{
    var enrollments = Enumerable.Range(0, 30)
        .Select(_ => new CourseEnrollment(Guid.NewGuid(), _courseId, isActive: true))
        .ToList();

    var state = new StudentJoinsCourseState([], enrollments);

    Assert.Throws<DomainStateValidationException>(
        () => state.EnsureCourseHasCapacity());
}
```

Use typed results for the success path in the endpoint:

```csharp
public static async Task<Created<ProjectSummary>> CreateProjectAsync(
        CreateProjectCommand command,
        IMediator mediator,
        CancellationToken cancellationToken)
{
    var result = await mediator.SendAsync(command, cancellationToken);
    var response = new ProjectSummary(result.ProjectId, result.Name);
    return TypedResults.Created($"/projects/{result.ProjectId}", response);
}
```

Map domain exceptions once in the API boundary:

```csharp
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<ApiExceptionHandler>();

var app = builder.Build();

app.UseExceptionHandler();
```

```csharp
public sealed class ApiExceptionHandler : IExceptionHandler
{
    private readonly IProblemDetailsService _problemDetailsService;

    public ApiExceptionHandler(IProblemDetailsService problemDetailsService)
    {
        _problemDetailsService = problemDetailsService;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var problem = exception switch
        {
            EntityNotFoundException ex => CreateProblem(
                StatusCodes.Status404NotFound,
                "https://docs.example.org/problems/entity-not-found",
                "Entity Not Found",
                ex.Message,
                "entity.notFound"),

            DomainConflictException ex => CreateProblem(
                StatusCodes.Status409Conflict,
                "https://docs.example.org/problems/domain-conflict",
                "Domain Conflict",
                ex.Message,
                "domain.conflict"),

            DomainValidationException ex => CreateProblem(
                StatusCodes.Status422UnprocessableEntity,
                "https://docs.example.org/problems/validation-failed",
                "Validation Failed",
                ex.Message,
                "validation.failed"),

            _ => CreateProblem(
                StatusCodes.Status500InternalServerError,
                "https://docs.example.org/problems/unexpected-error",
                "Unexpected Error",
                "An unexpected error occurred.",
                "unexpected.error")
        };

        httpContext.Response.StatusCode = problem.Status ?? StatusCodes.Status500InternalServerError;

        return await _problemDetailsService.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            ProblemDetails = problem,
            Exception = exception
        });
    }

    private static ProblemDetails CreateProblem(
        int status,
        string type,
        string title,
        string detail,
        string code)
    {
        var problem = new ProblemDetails
        {
            Status = status,
            Type = type,
            Title = title,
            Detail = detail
        };

        problem.Extensions["code"] = code;
        return problem;
    }
}
```

This keeps every endpoint focused on input binding, mediation and successful response construction. The global handler owns the repeated mapping from domain errors to HTTP status codes, `application/problem+json`, stable `code` values and sanitized details.

---

## Example 1: Create a Shopping Cart

**Location**: `Features/Sales/OrderPlacement/Commands/CreateCart/`

### CreateShoppingCartEndpoint.cs

#### With Mediator

```csharp
public static class CreateShoppingCartEndpoint
{
    public static void Map(RouteGroupBuilder routeGroup)
    {
        routeGroup.MapPost("/sales/shopping-carts", async (
            CreateShoppingCartCommand command,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            var result = await mediator.SendAsync(command, cancellationToken);
            return Results.Ok(result);
        })
        .MapToApiVersion(1)
        .WithSummary("Create a new shopping cart.")
        .WithDescription("""
            Creates a new open shopping cart for the specified user account.
            The operation is rejected if the user already has an open cart.
            Returns the identifier of the newly created cart.
            """)
        .Produces<CreateShoppingCartCommandResult>()
        .Produces(StatusCodes.Status400BadRequest);
    }
}
```

#### Without Mediator (direct handler)

```csharp
public static class CreateShoppingCartEndpoint
{
    public static void Map(RouteGroupBuilder routeGroup)
    {
        routeGroup.MapPost("/sales/shopping-carts", async (
            CreateShoppingCartCommand command,
            CreateShoppingCartCommandHandler commandHandler,
            CancellationToken cancellationToken) =>
        {
            var result = await commandHandler.HandleAsync(command, cancellationToken);
            return Results.Ok(result);
        })
        .MapToApiVersion(1)
        .WithSummary("Create a new shopping cart.")
        .WithDescription("""
            Creates a new open shopping cart for the specified user account.
            The operation is rejected if the user already has an open cart.
            Returns the identifier of the newly created cart.
            """)
        .Produces<CreateShoppingCartCommandResult>()
        .Produces(StatusCodes.Status400BadRequest);
    }
}
```

### CreateShoppingCartCommand.cs

```csharp
public record CreateShoppingCartCommand(Guid UserAccountId)
    : ApplicationRequest<CreateShoppingCartCommandResult>;

public record CreateShoppingCartCommandResult(Guid ShoppingCartId);

public class CreateShoppingCartCommandHandler
    : ApplicationRequestHandler<CreateShoppingCartCommand, CreateShoppingCartCommandResult>
{
    private readonly ICreateShoppingCartStateHandler _stateHandler;

    public CreateShoppingCartCommandHandler(ICreateShoppingCartStateHandler stateHandler)
    {
        _stateHandler = stateHandler;
    }

    public async Task<CreateShoppingCartCommandResult> HandleAsync(
        CreateShoppingCartCommand request,
        CancellationToken cancellationToken = default)
    {
        var state = await _stateHandler.LoadStateAsync(request.UserAccountId, cancellationToken);
        var shoppingCartId = state.CreateShoppingCart(request.UserAccountId);
        await _stateHandler.SaveStateAsync(state, cancellationToken);
        return new CreateShoppingCartCommandResult(shoppingCartId);
    }
}
```

### CreateShoppingCartCommandValidator.cs

```csharp
public class CreateShoppingCartCommandValidator : AbstractValidator<CreateShoppingCartCommand>
{
    public CreateShoppingCartCommandValidator()
    {
        RuleFor(command => command.UserAccountId)
            .NotEmpty().WithMessage("The user account ID cannot be empty.");
    }
}
```

### CreateShoppingCartState.cs

```csharp
public record NewShoppingCart(Guid ShoppingCartId, Guid UserAccountId, DateTimeOffset CreationInstant);

public class CreateShoppingCartState
{
    // ShoppingCartOverview defined in Features/Sales/OrderPlacement/Model/ShoppingCartOverview.cs
    private readonly ShoppingCartOverview? _existingCart;

    public NewShoppingCart? NewShoppingCart { get; private set; }

    public CreateShoppingCartState(ShoppingCartOverview? existingCart)
    {
        _existingCart = existingCart;
    }

    public Guid CreateShoppingCart(Guid userAccountId)
    {
        if (_existingCart is not null)
            throw new DomainStateValidationException("The user already has an open shopping cart.");

        var shoppingCartId = Guid.NewGuid();
        var creationInstant = Clock.GetTimestamp();
        NewShoppingCart = new NewShoppingCart(shoppingCartId, userAccountId, creationInstant);
        return shoppingCartId;
    }
}

public interface ICreateShoppingCartStateHandler : IStateHandler<CreateShoppingCartState, Guid>;

public class CreateShoppingCartStateHandler : ICreateShoppingCartStateHandler
{
    private readonly IDbConnectionHub _connectionHub;

    public CreateShoppingCartStateHandler(IDbConnectionHub connectionHub)
    {
        _connectionHub = connectionHub;
    }

    public async Task<CreateShoppingCartState> LoadStateAsync(
        Guid userAccountId,
        CancellationToken cancellationToken = default)
    {
        var db = await _connectionHub.CreateSessionAsync("Ecommerce", cancellationToken);
        var existingCart = await db.QuerySingleOrDefaultFromRoutineAsync<ShoppingCartOverview>(
            "sales.shpcrt_get_open_by_user_account_id",
            new { UserAccountId = userAccountId },
            cancellationToken);
        return new CreateShoppingCartState(existingCart);
    }

    public async Task SaveStateAsync(
        CreateShoppingCartState state,
        CancellationToken cancellationToken = default)
    {
        var newCart = state.NewShoppingCart
            ?? throw new DomainStateValidationException("No new shopping cart has been created.");

        var db = await _connectionHub.CreateSessionAsync("Ecommerce", cancellationToken);
        await db.BeginTransactionAsync();
        await db.ExecuteRoutineAsync(
            "sales.shpcrt_create",
            new
            {
                newCart.ShoppingCartId,
                newCart.UserAccountId,
                newCart.CreationInstant
            },
            cancellationToken);
        await db.CommitTransactionAsync(cancellationToken);
    }
}
```

---

## Example 2: Add and Remove Items (Shared State)

**Location**: `Features/Sales/OrderPlacement/Commands/ModifyCart/`

The `AddItemToCart` and `RemoveItemFromCart` actions share the same `State` because they operate on the same aggregate (the open cart).

### AddItemToShoppingCartEndpoint.cs

#### With Mediator

```csharp
public record AddItemToShoppingCartRequest(Guid ProductId, double Quantity);

public static class AddItemToShoppingCartEndpoint
{
    public static void Map(RouteGroupBuilder routeGroup)
    {
        routeGroup.MapPost("/sales/shopping-carts/{shoppingCartId}/items", async (
            Guid shoppingCartId,
            AddItemToShoppingCartRequest request,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            var command = new AddItemToShoppingCartCommand(shoppingCartId, request.ProductId, request.Quantity);
            var result = await mediator.SendAsync(command, cancellationToken);
            return Results.Ok(result);
        })
        .MapToApiVersion(1)
        .WithSummary("Add an item to the shopping cart.")
        .WithDescription("""
            Adds a product to the user's open shopping cart with the specified quantity.
            Requires the product to exist and the cart to be in an open state.
            Returns the new item identifier and an updated cart summary.
            """)
        .Produces<AddItemToShoppingCartCommandResult>()
        .Produces(StatusCodes.Status400BadRequest);
    }
}
```

#### Without Mediator (direct handler)

```csharp
public record AddItemToShoppingCartRequest(Guid ProductId, double Quantity);

public static class AddItemToShoppingCartEndpoint
{
    public static void Map(RouteGroupBuilder routeGroup)
    {
        routeGroup.MapPost("/sales/shopping-carts/{shoppingCartId}/items", async (
            Guid shoppingCartId,
            AddItemToShoppingCartRequest request,
            AddItemToShoppingCartCommandHandler commandHandler,
            CancellationToken cancellationToken) =>
        {
            var command = new AddItemToShoppingCartCommand(shoppingCartId, request.ProductId, request.Quantity);
            var result = await commandHandler.HandleAsync(command, cancellationToken);
            return Results.Ok(result);
        })
        .MapToApiVersion(1)
        .WithSummary("Add an item to the shopping cart.")
        .WithDescription("""
            Adds a product to the user's open shopping cart with the specified quantity.
            Requires the product to exist and the cart to be in an open state.
            Returns the new item identifier and an updated cart summary.
            """)
        .Produces<AddItemToShoppingCartCommandResult>()
        .Produces(StatusCodes.Status400BadRequest);
    }
}
```

### AddItemToShoppingCartCommand.cs

```csharp
public record AddItemToShoppingCartCommand(Guid ShoppingCartId, Guid ProductId, double Quantity)
    : ApplicationRequest<AddItemToShoppingCartCommandResult>;

public record AddItemToShoppingCartCommandResult(Guid ItemId, ShoppingCartSummary Summary);

public class AddItemToShoppingCartCommandHandler
    : ApplicationRequestHandler<AddItemToShoppingCartCommand, AddItemToShoppingCartCommandResult>
{
    private readonly IProductFinder _productFinder;
    private readonly IOpenShoppingCartStateHandler _stateHandler;

    public AddItemToShoppingCartCommandHandler(
        IProductFinder productFinder,
        IOpenShoppingCartStateHandler stateHandler)
    {
        _productFinder = productFinder;
        _stateHandler = stateHandler;
    }

    public async Task<AddItemToShoppingCartCommandResult> HandleAsync(
        AddItemToShoppingCartCommand request,
        CancellationToken cancellationToken = default)
    {
        var (shoppingCartId, productId, quantity) = request;

        var product = await _productFinder.GetProductOverviewByIdAsync(productId, cancellationToken)
            ?? throw new DomainStateValidationException($"Product with ID {productId} was not found.");

        var state = await _stateHandler.LoadStateAsync(shoppingCartId, cancellationToken);
        var itemId = state.AddItem(product, quantity);
        await _stateHandler.SaveStateAsync(state, cancellationToken);

        return new AddItemToShoppingCartCommandResult(itemId, state.Summary);
    }
}
```

### AddItemToShoppingCartCommandValidator.cs

```csharp
public class AddItemToShoppingCartCommandValidator : AbstractValidator<AddItemToShoppingCartCommand>
{
    public AddItemToShoppingCartCommandValidator()
    {
        RuleFor(c => c.ShoppingCartId).NotEmpty();
        RuleFor(c => c.ProductId).NotEmpty();
        RuleFor(c => c.Quantity).GreaterThan(0);
    }
}
```

### RemoveItemFromShoppingCartEndpoint.cs

#### With Mediator

```csharp
public static class RemoveItemFromShoppingCartEndpoint
{
    public static void Map(RouteGroupBuilder routeGroup)
    {
        routeGroup.MapDelete("/sales/shopping-carts/{shoppingCartId}/items/{itemId}", async (
            Guid shoppingCartId,
            Guid itemId,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            var command = new RemoveItemFromShoppingCartCommand(shoppingCartId, itemId);
            var result = await mediator.SendAsync(command, cancellationToken);
            return Results.Ok(result);
        })
        .MapToApiVersion(1)
        .WithSummary("Remove an item from the shopping cart.")
        .WithDescription("""
            Removes an item from the user's open shopping cart.
            Requires the cart to be in an open state and the item to exist in it.
            Returns an updated cart summary reflecting the removal.
            """)
        .Produces<RemoveItemFromShoppingCartCommandResult>()
        .Produces(StatusCodes.Status400BadRequest);
    }
}
```

#### Without Mediator (direct handler)

```csharp
public static class RemoveItemFromShoppingCartEndpoint
{
    public static void Map(RouteGroupBuilder routeGroup)
    {
        routeGroup.MapDelete("/sales/shopping-carts/{shoppingCartId}/items/{itemId}", async (
            Guid shoppingCartId,
            Guid itemId,
            RemoveItemFromShoppingCartCommandHandler commandHandler,
            CancellationToken cancellationToken) =>
        {
            var command = new RemoveItemFromShoppingCartCommand(shoppingCartId, itemId);
            var result = await commandHandler.HandleAsync(command, cancellationToken);
            return Results.Ok(result);
        })
        .MapToApiVersion(1)
        .WithSummary("Remove an item from the shopping cart.")
        .WithDescription("""
            Removes an item from the user's open shopping cart.
            Requires the cart to be in an open state and the item to exist in it.
            Returns an updated cart summary reflecting the removal.
            """)
        .Produces<RemoveItemFromShoppingCartCommandResult>()
        .Produces(StatusCodes.Status400BadRequest);
    }
}
```

### RemoveItemFromShoppingCartCommand.cs

```csharp
public record RemoveItemFromShoppingCartCommand(Guid ShoppingCartId, Guid ShoppingCartItemId)
    : ApplicationRequest<RemoveItemFromShoppingCartCommandResult>;

public record RemoveItemFromShoppingCartCommandResult(ShoppingCartSummary Summary);

public class RemoveItemFromShoppingCartCommandHandler
    : ApplicationRequestHandler<RemoveItemFromShoppingCartCommand, RemoveItemFromShoppingCartCommandResult>
{
    private readonly IOpenShoppingCartStateHandler _stateHandler;

    public RemoveItemFromShoppingCartCommandHandler(IOpenShoppingCartStateHandler stateHandler)
    {
        _stateHandler = stateHandler;
    }

    public async Task<RemoveItemFromShoppingCartCommandResult> HandleAsync(
        RemoveItemFromShoppingCartCommand request,
        CancellationToken cancellationToken = default)
    {
        var (shoppingCartId, itemId) = request;
        var state = await _stateHandler.LoadStateAsync(shoppingCartId, cancellationToken);
        state.RemoveItem(itemId);
        await _stateHandler.SaveStateAsync(state, cancellationToken);
        return new RemoveItemFromShoppingCartCommandResult(state.Summary);
    }
}
```

### OpenShoppingCartState.cs (Shared State for ModifyCart)

```csharp
public record ShoppingCartItem(
    Guid ShoppingCartItemId,
    Guid ProductId,
    string ProductName,
    decimal ProductPrice,
    double Quantity,
    decimal TotalPrice,
    bool Added = false,
    bool Removed = false);

public record ShoppingCartSummary(Guid ShoppingCartId, int TotalItems, double TotalProducts, decimal TotalPrice);

public class OpenShoppingCartState
{
    public ShoppingCartOverview? ShoppingCart { get; }

    private readonly List<ShoppingCartItem> _items = [];
    public IReadOnlyList<ShoppingCartItem> Items => _items.AsReadOnly();
    public ShoppingCartSummary Summary { get; private set; }

    public OpenShoppingCartState(ShoppingCartOverview? shoppingCart, IEnumerable<ShoppingCartItem> items)
    {
        ShoppingCart = shoppingCart;
        _items.AddRange(items);
        Summary = BuildSummary();
    }

    public Guid AddItem(ProductOverview product, double quantity)
    {
        if (ShoppingCart is null)
            throw new DomainStateValidationException("Shopping cart was not found.");

        var itemId = Guid.NewGuid();
        var item = new ShoppingCartItem(
            itemId,
            product.ProductId,
            product.ProductName,
            product.Price,
            quantity,
            product.Price * (decimal)quantity,
            Added: true);
        _items.Add(item);
        Summary = BuildSummary();
        return itemId;
    }

    public void RemoveItem(Guid itemId)
    {
        var item = _items.FirstOrDefault(i => i.ShoppingCartItemId == itemId)
            ?? throw new DomainStateValidationException($"Item {itemId} was not found.");
        _items.Remove(item);
        _items.Add(item with { Removed = true });
        Summary = BuildSummary();
    }

    private ShoppingCartSummary BuildSummary()
    {
        var activeItems = _items.Where(i => !i.Removed).ToList();
        return new ShoppingCartSummary(
            ShoppingCart?.ShoppingCartId ?? Guid.Empty,
            activeItems.Count,
            activeItems.Sum(i => i.Quantity),
            activeItems.Sum(i => i.TotalPrice));
    }
}

public interface IOpenShoppingCartStateHandler : IStateHandler<OpenShoppingCartState, Guid>;

public class OpenShoppingCartStateHandler : IOpenShoppingCartStateHandler
{
    private readonly IDbConnectionHub _connectionHub;

    public OpenShoppingCartStateHandler(IDbConnectionHub connectionHub)
    {
        _connectionHub = connectionHub;
    }

    public async Task<OpenShoppingCartState> LoadStateAsync(
        Guid shoppingCartId,
        CancellationToken cancellationToken = default)
    {
        var db = await _connectionHub.CreateSessionAsync("Ecommerce", cancellationToken);

        var shoppingCart = await db.QuerySingleOrDefaultFromRoutineAsync<ShoppingCartOverview>(
            "sales.shpcrt_get_overview_by_id",
            new { ShoppingCartId = shoppingCartId },
            cancellationToken);

        IEnumerable<ShoppingCartItem> items = [];
        if (shoppingCart is not null)
        {
            items = await db.QueryFromRoutineAsync<ShoppingCartItem>(
                "sales.shpcrt_get_items_by_cart_id",
                new { ShoppingCartId = shoppingCartId },
                cancellationToken);
        }

        return new OpenShoppingCartState(shoppingCart, items);
    }

    public async Task SaveStateAsync(
        OpenShoppingCartState state,
        CancellationToken cancellationToken = default)
    {
        var db = await _connectionHub.CreateSessionAsync("Ecommerce", cancellationToken);
        await db.BeginTransactionAsync();

        var (shoppingCartId, totalItems, totalProducts, totalPrice) = state.Summary;

        foreach (var item in state.Items)
        {
            if (item.Added)
            {
                await db.ExecuteRoutineAsync(
                    "sales.shpcrt_add_item",
                    new
                    {
                        ShoppingCartId = shoppingCartId,
                        ItemId = item.ShoppingCartItemId,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity
                    },
                    cancellationToken);
            }
            else if (item.Removed)
            {
                await db.ExecuteRoutineAsync(
                    "sales.shpcrt_remove_item",
                    new
                    {
                        ShoppingCartId = shoppingCartId,
                        ItemId = item.ShoppingCartItemId
                    },
                    cancellationToken);
            }
        }

        await db.ExecuteRoutineAsync(
            "sales.shpcrt_update_summary",
            new
            {
                ShoppingCartId = shoppingCartId,
                TotalItems = totalItems,
                TotalProducts = totalProducts,
                TotalPrice = totalPrice
            },
            cancellationToken);

        await db.CommitTransactionAsync(cancellationToken);
    }
}
```

---

## Example 3: Queries

**Location**: `Features/Sales/OrderPlacement/Queries/`

Queries extract domain information without modifying state. The endpoint uses `[AsParameters]` to bind query string parameters to a record.

### AbandonedCarts — Paginated list with filter

**Location**: `Features/Sales/OrderPlacement/Queries/AbandonedCarts/`

#### AbandonedCartsEndpoint.cs

##### With Mediator

```csharp
public static class AbandonedCartsEndpoint
{
    public static void Map(RouteGroupBuilder routeGroup)
    {
        routeGroup.MapGet("/sales/shopping-carts/abandoned", async (
            [AsParameters] AbandonedCartsQuery query,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            var result = await mediator.SendAsync(query, cancellationToken);
            return Results.Ok(result);
        })
        .MapToApiVersion(1)
        .WithSummary("Query abandoned shopping carts.")
        .WithDescription("""
            Returns a paginated list of shopping carts that have been inactive for at least the specified number of days,
            defaulting to seven when no threshold is provided.
            Results include the user's contact information, item count and total amount for each cart.
            """)
        .Produces<AbandonedCartsQueryResult>()
        .Produces(StatusCodes.Status400BadRequest);
    }
}
```

##### Without Mediator (direct handler)

```csharp
public static class AbandonedCartsEndpoint
{
    public static void Map(RouteGroupBuilder routeGroup)
    {
        routeGroup.MapGet("/sales/shopping-carts/abandoned", async (
            [AsParameters] AbandonedCartsQuery query,
            AbandonedCartsQueryHandler queryHandler,
            CancellationToken cancellationToken) =>
        {
            var result = await queryHandler.HandleAsync(query, cancellationToken);
            return Results.Ok(result);
        })
        .MapToApiVersion(1)
        .WithSummary("Query abandoned shopping carts.")
        .WithDescription("""
            Returns a paginated list of shopping carts that have been inactive for at least the specified number of days,
            defaulting to seven when no threshold is provided.
            Results include the user's contact information, item count and total amount for each cart.
            """)
        .Produces<AbandonedCartsQueryResult>()
        .Produces(StatusCodes.Status400BadRequest);
    }
}
```

#### AbandonedCartsQuery.cs

```csharp
public record AbandonedCartsQuery(
    int PageNumber = 1,
    int PageSize = 20,
    int? DaysAbandoned = null)
    : ApplicationRequest<AbandonedCartsQueryResult>;

public record AbandonedCartSummary(
    Guid ShoppingCartId,
    Guid UserAccountId,
    string UserEmail,
    int ItemCount,
    decimal TotalAmount,
    DateTimeOffset LastModified,
    int DaysAbandoned);

public record PaginationInfo(
    int TotalCount,
    int PageNumber,
    int PageSize,
    bool HasNextPage,
    bool HasPreviousPage);

public record AbandonedCartsQueryResult(
    IEnumerable<AbandonedCartSummary> Carts,
    PaginationInfo Pagination);

public class AbandonedCartsQueryHandler
    : ApplicationRequestHandler<AbandonedCartsQuery, AbandonedCartsQueryResult>
{
    private readonly IDbConnectionHub _connectionHub;

    public AbandonedCartsQueryHandler(IDbConnectionHub connectionHub)
    {
        _connectionHub = connectionHub;
    }

    public async Task<AbandonedCartsQueryResult> HandleAsync(
        AbandonedCartsQuery request,
        CancellationToken cancellationToken = default)
    {
        var (pageNumber, pageSize, daysAbandoned) = request;

        var db = await _connectionHub.CreateSessionAsync("Ecommerce", cancellationToken);

        var effectiveDays = daysAbandoned ?? 7;
        var offset = (pageNumber - 1) * pageSize;

        var carts = await db.QueryFromRoutineAsync<AbandonedCartSummary>(
            "sales.shpcrt_get_abandoned_carts",
            new { DaysAbandoned = effectiveDays, PageSize = pageSize, Offset = offset },
            cancellationToken);

        var totalCount = await db.QuerySingleAsync<int>(
            "sales.shpcrt_count_abandoned_carts",
            new { DaysAbandoned = effectiveDays },
            cancellationToken);

        var pagination = new PaginationInfo(
            totalCount,
            pageNumber,
            pageSize,
            HasNextPage: (pageNumber * pageSize) < totalCount,
            HasPreviousPage: pageNumber > 1);

        return new AbandonedCartsQueryResult(carts, pagination);
    }
}
```

#### AbandonedCartsQueryValidator.cs

```csharp
public class AbandonedCartsQueryValidator : AbstractValidator<AbandonedCartsQuery>
{
    public AbandonedCartsQueryValidator()
    {
        RuleFor(q => q.PageNumber)
            .GreaterThan(0).WithMessage("Page number must be greater than zero.");

        RuleFor(q => q.PageSize)
            .GreaterThan(0).WithMessage("Page size must be greater than zero.")
            .LessThanOrEqualTo(100).WithMessage("Page size cannot be greater than 100.");

        RuleFor(q => q.DaysAbandoned)
            .GreaterThan(0).WithMessage("Days abandoned must be greater than zero.")
            .When(q => q.DaysAbandoned.HasValue);
    }
}
```

---

### ShoppingCartDetail — Detail with data from multiple sources

**Location**: `Features/Sales/OrderPlacement/Queries/ShoppingCartDetail/`

This example illustrates how a query can consolidate data from multiple routines into a single structured result.

#### ShoppingCartDetailEndpoint.cs

##### With Mediator

```csharp
public static class ShoppingCartDetailEndpoint
{
    public static void Map(RouteGroupBuilder routeGroup)
    {
        routeGroup.MapGet("/sales/shopping-carts/{shoppingCartId}", async (
            Guid shoppingCartId,
            IMediator mediator,
            CancellationToken cancellationToken) =>
        {
            var query = new ShoppingCartDetailQuery(shoppingCartId);
            var result = await mediator.SendAsync(query, cancellationToken);

            if (result.Cart is null)
                return Results.NotFound($"Cart with ID {shoppingCartId} was not found.");

            return Results.Ok(result);
        })
        .MapToApiVersion(1)
        .WithSummary("Query shopping cart detail.")
        .WithDescription("""
            Returns the full detail of a shopping cart: basic cart information, the associated user's data,
            all line items with quantities and prices, and a total summary.
            Returns 404 if no cart with the given identifier exists.
            """)
        .Produces<ShoppingCartDetailQueryResult>()
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status400BadRequest);
    }
}
```

##### Without Mediator (direct handler)

```csharp
public static class ShoppingCartDetailEndpoint
{
    public static void Map(RouteGroupBuilder routeGroup)
    {
        routeGroup.MapGet("/sales/shopping-carts/{shoppingCartId}", async (
            Guid shoppingCartId,
            ShoppingCartDetailQueryHandler queryHandler,
            CancellationToken cancellationToken) =>
        {
            var query = new ShoppingCartDetailQuery(shoppingCartId);
            var result = await queryHandler.HandleAsync(query, cancellationToken);

            if (result.Cart is null)
                return Results.NotFound($"Cart with ID {shoppingCartId} was not found.");

            return Results.Ok(result);
        })
        .MapToApiVersion(1)
        .WithSummary("Query shopping cart detail.")
        .WithDescription("""
            Returns the full detail of a shopping cart: basic cart information, the associated user's data,
            all line items with quantities and prices, and a total summary.
            Returns 404 if no cart with the given identifier exists.
            """)
        .Produces<ShoppingCartDetailQueryResult>()
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status400BadRequest);
    }
}
```

#### ShoppingCartDetailQuery.cs

```csharp
public record ShoppingCartDetailQuery(Guid ShoppingCartId)
    : ApplicationRequest<ShoppingCartDetailQueryResult>;

public record CartBasicInfo(
    Guid ShoppingCartId,
    Guid UserAccountId,
    string UserEmail,
    ShoppingCartStatus Status,
    DateTimeOffset CreationInstant,
    DateTimeOffset LastModified);

public record CartItemDetail(
    Guid ShoppingCartItemId,
    Guid ProductId,
    string ProductName,
    decimal ProductPrice,
    double Quantity,
    decimal TotalPrice,
    DateTimeOffset AddedAt);

public record CartSummary(int TotalItems, double TotalQuantity, decimal TotalAmount);

public record ShoppingCartDetailQueryResult(
    CartBasicInfo? Cart,
    IEnumerable<CartItemDetail> Items,
    CartSummary Summary);

// Internal auxiliary model — not exposed outside the handler
public record UserInfo(Guid UserAccountId, string Email);

public class ShoppingCartDetailQueryHandler
    : ApplicationRequestHandler<ShoppingCartDetailQuery, ShoppingCartDetailQueryResult>
{
    private readonly IDbConnectionHub _connectionHub;

    public ShoppingCartDetailQueryHandler(IDbConnectionHub connectionHub)
    {
        _connectionHub = connectionHub;
    }

    public async Task<ShoppingCartDetailQueryResult> HandleAsync(
        ShoppingCartDetailQuery request,
        CancellationToken cancellationToken = default)
    {
        var db = await _connectionHub.CreateSessionAsync("Ecommerce", cancellationToken);

        var cartOverview = await db.QuerySingleOrDefaultFromRoutineAsync<ShoppingCartOverview>(
            "sales.shpcrt_get_overview_by_id",
            new { request.ShoppingCartId },
            cancellationToken);

        if (cartOverview is null)
            return new ShoppingCartDetailQueryResult(null, [], new CartSummary(0, 0, 0));

        var userInfo = await db.QuerySingleOrDefaultFromRoutineAsync<UserInfo>(
            "security.user_get_basic_info",
            new { cartOverview.UserAccountId },
            cancellationToken);

        var items = await db.QueryFromRoutineAsync<CartItemDetail>(
            "sales.shpcrt_get_items_detail_by_cart_id",
            new { request.ShoppingCartId },
            cancellationToken);

        var cartInfo = new CartBasicInfo(
            cartOverview.ShoppingCartId,
            cartOverview.UserAccountId,
            userInfo?.Email ?? "N/A",
            cartOverview.Status,
            cartOverview.CreationInstant,
            cartOverview.LastModified);

        var summary = new CartSummary(
            items.Count(),
            items.Sum(i => i.Quantity),
            items.Sum(i => i.TotalPrice));

        return new ShoppingCartDetailQueryResult(cartInfo, items, summary);
    }
}
```

#### ShoppingCartDetailQueryValidator.cs

```csharp
public class ShoppingCartDetailQueryValidator : AbstractValidator<ShoppingCartDetailQuery>
{
    public ShoppingCartDetailQueryValidator()
    {
        RuleFor(q => q.ShoppingCartId)
            .NotEmpty().WithMessage("The shopping cart ID cannot be empty.");
    }
}
```

---

## Example 4: Shared Model

**Location**: `Features/Sales/OrderPlacement/Model/`

Data structures shared by multiple commands and queries of the same module, each named after its context of use. For naming guidelines, see [Model](#model) above.

### ShoppingCartOverview.cs

Decision data loaded by `State` classes. Contains the fields needed to enforce business rules — not more.

```csharp
public record ShoppingCartOverview(
    Guid ShoppingCartId,
    Guid UserAccountId,
    ShoppingCartStatus Status,
    DateTimeOffset CreationInstant,
    DateTimeOffset LastModified);
```

### CartCheckoutPreview.cs

Full cart data for the checkout and order confirmation screen. Includes fields that are too detailed for state decision-making but necessary for user review.

```csharp
public record CartCheckoutPreview(
    Guid ShoppingCartId,
    string UserEmail,
    string ShippingAddress,
    IEnumerable<CartLineItem> Items,
    decimal Subtotal,
    decimal Tax,
    decimal Total,
    DateTimeOffset CreationInstant);

public record CartLineItem(
    Guid ProductId,
    string ProductName,
    double Quantity,
    decimal UnitPrice,
    decimal TotalPrice);
```

### ProductOption.cs

Minimal product data for the item picker. Omits pricing history, internal SKUs and other fields that are sensitive or irrelevant in a selection context.

```csharp
public record ProductOption(
    Guid ProductId,
    string ProductName,
    string Category,
    bool IsAvailable);
```

### ShoppingCartStatus.cs

```csharp
public enum ShoppingCartStatus
{
    Open = 1,
    Closed = 2,
    Abandoned = 3,
    Converted = 4
}
```

---

## Cross Reference

- [VSA: Concepts](./concepts.md) — principles and folder structure.
- [C# Conventions](../dotnet/csharp) — naming and general guidelines.
- [EDA: Background Services](../event-driven-architecture/csharp-background-services.md) — event consumption from workers.
