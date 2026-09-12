import { ProductId } from './product-id.js';
import { PurchaseOrderId } from './purchase-order-id.js';
import { Money } from '../../../shared/domain/model/money.js';
import { ValidationError } from '../../../shared/domain/model/errors.js';

/**
 * Value object representing a single line item in a purchase order.
 * @remarks
 * Two items are the same when they carry the same order, product, quantity and unit price. The item
 * is immutable: to change a quantity, the order removes the line and adds a new one.
 */
export class PurchaseOrderItem {
  /** @private */
  static #MIN_QUANTITY = 1;
  /** @private */
  static #MAX_QUANTITY = 1000;
  #orderId;
  #productId;
  #quantity;
  #unitPrice;

  /**
   * Creates a new PurchaseOrderItem.
   * @param {Object} params - The parameters.
   * @param {PurchaseOrderId} params.orderId - The purchase order this item belongs to.
   * @param {ProductId} params.productId - The product being ordered.
   * @param {number} params.quantity - The quantity ordered (an integer from 1 to 1000).
   * @param {Money} params.unitPrice - The unit price.
   * @throws {ValidationError} If any parameter is invalid.
   */
  constructor({ orderId, productId, quantity, unitPrice }) {
    if (!(orderId instanceof PurchaseOrderId)) {
      throw new ValidationError('Order ID must be a valid PurchaseOrderId object');
    }
    if (!(productId instanceof ProductId)) {
      throw new ValidationError('Product ID must be a valid ProductId object');
    }
    if (
      !Number.isInteger(quantity) ||
      quantity < PurchaseOrderItem.#MIN_QUANTITY ||
      quantity > PurchaseOrderItem.#MAX_QUANTITY
    ) {
      throw new ValidationError(
        `Quantity must be an integer between ${PurchaseOrderItem.#MIN_QUANTITY} and ${PurchaseOrderItem.#MAX_QUANTITY}`
      );
    }
    if (!(unitPrice instanceof Money)) {
      throw new ValidationError('Unit price must be a valid Money object');
    }
    this.#orderId = orderId;
    this.#productId = productId;
    this.#quantity = quantity;
    this.#unitPrice = unitPrice;
    Object.freeze(this);
  }

  /**
   * Gets the purchase order this item belongs to.
   * @returns {PurchaseOrderId} The order ID.
   */
  get orderId() {
    return this.#orderId;
  }

  /**
   * Gets the product being ordered.
   * @returns {ProductId} The product ID.
   */
  get productId() {
    return this.#productId;
  }

  /**
   * Gets the quantity ordered.
   * @returns {number} The quantity.
   */
  get quantity() {
    return this.#quantity;
  }

  /**
   * Gets the unit price.
   * @returns {Money} The unit price.
   */
  get unitPrice() {
    return this.#unitPrice;
  }

  /**
   * Calculates the subtotal for this line (quantity times unit price).
   * @returns {Money} The subtotal.
   */
  calculateSubtotal() {
    return this.#unitPrice.multiply(this.#quantity);
  }

  /**
   * Checks if this item equals another.
   * @param {PurchaseOrderItem} other - The other item to compare.
   * @returns {boolean} True if equal, false otherwise.
   */
  equals(other) {
    return (
      other instanceof PurchaseOrderItem &&
      this.#orderId.equals(other.orderId) &&
      this.#productId.equals(other.productId) &&
      this.#quantity === other.quantity &&
      this.#unitPrice.equals(other.unitPrice)
    );
  }
}
