# degrootsam-blockstore

Betty Blocks blockstore containing custom components and app functions used in Betty Blocks applications.

## Structure

This is a monorepo with two independent Betty Blocks packages:

- [`components/`](./components) — Custom Betty Blocks Component Set (React-based UI components, interactions, and prefabs) for use in the Page Builder.
- [`functions/`](./functions) — Betty Blocks app functions and action steps (array helpers, document generation, sanitization, try/catch).

Each package has its own `package.json`, dependencies, and README with package-specific instructions.

## Components

Located in [`components/`](./components).

- Built with the [`@betty-blocks/component-sdk`](https://github.com/bettyblocks/cli/wiki) and React 19.
- Includes custom components (`src/components`), interactions (`src/interactions`), and prefabs (`src/prefabs`).

```bash
cd components
bun          # install dependencies
bun dev      # build + watch
bun start    # serve components locally (port 5002)
bun build    # production build
bun lint     # lint src
```

See [`components/README.md`](./components/README.md) for more details.

## Functions

Located in [`functions/`](./functions).

- App functions built with [`@betty-blocks/cli`](https://www.npmjs.com/package/@betty-blocks/cli).
- Includes array utilities (map, filter, reduce, sort, etc.), document generation, value sanitization, and a try/catch action step.
- Tested with [Vitest](https://vitest.dev).

```bash
cd functions
npm install
npm test      # run tests with vitest
npm run publish  # publish blocks to Betty Blocks
```

## Commit conventions

This repo uses [Conventional Commits](https://www.conventionalcommits.org), enforced via `commitlint` and `commitizen`. To create a commit interactively:

```bash
npx cz
```

## Tooling

Code is formatted and linted via [Trunk](https://trunk.io) (see `.trunk/trunk.yaml`).
