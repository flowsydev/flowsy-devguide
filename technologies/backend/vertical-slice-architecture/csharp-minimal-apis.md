# VSA: C# with Minimal APIs

Complete implementation examples of Vertical Slices in C# using Minimal APIs, following the conventions of the Flowsy ecosystem.

This page is the C#/.NET implementation companion to the technology-agnostic [VSA concepts](./concepts.md). Start with the concepts when deciding slice boundaries, then use this page for concrete files, libraries and code.

The examples use English domain terminology, aligned with the predominant language and community context of this guide. Projects should adapt business identifiers to the ubiquitous language chosen for their own domain.

Each example includes: `Endpoint`, `Command`, `CommandValidator` and `State`.

For HTTP API maturity, status codes and RFC 9457 Problem Details, see [HTTP API Design](../api-design.md).

> **Mediator vs. direct handler**: Endpoints send commands and queries through `IMediator`. If the project does not use the Mediator pattern, the endpoint should directly inject the `CommandHandler` or `QueryHandler` and call its `HandleAsync` method.

## General Convention

Each slice contains the following files:

```text
📁 Features/[Module]/[Submodule]/Commands/[ActionName]/
├── 📄 [ActionName]Endpoint.cs           ← Minimal API endpoint
├── 📄 [ActionName]Command.cs            ← Command + Result + Handler
├── 📄 [ActionName]CommandValidator.cs   ← Validation with FluentValidation
└── 📄 [ActionName]State.cs              ← State + IStateHandler + StateHandler
```

## HTTP Results and Problem Details

Keep Minimal API endpoints thin. Let handlers own business behavior, and centralize repeated domain-error mapping in a global exception handler that returns RFC 9457 Problem Details.

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

Document known responses in endpoint metadata:

```csharp
routeGroup.MapPost("/projects", CreateProjectAsync)
    .WithSummary("Create a project.")
    .Produces<ProjectSummary>(StatusCodes.Status201Created)
    .ProducesValidationProblem(StatusCodes.Status422UnprocessableEntity)
    .Produces<ProblemDetails>(StatusCodes.Status404NotFound, "application/problem+json")
    .Produces<ProblemDetails>(StatusCodes.Status409Conflict, "application/problem+json");
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
        .WithDescription("Creates a new shopping cart for the specified user and returns the operation result.")
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
        .WithDescription("Creates a new shopping cart for the specified user and returns the operation result.")
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
        .WithDescription("Gets a paginated list of carts abandoned for more than a specific number of days.")
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
        .WithDescription("Gets a paginated list of carts abandoned for more than a specific number of days.")
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
        .WithDescription("Gets the complete detail of a specific cart, including all its items.")
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
        .WithDescription("Gets the complete detail of a specific cart, including all its items.")
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

Data structures and enums shared by multiple commands and queries of the same module.

### ShoppingCartOverview.cs

```csharp
public record ShoppingCartOverview(
    Guid ShoppingCartId,
    Guid UserAccountId,
    ShoppingCartStatus Status,
    DateTimeOffset CreationInstant,
    DateTimeOffset LastModified);
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
