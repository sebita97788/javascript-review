import { generateUuid, validateUuid } from '../../../shared/domain/model/uuid.js';
import { ValidationError } from '../../../shared/domain/model/errors.js';

/**
 * Value object representing a unique product identifier in the Procurement context.
 * @remarks
 * Wrapping the identifier, instead of passing a raw string around, means a `ProductId` can never be
 * confused with a `SupplierId` or a `PurchaseOrderId` at the call site, even though all three are
 * UUIDs underneath. A new id is a time-ordered UUID v7.
 */
export class ProductId {
  #value;

  /**
   * Creates a new ProductId.
   * @param {string} value - The UUID value.
   * @throws {ValidationError} If the value is not a valid UUID.
   */
  constructor(value) {
    if (!validateUuid(value)) {
      throw new ValidationError(`Invalid ProductId: ${value}. Must be a valid UUID`);
    }
    this.#value = value;
    Object.freeze(this);
  }

  /**
   * Generates a new ProductId with a random UUID v7.
   * @returns {ProductId} A new ProductId instance.
   */
  static generate() {
    return new ProductId(generateUuid());
  }

  /**
   * Gets the UUID value.
   * @returns {string} The UUID.
   */
  get value() {
    return this.#value;
  }

  /**
   * Checks if this ProductId equals another.
   * @param {ProductId} other - The other ProductId to compare.
   * @returns {boolean} True if equal, false otherwise.
   */
  equals(other) {
    return other instanceof ProductId && this.#value === other.value;
  }

  toString() {
    return this.#value;
  }
}
