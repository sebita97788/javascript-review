import { validateUuid } from '../../../shared/domain/model/uuid.js';
import { ValidationError } from '../../../shared/domain/model/errors.js';

/**
 * Value object representing a reference to a supplier inside the Procurement context.
 * @remarks
 * Procurement needs to name the supplier a purchase order belongs to, but it must not depend on the
 * SCM context's own `SupplierId` type: each context owns its identifiers. This is Procurement's own
 * copy, carrying just the UUID string the two contexts agree on. It has no `generate()` factory, a
 * purchase order is always raised against a supplier that already exists, so the id is always supplied.
 */
export class SupplierId {
    #value;

    /**
     * Creates a new SupplierId.
     * @param {string} value - The supplier's UUID, as agreed with the SCM context.
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