import { v7 as uuidv7, validate as uuidValidate } from 'uuid';

/**
 * Generates a new time-ordered UUID (version 7).
 * @returns {string} A UUID v7 string.
 */
export function generateUuid() {
    return uuidv7();
}

/**
 * Validates that a string is a well-formed UUID.
 * @param {string} value - The string to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
export function validateUuid(value) {
    return uuidValidate(value);
}