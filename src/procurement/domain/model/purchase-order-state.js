import { ValidationError } from '../../../shared/domain/model/errors.js';

export class PurchaseOrderState {
    static #VALID_STATES = {
        DRAFT: 'Draft',
        SUBMITTED: 'Submitted',
        APPROVED: 'Approved',
        SHIPPED: 'Shipped',
        COMPLETED: 'Completed',
        CANCELED: 'Canceled',
    };
    #value;

    constructor(value = PurchaseOrderState.#VALID_STATES.DRAFT) {
        this.#validateState(value);
        this.#value = value;
        Object.freeze(this);
    }

    #validateState(state) {
        if (!Object.values(PurchaseOrderState.#VALID_STATES).includes(state)) {
            throw new ValidationError(
                `Invalid purchase order state: ${state}. Must be one of ${Object.values(PurchaseOrderState.#VALID_STATES).join(', ')}`
            );
        }
    }

    get value() {
        return this.#value;
    }

    isDraft() {
        return this.#value === PurchaseOrderState.#VALID_STATES.DRAFT;
    }

    equals(other) {
        return other instanceof PurchaseOrderState && this.#value === other.value;
    }
}