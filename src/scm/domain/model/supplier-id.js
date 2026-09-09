import { generateUuid, validateUuid } from '../../../shared/domain/model/uuid.js';
import { ValidationError } from '../../../shared/domain/model/errors.js';

/**
 * Value object representing a supplier's own identity in the Supply Chain Management context.
 * @remarks
 * Wrapping the identifier, instead of passing a raw string around, means a `SupplierId` can never be
 * confused with a `ProductId` or a `PurchaseOrderId` at the call site, even though all three are
 * UUIDs underneath. A new id is a time-ordered UUID v7.
 */
export class SupplierId {
    #value;

    /**
     * Creates a new SupplierId.
     * @param {string} value - The UUID value.
     * @throws {ValidationError} If the value is not a valid UUID.
     */
    constructor(value) {
        if (!validateUuid(value)) {
            throw new ValidationError(`Invalid SupplierId: ${value}. Must be a valid UUID`);
        }
        this.#value = value;
        Object.freeze(this);
    }

    /**
     * Generates a new SupplierId with a random UUID v7.
     * @returns {SupplierId} A new SupplierId instance.
     */
    static generate() {
        return new SupplierId(generateUuid());
    }

    /**
     * Gets the UUID value.
     * @returns {string} The UUID.
     */
    get value() {
        return this.#value;
    }

    /**
     * Checks if this SupplierId equals another.
     * @param {SupplierId} other - The other SupplierId to compare.
     * @returns {boolean} True if equal, false otherwise.
     */
    equals(other) {
        return other instanceof SupplierId && this.#value === other.value;
    }

    toString() {
        return this.#value;
    }
}