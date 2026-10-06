---
title: "Dataflows and nodes"
description: "The canvas and its notebook view, the built-in nodes, how to connect them, and how to run a dataflow."
group: using
order: 10
card: { poster: /media/dataflows/build.webp, alt: "A Data Loading node connected to a Data Transformation node" }
deeper:
  - { doc: docs/ARCHITECTURE.md, anchor: execution-pipeline, label: "What happens when a node runs" }
  - { doc: docs/examples/02-vega-lite-spatial-density.md, label: "Example: one table feeding several views" }
  - { doc: docs/examples/04-vega-lite-multi-flow-dashboard.md, label: "Example: joining flows in nodes with two inputs" }
  - { doc: docs/USAGE.md, anchor: notebook-view, label: "The notebook view" }
  - { doc: docs/USAGE.md, anchor: keys-for-node-code, label: "Keys for node code" }
---

# Dataflows and nodes

A dataflow is a set of nodes on a canvas, joined by connections. Each node does one step, such as loading data, running Python or drawing a chart, and passes its result to the nodes connected after it.

## The canvas and the palette

Drag a node from the **Built-in** column on the left onto the canvas; hover over an icon to see its name. Below that column, the **Node Catalog**, **Data Catalog** and **Agent Catalog** dropdowns hold your [packages](/node-catalog/), [datasets](/data-catalog/) and [AI agents](/ai-agents/). A dataset dropped on the canvas becomes a Data Loading node with its code already written.

Click the title at the top to rename the dataflow. The save state in the top bar reads **Saved** when the canvas is saved and **Unsaved** when it is not; click it, or choose **File > Save dataflow**. After the first save, Curio saves every 30 seconds while there are unsaved changes, and asks before you leave with changes it has not saved.

<LoopVideo src="/media/dataflows/canvas.mp4" poster="/media/dataflows/canvas.webp" caption="A new dataflow opens, the built-in node icons on the left are picked out one by one, and the File, View, Data and Provenance menus open in turn." :w="1280" :h="768" />

<TryIt path="/dataflow/new" label="Start a new dataflow" />

## Kinds of nodes

- **Data Loading** brings data in with Python.
- **Data Transformation** and **Python Computation** run Python on their input, which arrives as `arg`, and pass on what the code returns.
- **JS Computation** does the same in JavaScript.
- **Data Summary** reports a table's column types, missing values and statistics.
- **Data Pool** shows one result as a table and feeds it to several views; it is also where views [link](/interactions/).
- **Parameter** holds one value that any node's code can read (see [Widgets and parameters](/widgets/)).
- **Spatial Join** tags points with the polygon they fall in, or counts the points in each polygon.
- **Data Export** downloads its input as CSV, GeoJSON or JSON, with the **Download** button in its **Widgets** tab.
- **Raster Calculator** computes one operation over rasters on one grid, cell by cell, and **Raster Statistics** gives a raster's mean, median, minimum, maximum and count.
- **Edit Features** removes or changes features of a layer by hand, and **Compare Scenarios** compares the outcomes of [scenarios](/scenarios/).
- **Vega-Lite**, **Autark** and **Simple View** draw [charts, maps, tables and images](/visualization/).

Code runs on the Curio server, not in your browser.

## Connecting nodes

Drag from an output (on a node's right edge) to an input (on another node's left edge). Curio refuses a connection between types that do not fit, and one that would make a loop. An output can feed many nodes. A node that takes several inputs, such as Python Computation, Data Pool, Vega-Lite, Autark or Compare Scenarios, shows a new empty input circle below each one you connect; in code and specs, each input is a chip. The handle on top of views and Data Pools is for [interaction edges](/interactions/). To remove a connection, click it and press Delete or Backspace; deleting a node also removes its connections.

## Running a dataflow

Press the play button at the left of a node's header, or select the node and press Ctrl+Enter (Cmd+Enter on a Mac), which also works inside its editor. Upstream nodes that have not run successfully, or whose code has changed, run first. The node then reads **Done** or **Error**; a code node prints its output below its editor, and offers to install a Python library it is missing.

The **Run all nodes** button, at the bottom of the left column, runs the whole dataflow in order and turns into a stop button while it runs. A node that fails does not hold up the run.

<LoopVideo src="/media/dataflows/build.mp4" poster="/media/dataflows/build.webp" caption="A dataset dragged onto the canvas becomes a Data Loading node, which is connected to a Data Transformation node, run with the play button and saved." :w="1280" :h="768" />

## Inside a node

A node's header shows the play button, the node's title and kind, and its run status. Its other buttons show while the pointer is over the node or the node is selected. The first of them switch its tabs: **Code**, **Widgets**, **Grammar**, **Provenance** (its [past runs](/provenance/)) and **Output**, as the node has them. Code and specs sit in a gray box, and a code node prints its output below its code. In **Widgets**, markers in the code become controls: `[!! threshold$INPUT_VALUE$10 !!]` is a number field that starts at 10. The switch after the tabs saves the node's table output to your Data Catalog.

Click the title to rename the node; the gear beside it opens **Node settings**, for [making a reusable node](/authoring-nodes/). After the switch come a button that explains the node, **Pin to dashboard** for the dataflow's [dashboard](/dashboards/), **Comments** for notes that others can mark as resolved, **Delete node**, and **Minimize**, which folds the node into an icon that opens again with a click. **View > Minimize Nodes** folds them all, and **View > Expand Nodes** opens them again. Drag a node's bottom-right corner to resize it, and double-click a node where you would drag it, such as its header, to zoom the view onto it.

## Notebook view

The **Canvas | Notebook** switch, at the right of the top bar beside **Monitor**, shows the same dataflow as a column of cells across the page, like a Jupyter notebook, and the page scrolls. Each cell is followed by the cells it feeds, the most recently connected first, before the next cell that reads from nothing: the order **File > Export as notebook** writes.

A cell grows with its code and its output, and has the header and buttons of a node on the canvas, without **Minimize**. A code cell shows its output below its code; a Vega-Lite or Autark cell shows its spec above its chart or map. Connections run in the bar to the right of the cells, where each cell has its inputs as dots at the top, its interaction dot halfway down and its output at the bottom. Hover over a dot to see what feeds it; selecting a cell outlines it and darkens its connections.

Nodes are added and connected on the canvas: the notebook view has no column of nodes on its left, and its dots do not connect. In it, you edit and run a cell's code, delete a cell, or select a connection and press Delete to remove it; **Run all** sits at the top right of the page. The view changes nothing in the dataflow, so **Canvas** shows it as it was laid out. The address carries the view (`?view=notebook`), so a reload, or the address copied from the browser, opens the notebook view again.

## Use an API key in node code

Node code that calls an API with a key reads the key by name, from a **Node code** key saved in **API Settings**.

1. **Get the key** from the API's provider.
2. **Open API Settings** from the top bar. On the canvas and the dashboard it opens as a drawer on the right; on the Projects and catalog pages it opens the settings page.
3. On the **API keys** tab, click **Add configuration**.
4. In **Kind**, choose **Another API, for node code**.
5. Type a **Name**, such as `census`, and the **Host**, such as `api.census.gov`. In **Sent as**, keep **in the code (default)**, or choose **as a query parameter** or **as an HTTP header** and type the **Parameter name** or **Header name**.
6. Paste the **Key** and click **Save key**. The key's row shows **saved** in its **Key** column, and its **Details** show the host and how the key is sent.

Then read the key in the node's code by its name:

```python
api_key = curio_secret("census")
```

The key reaches the node only while it runs, and it never appears in the saved dataflow, in proposals, in the chat or in the run log. A node that names a key you have not saved fails with a message naming it. When you paste code that holds a key, a bar above the editor offers **Save as API key**, which opens the same form with the host filled in; an agent's Solve that reaches an API without a saved key offers **Add key for** the host. On a server started with `--deploy`, guest accounts cannot save a key.
