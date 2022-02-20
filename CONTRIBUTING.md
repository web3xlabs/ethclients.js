# Contributing to ethclients.js

Welcome, developer! We're excited to hear that you're interested in contributing to the `ethclients.js` project.

Take a few minutes to read through the guidelines for contribution below, and feel free to propose changes to
these guidelines via a pull request.

## Getting Started

**What is `ethclients.js`?** This project is a package that provides several Web3 client drivers for popular
EVM-based blockchains. Since EVM-based chains generally implement identical functionality, we are able to bundle
multiple chain clients into a single package - using the same connection schemes and methods for each interaction.

The idea behind `ethclients.js` is not only to provide an easy way to begin interacting with Web3 chains, but also
intends to provide a highly available chain connection via endpoint failover. This means that if an endpoint becomes
unavailable, the client will automatically failover to the next available endpoint and retry the request.

### Preparing for Development

**Requirements:**
* NodeJS v16+
* NPM or Yarn (Yarn preferred)

1. Checkout this repository: `git clone git@github.com:web3xlabs/ethclients.js`
2. Install dependencies: `yarn install`
3. Run tests: `yarn test`
4. Run ESLint: `yarn lint` / `yarn lint:fix`

**Module Alias:**

Within the package `module-alias` is used. The project root is identified by `@ethclients`.

## How Can I Contribute?

### Bug Reports
Found a problem? Report a bug! You may create a bug report via GitHub Issues, or if you already have a plan to
fix the bug, you may submit a pull request with your proposed fix.

In any case (pull request or issue submission), bug reports should follow this template:
* **NodeJS Version**
* **Package Version**
* **Bug Description**
* **Expected Behavior**
* **Steps to Reproduce**

### Features and Improvements
If you have an idea for a new feature or a way to improve this package, we'd love to see it!

First, check to ensure that your feature hasn't already been suggested and that a pull request for it
does not yet exist.

You may _suggest_ a feature or improvement via GitHub Issues. If you already have a plan for feature
implementation, feel free to submit it as a pull request.

All features and improvements (pull requests or issues) should follow this template:
* **Description of New Functionality**
* **Description of Importance/Impact** (how will this feature be used and why is it useful)
* **Desired end result** (optional; describe how you expect the package to function with this feature)

## Submitting Changes
When you are ready to submit your changes via pull request, ensure you're adhering to the following guidelines.

### Code Styling and Linting
Lint checks must pass on each PR. You can check for linting errors with:
```
yarn lint
```

Many errors are able to be fixed automatically. To automatically fix eligible errors/warnings:
```
yarn lint:fix
```

### Tests and Coverage
Tests must pass on each PR. You can run tests yourself before submitting the PR with:
```
yarn test
```

When adding or changing code, you should try and ensure the tests are covering each part of the new or altered
code. You can run test coverage with:
```
yarn test --coverage
```

### Commit Messages
Commit messages should make sense, and should include some keywords that help developers identify what was
done in that commit.