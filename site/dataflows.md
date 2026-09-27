---
title: "Dataflows and nodes"
description: "The canvas, the built-in nodes, how to connect them, and how to run a dataflow."
group: using
order: 10
card: { poster: /media/dataflows/build.webp, alt: "A Data Loading node connected to a Data Transformation node" }
deeper:
  - { doc: docs/ARCHITECTURE.md, anchor: execution-pipeline, label: "What happens when a node runs" }
  - { doc: docs/examples/02-vega-lite-spatial-density.md, label: "Example: one table feeding several views" }
  - { doc: docs/examples/04-vega-lite-multi-flow-dashboard.md, label: "Example: joining flows with Merge Flow" }
---

# Dataflows and nodes

A dataflow is a set of nodes on a canvas, joined by connections. Each node does one step, such as loading data, running Python or drawing a chart, and passes its result to the nodes connected after it.

## The canvas and the palette

Drag a node from the **Built-in** column on the left onto the canvas; hover over an icon to see its name. Below that column, the **Node Catalog**, **Data Catalog** and **Agent Catalog** dropdowns hold your [packages](/node-catalog/), [datasets](/data-catalog/) and [AI agents](/ai-agents/). A dataset dropped on the canvas becomes a Data Loading node with its code already written. **Help > Tutorial** tours the built-in nodes.

Click the title at the top to rename the dataflow. The disk icon in the menu bar is green when the canvas is saved and orange when it is not; click it, or choose **File > Save dataflow**. After the first save, Curio saves every 30 seconds while there are unsaved changes, and asks before you leave with changes it has not saved.

<LoopVideo src="/media/dataflows/canvas.mp4" poster="/media/dataflows/canvas.webp" caption="A new dataflow opens, the built-in node icons on the left are picked out one by one, and the File, View, Data and Provenance menus open in turn." :w="1280" :h="768" />

<TryIt path="/dataflow/new" label="Start a new dataflow" />

## Kinds of nodes

- **Data Loading** brings data in with Python.
- **Data Transformation** and **Python Computation** run Python on their input, which arrives as `arg`, and pass on what the code returns.
- **JS Computation** does the same in JavaScript.
- **Data Summary** reports a table's column types, missing values and statistics.
- **Data Pool** shows one result as a table and feeds it to several views; it is also where views [link](/interactions/).
- **Merge Flow** joins several flows; the next node gets them as `arg[0]`, `arg[1]` and so on, top input first.
- **Spatial Join** tags points with the polygon they fall in, or counts the points in each polygon.
- **Data Export** downloads its input as CSV, GeoJSON or JSON, with the **Download** button in its **Widgets** tab.
- **Vega-Lite**, **Autark** and **Simple View** draw [charts, maps, tables and images](/visualization/).

Code runs on the Curio server, not in your browser.

## Connecting nodes

Drag from an output (on a node's right edge) to an input (on another node's left edge). Curio refuses a connection between types that do not fit, and one that would make a loop. An output can feed many nodes, but each input takes one connection, so combine flows with a Merge Flow. The handle on top of views and Data Pools is for [interaction edges](/interactions/). To remove a connection, click it and press Delete or Backspace; a node must lose its connections before it can be deleted.

## Running a dataflow

Press the play button at a node's bottom left, or select the node and press Ctrl+Enter (Cmd+Enter on a Mac), which also works inside its editor. Upstream nodes that have not run successfully, or whose code has changed, run first. The node then reads **Done** or **Error**; a code node prints its output below its editor, and offers to install a Python library it is missing.

The **Run all nodes** button, at the bottom of the left column, runs the whole dataflow in order and turns into a stop button while it runs. A node that fails does not hold up the run.

<LoopVideo src="/media/dataflows/build.mp4" poster="/media/dataflows/build.webp" caption="A dataset dragged onto the canvas becomes a Data Loading node, which is connected to a Data Transformation node, run with the play button and saved." :w="1280" :h="768" />

## Inside a node

The icons along a node's bottom switch its tabs: **Code**, **Widgets**, **Grammar**, **Provenance** (its [past runs](/provenance/)) and **Output**, as the node has them. In **Widgets**, markers in the code become controls: `[!! threshold$INPUT_VALUE$10 !!]` is a number field that starts at 10. The switch beside the play button saves the node's table output to your Data Catalog.

In the header, **Minimize** folds the node into an icon that opens again with a click; **View > Minimize Nodes** folds them all, and **View > Expand Nodes** opens them again. Click the title to rename the node; the gear opens **Node settings**, for [making a reusable node](/authoring-nodes/). Then come a button that explains the node, **Pin to dashboard** for the dataflow's [dashboard](/dashboards/), **Comments** for notes that others can mark as resolved, and **Delete node**.
