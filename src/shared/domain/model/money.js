import { ValidationError } from './errors.js';
import { Currency } from './currency.js';

/**
 * Value object representing an amount of money with a currency.
 */
export class Money {
    #amount;
    #currency;
    /**
     * Creates a new Money instance.
     * @param {Object} params - The parameters.
     * @param {number} params.amount - The monetary amount.
     * @param {Currency} params.currency - The currency.
     * @throws {ValidationError} If amount is invalid or currency is not a Currency object.
     */
    constructor({ amount, currency }) {
        if (!Number.isFinite(amount) || amount < 0) {
            throw new ValidationError('Amount must be a non-negative number');
        }
        if (!(currency instanceof Currency)) {
            throw new ValidationError('Currency must be a valid Currency object');
        }
        this.#amount = Number(amount.toFixed(2)); // Round to 2 decimal places
        this.#currency = currency;
        Object.freeze(this);
    }

    /**
     * Gets the amount.
     * @returns {number} The amount.
     */
    get amount() {
        return this.#amount;
    }

    /**
     * Gets the currency.
     * @returns {Currency} The currency.
     */
    get currency() {
        return this.#currency;
    }

    /**
     * Adds another Money instance to this one.
     * @param {Money} other - The other Money to add.
     * @returns {Money} A new Money instance with the summed amount.
     * @throws {ValidationError} If currencies do not match.
     */
    add(other) {
        if (!(other instanceof Money) || !this.#currency.equals(other.currency)) {
            throw new ValidationError('Cannot add Money with different currencies');
        }
        return new Money({
            amount: this.#amount + other.amount,
            currency: this.#currency,
        });
    }

    /**
     * Multiplies this Money by a factor.
     * @param {number} multiplier - The multiplier.
     * @returns {Money} A new Money instance with the multiplied amount.
     * @throws {ValidationError} If multiplier is invalid.
     */
    multiply(multiplier) {
        if (!Number.isFinite(multiplier) || multiplier < 0) {
            throw new ValidationError('Multiplier must be a non-negative number');
        }
        return new Money({
            amount: this.#amount * multiplier,
            currency: this.#currency,
        });
    }

    /**
     * Returns a human-friendly string representation.
     * @returns {string} The formatted money (e.g., '$100.50').
     */
    toString() {
        return `${this.#currency.code} ${this.#amount.toFixed(2)}`;
    }

    /**
     * Checks if this Money equals another.
     * @param {Money} other - The other Money to compare.
     * @returns {boolean} True if equal, false otherwise.
     */
    equals(other) {
        return (
            other instanceof Money &&
            this.#amount === other.amount &&
            this.#currency.equals(other.currency)
        );
    }
}