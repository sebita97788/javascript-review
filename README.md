# JavaScript Review (javascript-review)

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)

## Overview
A JavaScript demonstration project to illustrate **Object-Oriented Programming (OOP)** and **Domain-Driven Design (DDD)** principles within a Supply Chain Management and Procurement context.

The codebase serves as a reference for implementing domain models in bounded contexts using the latest JavaScript features.

## 🚀 Key Features
- **Bounded Contexts:** Clear separation between `Procurement`, `SCM`, and `Shared` subdomains.
- **Rich Domain Models:** Entities with internal business logic instead of anemic data structures.
- **Deep Immutability:** Value Objects protected by `Object.freeze()` and defensive cloning.
- **Standardized Identifiers:** UUID v7 based Value Objects for all entity IDs.
- **State Machine:** Robust lifecycle management for Purchase Orders.
- **Professional Tooling:** Integrated ESLint, Prettier, and automated linting.

## 🛠️ Principles in Action
- **Encapsulation:** Uses private class fields (`#`) to protect internal state.
- **Validation:** Enforces invariants at the constructor level; objects are always valid.
- **Value Objects:** `Money`, `DateTime`, `Currency`, and IDs are treated as immutable values.
- **Aggregate Roots:** `PurchaseOrder` manages the consistency of its `PurchaseOrderItem` collection.

## 📖 Documentation
- [User Stories](docs/user-stories.md): requirements as User Stories with Given-When-Then acceptance criteria, plus a Requirement Traceability Matrix.
- [Architecture Decision Records](docs/adrs.md): the DDD and design decisions behind the model.
- [Class Diagram](docs/class-diagram.puml): visual representation of the domain model.
- [Contributing Guide](CONTRIBUTING.md): development standards and workflow.
- [Changelog](CHANGELOG.md): history of project evolutions.

## 🏁 Getting Started

### Prerequisites
- **Node.js** (v20.x or higher recommended)
- **npm** (v10.x or higher)

### Installation
```bash
npm install
```

### Available Scripts
- `npm start`: Runs the demonstration entry point (`src/index.js`).
- `npm run dev`: Starts the application in watch mode.
- `npm run lint`: Validates code quality using ESLint.
- `npm run format`: Standardizes code style using Prettier.

## 🤝 Contributing
Contributions are welcome! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, DDD standards, and the process for submitting pull requests.

## 📝 License
This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.

---
**Developed by the Web Application Development Team**
