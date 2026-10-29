---
title: "Build a package"
description: "Bundle nodes and their dependencies into a package, share it as a .curio.zip archive, and publish, version and fork it."
group: extending
order: 20
deeper:
  - { doc: docs/EXTENDING.md, label: "Extending Curio with node packages" }
  - { doc: docs/EXTENDING.md, anchor: 1-anatomy-of-a-package, label: "Anatomy of a package" }
  - { doc: docs/AUTHORING-NODES.md, anchor: tags-and-data-types, label: "Tags and data types" }
  - { doc: docs/AUTHORING-NODES.md, anchor: submitting-your-package, label: "Submitting your package" }
  - { doc: docs/NODE-CATALOG.md, label: "Node Catalog reference" }
  - { doc: docs/EXTENDING.md, anchor: 9-writing-a-skill, label: "Writing a skill, for Curio or a package" }
---

# Build a package

A package is how Curio ships nodes: a folder named `<packageId>@<major>`, such as `curio.weather@1`, whose manifest declares one or more node templates and the libraries they need. Every node comes from one, including the built-ins in `curio.builtin@1`. Packages travel as `.curio.zip` archives, and an install's shared catalog offers them to all of its users.

## What a package contains

- `manifest.json`: the id, name, publisher, version and compatibility, the dependencies, and one entry per node template with its label, icon, category, input and output port types, editor, and the behavior key that implements it. Its schema is `docs/schemas/node-package.v4.json`.
- `sources/`: one starter file per template, or the TypeScript hooks of a custom-UI node.
- `scripts/`: the compiled `behaviors.js` that a custom-UI node needs, named by the manifest's `behaviorScript`.
- `skills/`: what the package tells Curio's agents about its nodes, one folder per skill (see [Skills for the agents](#skills-for-the-agents)).
- `models/`: in a model package, the trained model's weights (see [Model Catalog](/model-catalog/)).
- `README.md`, shown in the catalog, and `LICENSE`.
- `integrity.json`: a SHA-256 hash of every other file, written on install. After editing a package in place, regenerate it (see [Write a node](/authoring-nodes/)).

An [agent](/ai-agents/#what-agents-work-with) that writes a node of a template reads its description, its starter, and the public functions of the package's modules and of the packages it needs. It reads each function by its signature and the first paragraph of its docstring.

## Skills for the agents

A package can tell Curio's agents how to use its nodes in skills: the folders of its `skills/`, one per skill, each holding a `SKILL.md` in the [Agent Skills format](https://agentskills.io/specification) with any files it reads beside it ([Add skills and agents](/skills-and-agents/#write-a-skill) shows the format). Every agent on a dataflow that uses the package reads them: its chat lists them after its own skills and loads one when a task matches its description. A run that writes one of the package's nodes is handed, from its first message, each skill whose `metadata` names that node's template in `curio-templates`, by the template's `id` in the manifest:

```yaml
metadata:
  curio-templates: raster-calculator rasterize-buildings
```

A skill names only its own package's templates, and agents read it as its author wrote it. Name your skills after your package: a skill named like one of Curio's, or like a skill of a package the dataflow lists before yours, is left out. Scout's skill, [`scout`](https://github.com/urban-toolkit/curio/blob/main/packages/curio.scout@1/skills/scout/SKILL.md), is an example.

## Icons, tags and data types

A template's `iconRef` names its icon in the palette: any icon of Font Awesome's free solid or brands set, by the name [fontawesome.com](https://fontawesome.com/icons) gives it, such as `fa-solid:tree` or `fa-brands:github`. A name Font Awesome does not have shows a cube.

The [projects page](/projects-and-files/#the-projects-page) files each dataflow under tags and data types. Curio finds most of them in the dataflow itself, such as Pandas for code that imports it. For what your nodes bring that their code does not show, declare `dataflowCategories`, at the top of the manifest for every node of the package, or in a template for its nodes:

```json
"dataflowCategories": { "tags": ["Hydrology"], "dataTypes": ["Rasters"] }
```

A dataflow with one of those nodes is then under Hydrology and Rasters. A name the rail already lists, such as Rasters, files the dataflow there, and a new name, such as Hydrology, adds an entry. A model package declares them the same way.

## Dependencies

`dependencies.python` maps each library to a version spec: a PEP 440 range such as `>=2.0`, a bare version for an exact match, a caret such as `^0.14` for compatible releases, or an empty string for any version. Curio's own requirements cover only the framework, so even `curio.builtin@1` declares its data libraries here.

A package saved from the canvas takes its dependencies from the imports in its source, mapping common names to what they install as (`sklearn` to `scikit-learn`, `cv2` to `opencv-python`). An imported archive keeps what its author declared. Adding a package installs the libraries that are not already installed; on a deployment, each signed-in user's libraries go to their own environment.

## The .curio.zip archive

The download icon on a package's row in the **Node Catalog** dropdown saves `<packageId>@<major>.curio.zip`. **Export** in a package's details does the same, even for a catalog package you never added, such as one you are writing under `packages/`. The archive holds the package's files, such as the manifest, `sources/`, `skills/` and `scripts/`, at its root with no wrapper folder. `integrity.json` is left out and rebuilt on install, and a custom-UI package carries its compiled bundle, so the recipient needs no build step.

**Import package**, in the Node Catalog drawer's footer and on the Node Catalog page, installs an archive. The installer validates the manifest and each skill, rejects files outside the folders a package may contain, and refuses a package you already have: remove that one first. Install packages you trust, as with any other dependency.

## Publishing, versions and forks

**Publish**, on a package's row in the Node Catalog dropdown or in its panel on the Node Catalog page, copies it from your store into the install's shared catalog, the `packages/` folder, where every user of that install can add it. Only the account that published a package can **Unpublish** it. Both are hidden when Curio runs with `--no-allow-publish`, as the Docker deployment does; a deployment's catalog is the `packages/` folder of the commit its image was built from. There is no hosted package registry.

Bump `version` for fixes and additions. For a breaking change, such as a renamed behavior key or a changed port type, bump `compatibility.major` and the folder suffix; two majors install side by side. A saved dataflow names each node as `<packageId>/<templateId>`, which resolves to the highest installed major, and a trailing `@<major>` pins one.

A fork names its parent in the manifest's `lineage.forkedFrom` and the original in `lineage.root`, and the Node Catalog dropdown groups forks under their original. A package marked `"readOnly": true`, such as `curio.builtin@1`, cannot be saved into: **Save as package node** copies its node into a new package of your own, which keeps neither a custom interface nor the package's skills.
