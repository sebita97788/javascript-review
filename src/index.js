import { Supplier } from './scm/domain/model/supplier.js';
import { SupplierId as ScmSupplierId } from './scm/domain/model/supplier-id.js';

// Register a supplier in the SCM context.
const supplier = new Supplier({
    id: ScmSupplierId.generate(),
    name: 'Acme Corp',
    contactEmail: 'contact@acme.com',
});
console.log(`Registered supplier ${supplier.id} - ${supplier.name} <${supplier.contactEmail}>`);