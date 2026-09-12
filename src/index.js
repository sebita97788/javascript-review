import { Supplier } from './scm/domain/model/supplier.js';
import { SupplierId as ScmSupplierId } from './scm/domain/model/supplier-id.js';
import { SupplierId as ProcurementSupplierId } from './procurement/domain/model/supplier-id.js';
import { Currency } from './shared/domain/model/currency.js';
import { PurchaseOrder } from './procurement/domain/model/purchase-order.js';
import { DateTime } from './shared/domain/model/date-time.js';
import { ProductId } from './procurement/domain/model/product-id.js';
import { Money } from './shared/domain/model/money.js';

// Register a supplier in the SCM context.
const supplier = new Supplier({
  id: ScmSupplierId.generate(),
  name: 'Acme Corp',
  contactEmail: 'contact@acme.com',
});
console.log(`Registered supplier ${supplier.id} - ${supplier.name} <${supplier.contactEmail}>`);

// Raise a purchase order in the Procurement context. The order references the supplier
// through Procurement's own SupplierId, never SCM's type.
const usd = new Currency('USD');
const order = new PurchaseOrder({
  supplierId: new ProcurementSupplierId(supplier.id.value),
  currency: usd,
  orderDate: new DateTime(new Date('2025-04-10T10:00:00Z')),
});
console.log(
  `Purchase order ${order.id} - Supplier: ${supplier.name} (${supplier.id.value}), ` +
    `Ordered at: ${order.orderDate.toString()}, State: ${order.state}`
);

order.addItem({
  productId: ProductId.generate(),
  quantity: 5,
  unitPrice: new Money({ amount: 45.99, currency: usd }),
});
order.addItem({
  productId: ProductId.generate(),
  quantity: 10,
  unitPrice: new Money({ amount: 22.99, currency: usd }),
});
console.log(`Items added: ${order.items.length}`);

const total = order.calculateTotalPrice();
supplier.recordOrder(total);
console.log(
  `Purchase order ${order.id} - Supplier: ${supplier.name} (${supplier.id.value}), ` +
    `Ordered at: ${order.orderDate.toString()}, State: ${order.state}, ` +
    `Items: ${order.items.length}, Total: ${total.toString()}`
);

try {
  order.cancel();
} catch (error) {
  console.error(`Error: ${error.message}`); // PurchaseOrder cannot be canceled once Completed
}
