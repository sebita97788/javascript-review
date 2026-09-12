import { SupplierId } from './supplier-id.js';
import { PurchaseOrderId } from './purchase-order-id.js';
import { PurchaseOrderItem } from './purchase-order-item.js';
import { Money } from '../../../shared/domain/model/money.js';
import { DateTime } from '../../../shared/domain/model/date-time.js';
import { ValidationError } from '../../../shared/domain/model/errors.js';
import { PurchaseOrderState } from './purchase-order-state.js';
import { Currency } from '../../../shared/domain/model/currency.js';

/**
 * Aggregate root representing a purchase order with a lifecycle state, in the Procurement context.
 */
export class PurchaseOrder {
  /** @private */
  static #MAX_ITEMS = 50;
  #id;
  #supplierId;
  #currency;
  #orderDate;
  #items;
  #state;

  /**
   * Creates a new PurchaseOrder.
   * @param {Object} params - The parameters.
   * @param {SupplierId} params.supplierId - The supplier ID.
   * @param {Currency} params.currency - The currency for the order.
   * @param {DateTime} [params.orderDate] - The order date (defaults to now).
   * @throws {ValidationError} If supplierId or currency is invalid.
   */
  constructor({ supplierId, currency, orderDate }) {
    if (!(supplierId instanceof SupplierId)) {
      throw new ValidationError('SupplierId must be a valid SupplierId object');
    }
    if (!(currency instanceof Currency)) {
      throw new ValidationError('Currency must be a valid Currency object');
    }
    this.#id = PurchaseOrderId.generate();
    this.#supplierId = supplierId;
    this.#currency = currency;
    this.#orderDate = orderDate instanceof DateTime ? orderDate : new DateTime();
    this.#items = [];
    this.#state = new PurchaseOrderState(); // Initial state: Draft
  }

  /**
   * Adds an item to the purchase order if conditions are met.
   *
   * **Business Rules**:
   * - **Draft State Only**: Items can only be added while the purchase order is in the Draft state.
   *   This ensures that modifications are restricted to the preparation phase, preventing changes
   *   after submission for approval or fulfillment to maintain order integrity and auditability.
   * - **Maximum Items Limit**: A purchase order cannot exceed 50 items. This constraint prevents
   *   overly complex orders that could complicate supplier fulfillment, inventory management,
   *   or financial reconciliation, keeping orders manageable within operational capacity.
   * - **Unit Price in the Order's Currency**: the unit price travels as a `Money` value object. It
   *   must be priced in the order's own currency, so a mismatch is caught at the boundary instead
   *   of surfacing later inside a total.
   *
   * @param {Object} params - The item parameters.
   * @param {ProductId} params.productId - The product being ordered.
   * @param {number} params.quantity - The quantity.
   * @param {Money} params.unitPrice - The unit price, in the order's currency.
   * @throws {ValidationError} If the state is not Draft, the max items (50) are exceeded, or the unit price is not a Money in the order's currency.
   */
  addItem({ productId, quantity, unitPrice }) {
    if (!this.#state.isDraft()) {
      throw new ValidationError('Items can only be added to a PurchaseOrder in Draft state');
    }
    if (this.#items.length >= PurchaseOrder.#MAX_ITEMS) {
      throw new ValidationError(
        `PurchaseOrder cannot have more than ${PurchaseOrder.#MAX_ITEMS} items`
      );
    }
    if (!(unitPrice instanceof Money)) {
      throw new ValidationError('Unit price must be a valid Money object');
    }
    if (!unitPrice.currency.equals(this.#currency)) {
      throw new ValidationError(
        `Currency mismatch: expected ${this.#currency.code}, but got ${unitPrice.currency.code}`
      );
    }
    this.#items.push(new PurchaseOrderItem({ orderId: this.#id, productId, quantity, unitPrice }));
  }

  /**
   * Calculates the total price of all items.
   * @returns {Money} The total price.
   * @throws {ValidationError} If the order is empty.
   */
  calculateTotalPrice() {
    if (this.#items.length === 0) {
      throw new ValidationError('Cannot calculate total price for an empty purchase order');
    }
    return this.#items.reduce(
      (sum, item) => sum.add(item.calculateSubtotal()),
      new Money({ amount: 0, currency: this.#currency })
    );
  }

  /**
   * Transitions the purchase order to Submitted state.
   * @throws {ValidationError} If not in Draft state.
   */
  submit() {
    this.#state = this.#state.toSubmittedFrom(this.#state);
  }

  /**
   * Transitions the purchase order to Approved state.
   * @throws {ValidationError} If not in Submitted state.
   */
  approve() {
    this.#state = this.#state.toApprovedFrom(this.#state);
  }

  /**
   * Transitions the purchase order to Shipped state.
   * @throws {ValidationError} If not in Approved state.
   */
  ship() {
    this.#state = this.#state.toShippedFrom(this.#state);
  }

  /**
   * Transitions the purchase order to Completed state.
   * @throws {ValidationError} If not in Shipped state.
   */
  complete() {
    this.#state = this.#state.toCompletedFrom(this.#state);
  }

  /**
   * Transitions the purchase order to Canceled state.
   * @throws {ValidationError} If in Completed state.
   */
  cancel() {
    this.#state = this.#state.toCanceledFrom(this.#state);
  }

  /**
   * Gets the purchase order ID.
   * @returns {PurchaseOrderId} The order ID.
   */
  get id() {
    return this.#id;
  }

  /**
   * Gets the supplier ID.
   * @returns {SupplierId} The supplier ID.
   */
  get supplierId() {
    return this.#supplierId;
  }

  /**
   * Gets the currency.
   * @returns {Currency} The currency.
   */
  get currency() {
    return this.#currency;
  }

  /**
   * Gets the order date.
   * @returns {DateTime} The order date.
   */
  get orderDate() {
    return this.#orderDate;
  }

  /**
   * Gets a read-only snapshot of the order's items.
   * @remarks
   * Returns a frozen copy, not the internal array: mutating the returned array (push/pop/splice)
   * never reaches `#items`. `addItem()` is the only way to change what's in the order.
   * @returns {ReadonlyArray<PurchaseOrderItem>} The items.
   */
  get items() {
    return Object.freeze([...this.#items]);
  }

  /**
   * Gets the current state of the purchase order.
   * @returns {string} The state (e.g., 'Draft', 'Submitted', 'Approved', 'Shipped', 'Completed', 'Canceled').
   */
  get state() {
    return this.#state.value;
  }
}
