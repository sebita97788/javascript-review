import { ValidationError } from './errors.js';

/**
 * Value object representing a date and time with consistent handling.
 */
export class DateTime {
    #date;

    /**
     * Creates a new DateTime instance.
     * @param {Date|string} [date=new Date()] - The date (defaults to now).
     * @throws {ValidationError} If the date is invalid.
     */
    constructor(date = new Date()) {
        const parsedDate = date instanceof Date ? date : new Date(date);
        if (isNaN(parsedDate.getTime())) {
            throw new ValidationError(`Invalid date: ${date}`);
        }
        this.#date = new Date(parsedDate.getTime()); // Clone to keep the value object immutable
        Object.freeze(this);
    }

    /**
     * Gets the underlying Date object.
     * @returns {Date} A defensive copy of the date.
     */
    get date() {
        return new Date(this.#date.getTime());
    }

    /**
     * Returns the date in ISO string format.
     * @returns {string} The ISO string (e.g., '2023-10-25T14:30:00.000Z').
     */
    toISOString() {
        return this.#date.toISOString();
    }

    /**
     * Returns a human-friendly string representation.
     * @returns {string} The formatted date (e.g., 'October 25, 2023, 2:30 PM').
     */
    toString() {
        let options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        return this.#date.toLocaleString('en-US', options);
    }

    /**
     * Checks if this DateTime equals another.
     * @param {DateTime} other - The other DateTime to compare.
     * @returns {boolean} True if equal, false otherwise.
     */
    equals(other) {
        return other instanceof DateTime && this.#date.getTime() === other.date.getTime();
    }
}