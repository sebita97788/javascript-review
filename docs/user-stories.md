# User Stories

The following user stories describe the main features of the Supply Chain & Procurement console script.

## Requirement Traceability Matrix

| User Story | Scenario                                     | Implementation                                                                                       |
|------------|----------------------------------------------|-----------------------------------------------------------------------------------------------------|
| US001      | Register a new supplier                       | `Supplier` constructor, `SupplierId` (scm)                                                          |
| US001      | Reject a name outside 2 to 100 characters     | `Supplier` constructor (throws)                                                                    |
| US001      | Reject an invalid contact email               | `Supplier` constructor, `Supplier.#isValidEmail` (throws)                                          |
| US002      | Record the last order total for a supplier    | `Supplier.recordOrder()`                                                                           |
| US002      | Reject a total that is not a `Money`          | `Supplier.recordOrder()` (throws)                                                                 |
| US003      | Create a purchase order in the default state  | `PurchaseOrder` constructor, `PurchaseOrderId`, `SupplierId` (procurement), `PurchaseOrderState`   |
| US003      | Reject an unsupported currency                | `Currency` constructor (throws)                                                                    |
| US004      | Add an item to a draft purchase order         | `PurchaseOrder.addItem()`, `PurchaseOrderItem`, `ProductId`, `Money`                               |
| US004      | Attempt to add an item to a submitted order   | `PurchaseOrder.addItem()` (throws)                                                                 |
| US004      | Reject a unit price in another currency       | `PurchaseOrder.addItem()` (throws)                                                                 |
| US004      | Reject a quantity outside 1 to 1000           | `PurchaseOrderItem` constructor (throws)                                                            |
| US004      | Reject the 51st item                          | `PurchaseOrder.addItem()` (throws)                                                                 |
| US005      | Calculate the total price with multiple items | `PurchaseOrder.calculateTotalPrice()`, `PurchaseOrderItem.calculateSubtotal()`, `Money.add()` / `Money.multiply()` |
| US005      | Attempt to calculate the total of an empty order | `PurchaseOrder.calculateTotalPrice()` (throws)                                                  |
| US006      | Cancel an order that is not completed         | `PurchaseOrder.cancel()`, `PurchaseOrderState.toCanceledFrom()`                                    |
| US006      | Attempt to cancel a completed order           | `PurchaseOrderState.toCanceledFrom()` (throws)                                                     |
| US007      | Walk the order through its full lifecycle     | `PurchaseOrder.submit()` / `approve()` / `ship()` / `complete()`, `PurchaseOrderState` transitions |
| US007      | Attempt an out-of-sequence transition         | `PurchaseOrderState` transitions (throw)                                                           |

## US001: Registering a Supplier
As a procurement manager, I want to register a supplier with a name and an optional contact email so that purchase orders can be raised against them.

### Acceptance Criteria
- **Scenario: Register a new supplier**
    - **Given** a supplier's name and, optionally, a contact email,
    - **When** a procurement manager registers the supplier,
    - **Then** the supplier is created with a unique ID, that name, the contact email, and no last order total yet.
- **Scenario: Reject a name outside 2 to 100 characters**
    - **Given** a name shorter than 2 characters or longer than 100,
    - **When** a procurement manager attempts to register the supplier,
    - **Then** an error is thrown and no supplier is created.
- **Scenario: Reject an invalid contact email**
    - **Given** a contact email that is not a well-formed address,
    - **When** a procurement manager attempts to register the supplier,
    - **Then** an error is thrown and no supplier is created.

## US002: Recording the Last Order Total for a Supplier
As a procurement manager, I want to record the total of a supplier's most recent order so that I can review their order history.

### Acceptance Criteria
- **Scenario: Record the last order total**
    - **Given** a registered supplier and a purchase order total as a `Money` value,
    - **When** the total is recorded against the supplier,
    - **Then** the supplier's last order total reflects that value.
- **Scenario: Reject a total that is not a `Money`**
    - **Given** a value that is not a `Money`,
    - **When** a procurement manager attempts to record it as the last order total,
    - **Then** an error is thrown and the supplier's last order total is unchanged.

## US003: Creating a Purchase Order
As a procurement manager, I want to create a purchase order for a supplier so that I can begin ordering products.

### Acceptance Criteria
- **Scenario: Create a purchase order in the default state**
    - **Given** a supplier that already exists and a supported currency,
    - **When** a procurement manager creates a purchase order with the supplier's ID and that currency,
    - **Then** the purchase order is created with a unique ID, the supplier reference, the currency, an order date (defaulting to now), no items, and a state of "Draft".
- **Scenario: Reject an unsupported currency**
    - **Given** a currency code that is not one of USD, EUR, GBP, JPY,
    - **When** a procurement manager attempts to create the currency for the order,
    - **Then** an error is thrown and no purchase order is created.

## US004: Adding Items to a Purchase Order
As a procurement manager, I want to add items to a purchase order so that I can specify the products and quantities needed.

### Acceptance Criteria
- **Scenario: Add an item to a draft purchase order**
    - **Given** a purchase order in the "Draft" state,
    - **When** a procurement manager adds an item with a product ID, a quantity, and a unit price in the order's currency,
    - **Then** the item is added to the order and the total price can be calculated.
- **Scenario: Attempt to add an item to a submitted order**
    - **Given** a purchase order that is no longer in the "Draft" state,
    - **When** a procurement manager attempts to add an item,
    - **Then** an error is thrown indicating that items can only be added while the order is "Draft".
- **Scenario: Reject a unit price in another currency**
    - **Given** a draft purchase order in one currency,
    - **When** a procurement manager adds an item priced in a different currency,
    - **Then** an error is thrown indicating a currency mismatch.
- **Scenario: Reject a quantity outside 1 to 1000**
    - **Given** a draft purchase order,
    - **When** a procurement manager adds an item with a quantity that is not a positive integer of at most 1000,
    - **Then** an error is thrown and the item is not added.
- **Scenario: Reject the 51st item**
    - **Given** a draft purchase order that already contains 50 items,
    - **When** a procurement manager adds another item,
    - **Then** an error is thrown indicating that a purchase order cannot have more than 50 items.

## US005: Calculating the Total Price of a Purchase Order
As a procurement manager, I want to calculate the total price of a purchase order so that I can review costs before submitting it.

### Acceptance Criteria
- **Scenario: Calculate the total price with multiple items**
    - **Given** a purchase order with two items, one with a unit price of 45.99 and quantity 5, another with a unit price of 22.99 and quantity 10,
    - **When** a procurement manager calculates the total price,
    - **Then** the total is 459.85 as a `Money` in the order's currency.
- **Scenario: Attempt to calculate the total of an empty order**
    - **Given** a purchase order with no items,
    - **When** a procurement manager calculates the total price,
    - **Then** an error is thrown indicating that an empty purchase order has no total.

## US006: Cancelling a Purchase Order
As a procurement manager, I want to cancel a purchase order so that an order that is no longer needed can be voided.

### Acceptance Criteria
- **Scenario: Cancel an order that is not completed**
    - **Given** a purchase order in any state except "Completed",
    - **When** a procurement manager cancels the order,
    - **Then** the order's state changes to "Canceled".
- **Scenario: Attempt to cancel a completed order**
    - **Given** a purchase order in the "Completed" state,
    - **When** a procurement manager attempts to cancel the order,
    - **Then** an error is thrown indicating that a completed order cannot be canceled.

## US007: Managing the Purchase Order Lifecycle
As a procurement manager, I want to transition a purchase order through its lifecycle so that I can track the order process.

### Acceptance Criteria
- **Scenario: Walk the order through its full lifecycle**
    - **Given** a purchase order in the "Draft" state,
    - **When** a procurement manager submits, approves, ships, and completes the order in that order,
    - **Then** each transition updates the state, ending at "Completed".
- **Scenario: Attempt an out-of-sequence transition**
    - **Given** a purchase order in a given state,
    - **When** a procurement manager attempts a transition whose predecessor state is not the current one (for example, approving a "Draft" order),
    - **Then** an error is thrown with a descriptive message and the state is unchanged.