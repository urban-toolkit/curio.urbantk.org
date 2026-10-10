---
title: "Introduction"
description: "What Curio is, how dataflows and nodes work, and the hosted instance versus your own install."
group: getting-started
order: 10
card: { poster: /media/visualization/linked-charts.webp, alt: "Two linked Vega-Lite charts fed by one computation" }
deeper:
  - { doc: README.md, label: "Curio on GitHub" }
  - { doc: docs/README.md, anchor: examples, label: "Example gallery" }
  - { doc: docs/ARCHITECTURE.md, anchor: system-overview, label: "System architecture" }
---

# Introduction

Curio is a framework for urban visual analytics: you load city data, prepare it with code, and turn it into linked charts and maps, all on one canvas in your browser. Its building block is the dataflow, a graph of small steps that you can read, rerun and share. This page explains the main ideas and points you to the rest of the guide.

## Dataflows and nodes

A dataflow is a set of nodes joined by connections. Each node does one step: it takes what the nodes connected to its input produced, runs, and passes its own result on. Results travel as tables (pandas DataFrames, or GeoDataFrames with geometry), single values, lists, JSON or rasters.

Nodes work at different levels. Some hold Python or JavaScript code, some hold a declarative grammar such as a Vega-Lite chart spec, and some offer widgets, so people with different skills can build one analysis together. Pressing a node's play button runs it, after first running whatever it depends on that is out of date.

Curio also keeps the dataflow's history as you work, and **View > Provenance** shows its earlier versions as a graph you can step back through (see [Provenance](/provenance/)).

<LoopVideo src="/media/dataflows/build.mp4" poster="/media/dataflows/build.webp" caption="A dataset dragged onto the canvas becomes a Data Loading node, which is connected to a Data Transformation node and run with the play button." :w="1280" :h="768" />

## The kinds of nodes

The rail on the left of the canvas holds the built-in nodes, in three groups:

- **Data and flow.** **Data Loading** brings data in, **Data Transformation** filters and reshapes it, **Data Export** saves a result as a file, **Spatial Join** pairs the rows of two inputs whose shapes meet, **Edit Features** removes or changes features by hand, **Data Pool** shares one result with several linked views, and **Parameter** holds one value every node can read.
- **Computation.** **Python Computation** and **JS Computation** run your own analysis code, **Data Summary** describes a table: its shape, column types and missing values, and **Raster Calculator** and **Raster Statistics** work on rasters.
- **Visualization.** **Vega-Lite** draws charts, and maps from a GeoDataFrame; **Autark** draws 2D and 3D maps and runs GPU computations from one spec; **Simple View** shows a table, or a card per row for images; **Compare Scenarios** compares the outcomes of scenarios.

A node can take several inputs: each connection gets its own input circle, and the code reads each input through a chip (see [Connecting nodes](/dataflows/#connecting-nodes)).

A selection in one chart or map becomes data the rest of the dataflow can read, which is how views are linked (see [Linked views](/interactions/)). More nodes come as packages from the [Node Catalog](/node-catalog/), and you can [write your own](/authoring-nodes/). AI agents attach to a node, a connection or the whole dataflow to help you write code, debug and plan (see [AI agents](/ai-agents/)).

<LoopVideo src="/media/visualization/linked-charts.mp4" poster="/media/visualization/linked-charts.webp" caption="An example dataflow on Chicago speed-camera violations runs with Run all nodes, and one aggregation feeds both a bar chart and a line chart." :w="1280" :h="768" />

## The hosted instance or your own computer

The hosted instance runs in your browser with nothing to install. It has accounts: sign in to save your work, and each new account starts with its own copies of the example dataflows. You can also continue as a guest to look around, without saving.

Running Curio yourself, with pip or Docker, puts its three parts on your computer: a backend that stores your projects, a sandbox that runs node code, and the web app. A local Curio signs you in automatically and can read files from your own disk. To host Curio for a group, with accounts, see [Run your own server](/self-hosting/).

<GuideFigure src="/media/projects-and-files/examples.webp" alt="The Projects page with example dataflows" caption="The Projects page of a brand-new account already holds its own copies of the example dataflows." :w="1280" :h="768" />

## Where to go next

- [Quick start](/quick-start/): build a first dataflow in the hosted instance.
- [Install](/install/): run Curio on your own computer.
- [Dataflows and nodes](/dataflows/) and [Projects and files](/projects-and-files/): the canvas, running nodes, saving, and notebooks.
- [Data Catalog](/data-catalog/) and [Discovery Catalog](/discovery/): datasets, your own files, open data portals, storage and services.
- [Model Catalog](/model-catalog/): trained models your nodes run.
- [Charts and maps](/visualization/) and [Dashboards and sharing](/dashboards/): views, and pages that present them.
- [Run your own server](/self-hosting/): host Curio for a group, with accounts.
