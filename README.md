# Deno Vite Workspace Bugs
This repo outlines a few different bugs that can occur when attempting to use deno workspaces with vite.

## Setup
```bash
git clone git@github.com:andykais/deno-vite-workspace-bug-repro.git
cd deno-vite-workspace-bug-repro
deno install --allow-scripts
cd packages/web
deno task dev
# open your browser to http://localhost:5173/add, http://localhost:5173/subtract, http://localhost:5173/divide
```


## Project Structure
There are four workspace members:
- `@sample/add`
- `@sample/subtract`
- `@sample/divide`
- `@sample/web`
The three math operation members are all imported by `@sample/web`. `@sample/add` has no errors, while `@sample/subtract` and `@sample/divide` have errors for reasons outlined below. The `@sample/web` project uses a vite config with `@deno/vite-plugin`.

## Bug 1:
Workspace projects imported by a vite project will only work when the workspace project dependencies are at the root import, otherwise they fail. Both `@sample/add` and `@sample/subtract` have a `jsr:@std/log` dependency, but only `@sample/subtract` fails to import in `@sample/web`. You can see this by visiting `http://localhost:5173/add` and `http://localhost:5173/subtract`, which import the workspace members respectively. `http://localhost:5173/subtract` fails with the following error:
```
Cannot find module '@std/log' imported from '/Users/andrew/Code/scratchwork/deno-vite-import-map-support-2025-07-23/packages/subtract/src/lib/logger.ts'
```
The only difference between these two modules is that one imports the dependency from the root module in the workspace member, while the other imports the dependency from a another module imported by the root module.


## Bug 2:
Workspace members cannot import anything by an import alias except at the root module. Visit `http://localhost:5173/divide` and see the following error:
```
Cannot find module '#/util/logger.ts' imported from '/Users/andrew/Code/scratchwork/deno-vite-import-map-support-2025-07-23/packages/divide/src/context.ts'
```
The import from the root module (which `@sample/web` imported) imported `packages/divide/src/mod.ts` -> `packages/divide/src/context.ts` -> `packages/divide/src/util/logger.ts`. Note that the failure happened on the `util/logger.ts` dependency, not the `context.ts` dependency. This proves out that import aliases have partial support with the deno vite plugin.
