import { SupplierId } from './supplier-id.js';
import { PurchaseOrderId } from './purchase-order-id.js';
import { DateTime } from '../../../shared/domain/model/date-time.js';
import { ValidationError } from '../../../shared/domain/model/errors.js';
import { PurchaseOrderState } from './purchase-order-state.js';
import { Currency } from '../../../shared/domain/model/currency.js';

export class PurchaseOrder {
    #MAX_ITEMS = 50;
    #id;
    #supplierId;
    #currency;
    #orderDate;
    #items;
    #state;

    constructor({ supplierId, currency, orderDate }) {
        if (!(supplierId instanceof SupplierId)) {
            throw new ValidationError('SupplierId must be a valid SupplierId object');
        }
        if (!(currency instanceof Currency)) {
            throw new ValidationError('Currency must be a valid Currency object');
        }
        this.#id = PurchaseOrderId.generate();
        this.#supplierId = supplierId;
        this.#currency = currency;
        this.#orderDate = orderDate instanceof DateTime ? orderDate : new DateTime();
        this.#items = [];
        this.#state = new PurchaseOrderState(); // Initial state: Draft
    }

    get id() {
        return this.#id;
    }

    get supplierId() {
        return this.#supplierId;
    }

    get currency() {
        return this.#currency;
    }

    get orderDate() {
        return this.#orderDate;
    }

    get items() {
        return Object.freeze([...this.#items]);
    }

    get state() {
        return this.#state.value;
    }
}