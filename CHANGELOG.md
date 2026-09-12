# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-09-08

### Added
- SCM and Procurement bounded contexts with a `shared` kernel.
- `Supplier` aggregate (SCM) covering US001-US002: register with a validated name and email, record its last order total through an intention-revealing method.
- `PurchaseOrder` aggregate root (Procurement) covering US003-US007: create, add items, calculate the total, and walk the lifecycle (submit, approve, ship, complete, cancel).
- `PurchaseOrderItem` value object, priced in the order's own currency.
- `PurchaseOrderState` value object encapsulating the six states and every legal transition.
- Value objects: `Money`, `Currency` (ISO 4217 whitelist), `DateTime` (immutable, defensively copied), `SupplierId` (SCM and Procurement each own a copy), `ProductId`, `PurchaseOrderId`.
- Each bounded context owns its identifiers: Procurement has its own `SupplierId` rather than importing SCM's, so the two contexts stay decoupled.
- `generateUuid()` / `validateUuid()` utility over the `uuid` package, producing time-ordered UUID v7 identifiers.
- ESLint and Prettier configuration, wired to `npm run lint` (also `npm test`) and `npm run format`.
- `docs/user-stories.md` (with a Requirement Traceability Matrix), `docs/class-diagram.puml`, `docs/adrs.md`.
- `CONTRIBUTING.md` with OOP, DDD, Git Flow, and Conventional Commit guidelines.

### Design notes
- ECMAScript private fields (`#`) throughout, and `Object.freeze` on every value object for true runtime immutability.
- `PurchaseOrder.items` returns a frozen copy, so the internal array can't be mutated from outside; `addItem()` is the only way in.
- Items can only be added while the order is `Draft`; state transitions are the only way to change `#state`.
- `addItem()` takes a `Money` in the order's currency, rejecting a mismatch at the boundary.
