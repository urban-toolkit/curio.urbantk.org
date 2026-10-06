---
title: "Write a node"
description: "Turn your own Python into a reusable node, or build a node with its own interface, and export it to share."
group: extending
order: 10
card: { poster: /media/authoring-nodes/node-settings.webp, alt: "The Node settings dialog" }
deeper:
  - { doc: docs/AUTHORING-NODES.md, label: "Authoring nodes" }
  - { doc: docs/NODE-CATALOG.md, anchor: new-node-from-a-python-function, label: "New node from a Python function" }
  - { doc: docs/AUTHORING-NODES.md, anchor: reading-upstream-data, label: "Reading upstream data" }
  - { doc: docs/AUTHORING-NODES.md, anchor: things-that-will-trip-you-up, label: "Things that will trip you up" }
  - { doc: docs/EXTENDING.md, label: "Extending Curio: backends, external APIs and dependencies" }
  - { doc: docs/ARCHITECTURE.md, anchor: nodes-types-and-structure, label: "How nodes are declared and rendered" }
---

# Write a node

Every node in Curio, the built-ins included, comes from a package: a folder whose `manifest.json` declares one or more node templates. You can add your own in two ways: a Python node reuses Curio's code editor and needs no build step, while a node with its own interface is a React hook written in TypeScript and compiled into a bundle.

## A Python node

1. Drop a **Data Transformation** node on the canvas and write your Python in its editor. The upstream node's output arrives as `arg`, and whatever you `return` becomes this node's output. Run it until it does what you want.
2. Click the cog in the node header to open **Node settings**, and set the label, the port types and the editor mode.
3. Click **Save as package node…**, pick **New package…**, give the package a name and save.

The node now belongs to your package, in your own store under `.curio/users/`: it stays in the palette after a restart, its imports are recorded as the package's dependencies, and Curio generates its id. To pick your own reverse-domain id, start from files in a git clone (see [Contribute](/contributing/)): `python scripts/new_package.py me.roughness` writes a valid `packages/me.roughness@1/` with a Python starter, to add from the Node Catalog drawer.

<GuideFigure src="/media/authoring-nodes/node-settings.webp" alt="The Node settings dialog" caption="The Node settings dialog, where a node&#x27;s label, capabilities and port types are set before it is saved as a package node." :w="1280" :h="768" />

## A node from a Python function

A package that ships Python modules beside its templates gives you a node for any of their functions, with no code to write:

1. Open the **Node Catalog** drawer and click **New node from a Python function** in its footer.
2. Pick the function. The list holds every public function of the modules your installed packages ship.
3. For each parameter, choose what it gets: a [widget](/widgets/), whose type Curio suggests from the parameter's annotation or default; a fixed value, written as Python writes it; an input of the node; or its default.
4. Name the node, choose the package it goes into, and click **Create node**.

The node joins the project's palette. Its code imports the function and returns its call, with the widgets and inputs as chips:

```python
from scout_shadow.deep_umbra import season_factor

return season_factor(season=[!! season !!])
```

## A node with its own interface

A custom node replaces the code editor with controls you design, in a React hook that renders inside the node body. **Save as package node** never includes the compiled bundle such a node needs, so this kind is written as files in a git clone:

```bash
python scripts/new_package.py me.mynode --with-ui
cd utk_curio/frontend/urban-workflows
npm run build:packages
```

Before the first build, paste the entry the scaffold prints into `webpack.packages.config.js`, then add the package to a dataflow from the Node Catalog drawer. Curio runs your installed copy, not the files in `packages/`, and refreshes that copy when those files change, so reload the page after each rebuild. The `curio.example-ui@1` package, a column filter, is the example to read and fork.

<GuideFigure src="/media/authoring-nodes/column-filter.webp" alt="A Column Filter node next to a Data Loading node" caption="The Column Filter from the example package, wired to a Data Loading node, names the numeric column it found and counts the rows that match." :w="1100" :h="440" />

## Reading upstream data

In a Python node, `arg` is a Python object such as a DataFrame, a GeoDataFrame, a value, a list or a dict, or, when the node has several inputs, a list of them in the order of its input circles. Read a Data Catalog dataset with `curio_load_data("<dataset id>")`, using the id without its `@` version, not a file path, so the dataflow keeps working for others. `curio_data_path("<dataset id>")` gives the dataset's file, for a reader of your own.

In a custom node, `data.input` usually holds a reference to a stored result, not the data. Fetch it from the backend at `window.curio.backendUrl` with the user's session token, not `process.env.BACKEND_URL`, which bakes in your own machine's address. A DataFrame arrives as one array per column, while hand-written data may key each column by row, so accept both. The example package's `resolveInput` handles every shape.

## What to watch for

- A custom node that shows a plain code editor has a bundle that failed to load, which the browser console reports, or mismatched keys: the template's `behavior`, the key passed to `registerBehavior` and the manifest's `behaviorScript` path must agree.
- Build with `npm run build:packages`, not the full `npm run build`, and never bundle your own copy of React.
- After editing a package in place, refresh its hashes with `python scripts/regen_integrity.py packages/<id>@<major>`.

## Sharing it

Export the package with the download icon on its row in the **Node Catalog** dropdown of the Tools panel. You get one `<packageId>@<major>.curio.zip` that carries a custom node's compiled bundle, so whoever installs it needs no build step. To check that it stands on its own, remove the package and import the archive. [Build a package](/packages/) covers archives, dependencies, publishing and versions.
