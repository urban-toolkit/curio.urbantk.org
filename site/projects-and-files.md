---
title: "Projects and files"
description: "Your projects, the examples every account starts with, saving and loading dataflows, and Jupyter notebooks."
group: using
order: 20
card: { poster: /media/projects-and-files/examples.webp, alt: "The Projects page with example dataflows" }
app: /projects
deeper:
  - { doc: docs/README.md, anchor: examples, label: "Example gallery" }
  - { doc: docs/TRILL-SPEC.md, label: "The saved dataflow format" }
  - { doc: docs/USAGE.md, label: "Running Curio yourself, with or without the examples" }
---

# Projects and files

Every dataflow you save is a project, listed on the projects page. There you open, rename, copy and delete projects and import Jupyter notebooks, while the canvas's **File** menu saves a dataflow to a file on your computer and loads one back.

## The projects page

**+ New Dataflow** opens an empty canvas, which becomes a project the first time you save it. The **Search projects…** box filters the list by name, the sort menu orders it by recent activity, name or creation date, and **Grid** and **List** switch the layout. Each card shows a thumbnail of the dataflow and a revision number that goes up with every save.

Double-click a card to open it, or click it once to see its details, with **Open dataflow**, **Rename**, **Duplicate** and **Delete**; right-clicking a card offers the same actions. **Duplicate** adds a copy with "(copy)" after its name, and **Delete** asks you to confirm, then deletes the project permanently. From the canvas, **File > Go to projects** or the Curio logo brings you back here.

Saving needs an account: on a server with sign-in, a guest can open dataflows but not save them.

<LoopVideo src="/media/projects-and-files/projects.mp4" poster="/media/projects-and-files/projects.webp" caption="The projects page, with the search box, the switch between grid and list views, and the Import Jupyter notebook button." :w="1280" :h="768" />

## The examples

Every account on the hosted Curio starts with its own copy of the example gallery, dataflows such as "Vega-Lite chained transforms" and "Autark PBF loading" that are ready to open and run. You can edit, rename and save them like any other project, but they cannot be deleted.

On your own computer, the examples come from starting Curio with `--with-examples`, which the Docker image does (see [Install](/install/)).

<GuideFigure src="/media/projects-and-files/examples.webp" alt="The Projects page with example dataflows" caption="A brand-new account&#x27;s projects page, already holding its own copies of the example dataflows." :w="1280" :h="768" />

## Saving to a file and loading one

**File > Save dataflow as** downloads the open dataflow as a `.json` file named after it. The file holds the nodes, their code and specifications, and the connections, but not their results or the [version history](/provenance/), so its nodes need to run again once it is loaded.

**File > Load dataflow** reads such a file and opens it as a new dataflow, asking first when the open dataflow has unsaved changes. Saving it adds it to your projects under its own name, and the dataflow that was open stays as it was. Curio installs the node packages the dataflow uses that you are missing; for a very large package, it puts an install button on the nodes that need it instead.

<LoopVideo src="/media/projects-and-files/saveload.mp4" poster="/media/projects-and-files/saveload.webp" caption="A dataflow is saved to a file with File &gt; Save dataflow as, then loaded into a new dataflow with File &gt; Load dataflow." :w="1280" :h="768" />

## Jupyter notebooks

**Import Jupyter notebook**, on the projects page, turns an `.ipynb` file into a new project named after the file. Each code cell becomes a node, named after the variable it produces, and cells that use variables from other cells are connected to them. Cells that only import libraries are gathered into one "Setup / Imports" node, cells that read data become Data Loading nodes, and a cell that builds an Altair chart becomes a Vega-Lite node.

**File > Export as notebook** goes the other way and downloads the dataflow as an `.ipynb` file, with its nodes in run order. Python nodes become functions you can run in Jupyter, and Vega-Lite nodes display their chart. Autark, JavaScript, Spatial Join and Simple View nodes, and nodes from other packages, are kept as notes, because a Python kernel cannot run them.

<LoopVideo src="/media/projects-and-files/jupyter.mp4" poster="/media/projects-and-files/jupyter.webp" caption="A Jupyter notebook is imported from the projects page and opens as a dataflow with one node per code cell." :w="1280" :h="768" />
