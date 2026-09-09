import { SupplierId } from './supplier-id.js';
import { ValidationError } from '../../../shared/domain/model/errors.js';

export class Supplier {
    static #NAME_MIN_LENGTH = 2;
    static #NAME_MAX_LENGTH = 100;
    #id;
    #name;
    #contactEmail;
    #lastOrderTotalPrice;

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

    updateEmail(newEmail) {
        if (!this.#isValidEmail(newEmail)) {
            throw new ValidationError(`Invalid contact email: ${newEmail}`);
        }
        this.#contactEmail = newEmail;
    }

    #isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get contactEmail() {
        return this.#contactEmail;
    }

    get lastOrderTotalPrice() {
        return this.#lastOrderTotalPrice;
    }
}