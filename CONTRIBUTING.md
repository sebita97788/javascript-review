# Contributing to JavaScript Review

Thank you for your interest in contributing to the JavaScript Review project! This document outlines the standards and workflows we follow to maintain a high-quality, domain-driven codebase.

## Core Principles

We strictly adhere to the following architectural and programming paradigms:

### 1. Domain-Driven Design (DDD)
- **Bounded Contexts:** Logic is organized into specific contexts (e.g., `procurement`, `scm`, `shared`).
- **Entities & Aggregates:** Business logic belongs in rich domain models, not in service layers. Use private fields (`#`) for internal state.
- **Value Objects:** Use immutable objects for attributes that have no identity (e.g., `Money`, `DateTime`, `SupplierId`). All Value Objects must implement `equals()` and `toString()`.
- **Deep Immutability:** Value Objects must be frozen with `Object.freeze()` and use defensive cloning for mutable internal types like `Date`.

### 2. Object-Oriented Programming (OOP)
- **Encapsulation:** Protect the internal state of objects. Provide access via getters or domain-specific methods that maintain invariants.
- **Validation:** Objects must be valid upon creation. Use constructors to enforce business rules and throw errors if preconditions are not met.

### 3. Modern JavaScript
- Use **ES Modules** (`"type": "module"` in `package.json`).
- Leverage latest features like private class fields (`#`), optional chaining (`?.`), and nullish coalescing (`??`).
- Use `uuid` version 7 for time-ordered unique identifiers.

## Development Workflow

### Git Flow & Branching
We follow a simplified **Git Flow** strategy:
- `main`: Production-ready code.
- `develop`: Integration branch for features.
- `feature/*`: New features or improvements.
- `release/*`: Prepares for a new release.
- `fix/*`: Bug fixes.
- `hotfix/*`: Urgent production fixes.

### Conventional Commits
Commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat`: A new feature.
- `fix`: A bug fix.
- `docs`: Documentation only changes.
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc).
- `refactor`: A code change that neither fixes a bug nor adds a feature.
- `perf`: A code change that improves performance.
- `test`: Adding missing tests or correcting existing tests.
- `build`: Changes that affect the build system or external dependencies (e.g., adding Prettier/ESLint configs).
- `chore`: Other changes that don't modify src or test files.

**Example:** `feat(procurement): add ability to cancel purchase orders`

### Semantic Versioning
The project follows [SemVer](https://semver.org/).
- **MAJOR** version for incompatible API changes.
- **MINOR** version for functionality added in a backwards compatible manner.
- **PATCH** version for backwards compatible bug fixes.

## Quality Standards

### Linting & Formatting
Before submitting changes, ensure your code passes linting and is properly formatted:
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run format`: Runs Prettier to ensure consistent code style.

### Documentation
- **User Stories:** Update `docs/user-stories.md` using the Given-When-Then format for any new or changed behavior.
- **Class Diagram:** Update `docs/class-diagram.puml` to reflect changes in the domain model.
- **Changelog:** Add an entry to `CHANGELOG.md` under the `[Unreleased]` section.

## Getting Started
1. Clone the repository.
2. Install dependencies: `npm install`.
3. Create a new branch: `git checkout -b feature/your-feature-name`.
4. Make your changes following the principles above.
5. Run linting and formatting.
6. Commit your changes using Conventional Commits.
7. Open a Pull Request.

Thank you for contributing!
