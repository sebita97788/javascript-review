import { SupplierId } from './supplier-id.js';
import { ValidationError } from '../../../shared/domain/model/errors.js';
import { Money } from '../../../shared/domain/model/money.js';

/**
 * @class Supplier
 * Entity representing a supplier in the supply chain management context.
 * @property {SupplierId} id - The unique identifier for the supplier.
 * @property {string} name - The name of the supplier.
 * @property {string|null} contactEmail - The contact email of the supplier (optional).
 * @property {Money|null} lastOrderTotalPrice - The total price of the last order from this supplier (optional).
 */
export class Supplier {
    /** @private */
    static #NAME_MIN_LENGTH = 2;
    /** @private */
    static #NAME_MAX_LENGTH = 100;
    #id;
    #name;
    #contactEmail;
    #lastOrderTotalPrice;
    /**
     * Creates a new Supplier.
     * @constructor
     * @param {Object} params - The parameters.
     * @param {SupplierId} params.id - The supplier ID.
     * @param {string} params.name - The supplier name.
     * @param {string|null} [params.contactEmail] - The contact email (optional).
     * @param {Money|null} [params.lastOrderTotalPrice] - The last order total price (optional).
     * @throws {ValidationError} If parameters are invalid.
     */
    constructor({ id, name, contactEmail = null, lastOrderTotalPrice = null }) {
        if (!(id instanceof SupplierId)) {
            throw new ValidationError('Supplier ID must be a valid SupplierId object');
        }
        this.#id = id;
        this.changeName(name);
        if (contactEmail !== null) {
            this.updateEmail(contactEmail);
        } else {
            this.#contactEmail = null;
        }
        if (lastOrderTotalPrice !== null) {
            this.recordOrder(lastOrderTotalPrice);
        } else {
            this.#lastOrderTotalPrice = null;
        }
    }

    /**
     * Changes the supplier name.
     * @param {string} newName - The new name.
     * @throws {ValidationError} If name is invalid.
     */
    changeName(newName) {
        if (
            typeof newName !== 'string' ||
            newName.length < Supplier.#NAME_MIN_LENGTH ||
            newName.length > Supplier.#NAME_MAX_LENGTH
        ) {
            throw new ValidationError(
                `Supplier name must be between ${Supplier.#NAME_MIN_LENGTH} and ${Supplier.#NAME_MAX_LENGTH} characters`
            );
        }
        this.#name = newName;
    }

    /**
     * Updates the contact email.
     * @param {string} newEmail - The new email address.
     * @throws {ValidationError} If email is invalid.
     */
    updateEmail(newEmail) {
        if (!this.#isValidEmail(newEmail)) {
            throw new ValidationError(`Invalid contact email: ${newEmail}`);
        }
        this.#contactEmail = newEmail;
    }

    /**
     * Records a new order for this supplier.
     * @param {Money} orderTotal - The total price of the order.
     * @throws {ValidationError} If orderTotal is not a Money object.
     */
    recordOrder(orderTotal) {
        if (!(orderTotal instanceof Money)) {
            throw new ValidationError('Order total must be a valid Money object');
        }
        this.#lastOrderTotalPrice = orderTotal;
    }

    /**
     * @private
     * Validates an email address.
     *
     * @param {string} email - The email to validate.
     * @returns {boolean} True if valid, false otherwise.
     */
    #isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * @public
     * Gets the supplier ID.
     *
     * @returns {SupplierId} The supplier ID.
     */
    get id() {
        return this.#id;
    }

    /**
     * Gets the supplier name.
     * @public
     * @returns {string} The name.
     */
    get name() {
        return this.#name;
    }

    /**
     * @public
     * Gets the contact email.
     * @returns {string|null} The contact email or null.
     */
    get contactEmail() {
        return this.#contactEmail;
    }

    /**
     * @public
     * Gets the last order total price.
     * @returns {Money|null} The last order total price or null.
     */
    get lastOrderTotalPrice() {
        return this.#lastOrderTotalPrice;
    }
}