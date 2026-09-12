import { SupplierId } from './supplier-id.js';
import { PurchaseOrderId } from './purchase-order-id.js';
import { DateTime } from '../../../shared/domain/model/date-time.js';
import { ValidationError } from '../../../shared/domain/model/errors.js';
import { PurchaseOrderState } from './purchase-order-state.js';
import { Currency } from '../../../shared/domain/model/currency.js';
import { Money } from '../../../shared/domain/model/money.js';
import { PurchaseOrderItem } from './purchase-order-item.js';

export class PurchaseOrder {
    static #MAX_ITEMS = 50;
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

    addItem({ productId, quantity, unitPrice }) {
        if (!this.#state.isDraft()) {
            throw new ValidationError('Items can only be added to a PurchaseOrder in Draft state');
        }
        if (this.#items.length >= PurchaseOrder.#MAX_ITEMS) {
            throw new ValidationError(
              `PurchaseOrder cannot have more than ${PurchaseOrder.#MAX_ITEMS} items`
            );
        }
        if (!(unitPrice instanceof Money)) {
            throw new ValidationError('Unit price must be a valid Money object');
        }
        if (!unitPrice.currency.equals(this.#currency)) {
            throw new ValidationError(
              `Currency mismatch: expected ${this.#currency.code}, but got ${unitPrice.currency.code}`
            );
        }
        this.#items.push(new PurchaseOrderItem({ orderId: this.#id, productId, quantity, unitPrice }));
    }

    calculateTotalPrice() {
        if (this.#items.length === 0) {
            throw new ValidationError('Cannot calculate total price for an empty purchase order');
        }
        return this.#items.reduce(
          (sum, item) => sum.add(item.calculateSubtotal()),
          new Money({ amount: 0, currency: this.#currency })
        );
    }

    cancel() {
        this.#state = this.#state.toCanceledFrom(this.#state);
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
