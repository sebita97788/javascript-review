import { ValidationError } from './errors.js';

/**
 * Value object representing a currency with a code (e.g., USD, EUR).
 */
export class Currency {
    /** @private */
    static #VALID_CODES = ['USD', 'EUR', 'GBP', 'JPY'];
    #code;

    /**
     * Creates a new Currency instance.
     * @param {string} code - The currency code (e.g., 'USD').
     * @throws {ValidationError} If the code is not valid.
     */
    constructor(code) {
        if (!Currency.#VALID_CODES.includes(code)) {
            throw new ValidationError(
                `Invalid currency code: ${code}. Must be one of ${Currency.#VALID_CODES.join(', ')}`
            );
        }
        this.#code = code;
        Object.freeze(this);
    }

    /**
     * Gets the currency code.
     * @returns {string} The currency code.
     */
    get code() {
        return this.#code;
    }

    /**
     * Checks if this currency equals another.
     * @param {Currency} other - The other currency to compare.
     * @returns {boolean} True if equal, false otherwise.
     */
    equals(other) {
        return other instanceof Currency && this.#code === other.code;
    }

    toString() {
        return this.#code;
    }
}