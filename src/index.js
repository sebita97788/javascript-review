import { Supplier } from './scm/domain/model/supplier.js';
import { SupplierId as ScmSupplierId } from './scm/domain/model/supplier-id.js';
import { SupplierId as ProcurementSupplierId } from './procurement/domain/model/supplier-id.js';
import {Currency} from "./shared/domain/model/currency.js";
import {PurchaseOrder} from "./procurement/domain/model/purchase-order.js";
import {DateTime} from "./shared/domain/model/date-time.js";

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