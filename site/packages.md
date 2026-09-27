---
title: "Build a package"
description: "Bundle nodes and their dependencies into a package, share it as a .curio.zip archive, and publish, version and fork it."
group: extending
order: 20
deeper:
  - { doc: docs/EXTENDING.md, label: "Extending Curio with node packages" }
  - { doc: docs/EXTENDING.md, anchor: 1-anatomy-of-a-package, label: "Anatomy of a package" }
  - { doc: docs/AUTHORING-NODES.md, anchor: submitting-your-package, label: "Submitting your package" }
  - { doc: docs/NODE-CATALOG.md, label: "Node Catalog reference" }
---

# Build a package

A package is how Curio ships nodes: a folder named `<packageId>@<major>`, such as `curio.weather@1`, whose manifest declares one or more node templates and the libraries they need. Every node comes from one, including the built-ins in `curio.builtin@1`. Packages travel as `.curio.zip` archives, and an install's shared catalog offers them to all of its users.

## What a package contains

- `manifest.json`: the id, name, publisher, version and compatibility, the dependencies, and one entry per node template with its label, category, input and output port types, editor, and the behavior key that implements it. Its schema is `docs/schemas/node-package.v4.json`.
- `sources/`: one starter file per template, or the TypeScript hooks of a custom-UI node.
- `scripts/`: the compiled `behaviors.js` that a custom-UI node needs, named by the manifest's `behaviorScript`.
- `README.md`, shown in the catalog, and `LICENSE`.
- `integrity.json`: a SHA-256 hash of every other file, written on install. After editing a package in place, regenerate it (see [Write a node](/authoring-nodes/)).

## Dependencies

`dependencies.python` maps each library to a version spec: a PEP 440 range such as `>=2.0`, a bare version for an exact match, a caret such as `^0.14` for compatible releases, or an empty string for any version. Curio's own requirements cover only the framework, so even `curio.builtin@1` declares its data libraries here.

A package saved from the canvas takes its dependencies from the imports in its source, mapping common names to what they install as (`sklearn` to `scikit-learn`, `cv2` to `opencv-python`). An imported archive keeps what its author declared. Adding a package installs the libraries that are not already installed; on a deployment, each signed-in user's libraries go to their own environment.

## The .curio.zip archive

The download icon on a package's row in the **Node Catalog** dropdown saves `<packageId>@<major>.curio.zip`. **Export** in a package's details does the same, even for a catalog package you never added, such as one you are writing under `packages/`. The archive holds the package's files, such as the manifest, `sources/` and `scripts/`, at its root with no wrapper folder. `integrity.json` is left out and rebuilt on install, and a custom-UI package carries its compiled bundle, so the recipient needs no build step.

**Import package**, in the Node Catalog drawer's footer and on the Node Catalog page, installs an archive. The installer validates the manifest, rejects files outside the folders a package may contain, and refuses a package you already have: remove that one first. Install packages you trust, as with any other dependency.

## Publishing, versions and forks

**Publish**, on a package's row in the Node Catalog dropdown or in its panel on the Node Catalog page, copies it from your store into the install's shared catalog, the `packages/` folder, where every user of that install can add it. Only the account that published a package can **Unpublish** it. Both are hidden when Curio runs with `--no-allow-publish`, as the Docker deployment does; a deployment's catalog is the `packages/` folder of the commit its image was built from. There is no hosted package registry.

Bump `version` for fixes and additions. For a breaking change, such as a renamed behavior key or a changed port type, bump `compatibility.major` and the folder suffix; two majors install side by side. A saved dataflow names each node as `<packageId>/<templateId>`, which resolves to the highest installed major, and a trailing `@<major>` pins one.

A fork names its parent in the manifest's `lineage.forkedFrom` and the original in `lineage.root`, and the Node Catalog dropdown groups forks under their original. A package marked `"readOnly": true`, such as `curio.builtin@1`, cannot be saved into: **Save as package node** copies its node into a new package of your own, where a custom interface does not survive.
