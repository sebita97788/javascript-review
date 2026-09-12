import { ValidationError } from '../../../shared/domain/model/errors.js';

/**
 * Value object representing the state of a purchase order with valid transitions.
 * Manages the lifecycle states of a purchase order, ensuring transitions adhere to
 * procurement business rules such as sequential approval processes and restrictions
 * on modifying completed orders.
 */
export class PurchaseOrderState {
  /** @private */
  static #VALID_STATES = {
    DRAFT: 'Draft',
    SUBMITTED: 'Submitted',
    APPROVED: 'Approved',
    SHIPPED: 'Shipped',
    COMPLETED: 'Completed',
    CANCELED: 'Canceled',
  };
  #value;

  /**
   * Creates a new PurchaseOrderState.
   * @param {string} [value=PurchaseOrderState.#VALID_STATES.DRAFT] - The state value, defaults to 'Draft'.
   * @throws {ValidationError} If the value is not a valid state.
   */
  constructor(value = PurchaseOrderState.#VALID_STATES.DRAFT) {
    this.#validateState(value);
    this.#value = value;
    Object.freeze(this);
  }

  /**
   * Validates if a state is valid.
   * @private
   * @param {string} state - The state to validate.
   * @throws {ValidationError} If the state is invalid.
   */
  #validateState(state) {
    if (!Object.values(PurchaseOrderState.#VALID_STATES).includes(state)) {
      throw new ValidationError(
        `Invalid purchase order state: ${state}. Must be one of ${Object.values(PurchaseOrderState.#VALID_STATES).join(', ')}`
      );
    }
  }

  /**
   * Transitions to Submitted state from the current state.
   *
   * **Business Rule**: A purchase order can only be submitted for approval once it has been fully drafted.
   * This ensures that all items and details are finalized before review by the procurement team.
   * Submission is restricted to the Draft state to prevent resubmission or modification after the
   * process has begun.
   *
   * @param {PurchaseOrderState} currentState - The current state.
   * @returns {PurchaseOrderState} New state instance set to 'Submitted'.
   * @throws {ValidationError} If current state is not 'Draft'.
   */
  toSubmittedFrom(currentState) {
    if (currentState.value !== PurchaseOrderState.#VALID_STATES.DRAFT) {
      throw new ValidationError('PurchaseOrder can only be submitted from Draft state');
    }
    return new PurchaseOrderState(PurchaseOrderState.#VALID_STATES.SUBMITTED);
  }

  /**
   * Transitions to Approved state from the current state.
   *
   * **Business Rule**: A purchase order must be approved by the procurement manager after submission.
   * Approval indicates that the order has been reviewed and authorized for fulfillment by the supplier.
   * This transition is only valid from the Submitted state to enforce a sequential review process.
   *
   * @param {PurchaseOrderState} currentState - The current state.
   * @returns {PurchaseOrderState} New state instance set to 'Approved'.
   * @throws {ValidationError} If current state is not 'Submitted'.
   */
  toApprovedFrom(currentState) {
    if (currentState.value !== PurchaseOrderState.#VALID_STATES.SUBMITTED) {
      throw new ValidationError('PurchaseOrder can only be approved from Submitted state');
    }
    return new PurchaseOrderState(PurchaseOrderState.#VALID_STATES.APPROVED);
  }

  /**
   * Transitions to Shipped state from the current state.
   *
   * **Business Rule**: A purchase order can only be marked as shipped after approval, indicating
   * that the supplier has dispatched the ordered items. This step ensures that shipment tracking
   * begins only after formal authorization, maintaining accountability in the supply chain.
   *
   * @param {PurchaseOrderState} currentState - The current state.
   * @returns {PurchaseOrderState} New state instance set to 'Shipped'.
   * @throws {ValidationError} If current state is not 'Approved'.
   */
  toShippedFrom(currentState) {
    if (currentState.value !== PurchaseOrderState.#VALID_STATES.APPROVED) {
      throw new ValidationError('PurchaseOrder can only be shipped from Approved state');
    }
    return new PurchaseOrderState(PurchaseOrderState.#VALID_STATES.SHIPPED);
  }

  /**
   * Transitions to Completed state from the current state.
   *
   * **Business Rule**: A purchase order is completed when all items have been received and verified
   * against the order after shipment. This finalizes the order process, locking it from further
   * modifications to ensure accurate financial and inventory records.
   *
   * @param {PurchaseOrderState} currentState - The current state.
   * @returns {PurchaseOrderState} New state instance set to 'Completed'.
   * @throws {ValidationError} If current state is not 'Shipped'.
   */
  toCompletedFrom(currentState) {
    if (currentState.value !== PurchaseOrderState.#VALID_STATES.SHIPPED) {
      throw new ValidationError('PurchaseOrder can only be completed from Shipped state');
    }
    return new PurchaseOrderState(PurchaseOrderState.#VALID_STATES.COMPLETED);
  }

  /**
   * Transitions to Canceled state from the current state.
   *
   * **Business Rule**: A purchase order can be canceled at any point before completion if it is no
   * longer necessary or if issues arise (e.g., supplier failure, budget cuts). Cancellation is blocked
   * once the order is Completed to prevent reversal of finalized transactions and maintain audit
   * integrity.
   *
   * @param {PurchaseOrderState} currentState - The current state.
   * @returns {PurchaseOrderState} New state instance set to 'Canceled'.
   * @throws {ValidationError} If current state is 'Completed'.
   */
  toCanceledFrom(currentState) {
    if (currentState.value === PurchaseOrderState.#VALID_STATES.COMPLETED) {
      throw new ValidationError('PurchaseOrder cannot be canceled once Completed');
    }
    return new PurchaseOrderState(PurchaseOrderState.#VALID_STATES.CANCELED);
  }

  /**
   * Checks if the current state is Draft.
   *
   * **Business Rule**: The Draft state indicates that the purchase order is still being prepared
   * and can be modified (e.g., items added) before submission. This method provides a way to
   * determine if modifications are allowed without relying on string literals.
   *
   * @returns {boolean} True if the state is 'Draft', false otherwise.
   */
  isDraft() {
    return this.#value === PurchaseOrderState.#VALID_STATES.DRAFT;
  }

  /**
   * Gets the state value.
   * @returns {string} The state (e.g., 'Draft', 'Submitted').
   */
  get value() {
    return this.#value;
  }

  /**
   * Checks if this state equals another.
   * @param {PurchaseOrderState} other - The other state to compare.
   * @returns {boolean} True if equal, false otherwise.
   */
  equals(other) {
    return other instanceof PurchaseOrderState && this.#value === other.value;
  }
}
