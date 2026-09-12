import { generateUuid, validateUuid } from '../../../shared/domain/model/uuid.js';
import { ValidationError } from '../../../shared/domain/model/errors.js';

/**
 * Value object representing a unique purchase order identifier in the Procurement context.
 * @remarks
 * Wrapping the identifier, instead of passing a raw string around, means a `PurchaseOrderId` can
 * never be confused with a `SupplierId` or a `ProductId` at the call site, even though all three are
 * UUIDs underneath. A new id is a time-ordered UUID v7.
 */
export class PurchaseOrderId {
    #value;

    /**
     * Creates a new PurchaseOrderId.
     * @param {string} value - The UUID value.
     * @throws {ValidationError} If the value is not a valid UUID.
     */
    constructor(value) {
        if (!validateUuid(value)) {
            throw new ValidationError(`Invalid PurchaseOrderId: ${value}. Must be a valid UUID`);
        }
        this.#value = value;
        Object.freeze(this);
    }

    /**
     * Generates a new PurchaseOrderId with a random UUID v7.
     * @returns {PurchaseOrderId} A new PurchaseOrderId instance.
     */
    static generate() {
        return new PurchaseOrderId(generateUuid());
    }

    /**
     * Gets the UUID value.
     * @returns {string} The UUID.
     */
    get value() {
        return this.#value;
    }

    /**
     * Checks if this PurchaseOrderId equals another.
     * @param {PurchaseOrderId} other - The other PurchaseOrderId to compare.
     * @returns {boolean} True if equal, false otherwise.
     */
    equals(other) {
        return other instanceof PurchaseOrderId && this.#value === other.value;
    }

    toString() {
        return this.#value;
    }
}