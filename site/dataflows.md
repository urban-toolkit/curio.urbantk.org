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
  - { doc: docs/examples/26-several-inputs.md, label: "Example: several inputs in every node kind that takes them" }
  - { doc: docs/USAGE.md, anchor: notes, label: "Notes" }
  - { doc: docs/USAGE.md, anchor: notebook-view, label: "The notebook view" }
  - { doc: docs/USAGE.md, anchor: keys-for-node-code, label: "Keys for node code" }
  - { doc: docs/USAGE.md, anchor: spatial-join-node, label: "The Spatial Join node" }
  - { doc: docs/examples/25-spatial-join-operations.md, label: "Example: every Spatial Join operation" }
---

# Dataflows and nodes

A dataflow is a set of nodes on a canvas, joined by connections. Each node does one step, such as loading data, running Python or drawing a chart, and passes its result to the nodes connected after it.

## The canvas and the palette

Drag a node from the **Built-in** column on the left onto the canvas; hover over an icon to see its name. Below that column, the **Node Catalog**, **Data Catalog** and **Agent Catalog** dropdowns hold your [packages](/node-catalog/), [datasets](/data-catalog/) and [AI agents](/ai-agents/). A dataset dropped on the canvas becomes a Data Loading node with its code already written.

Click the title at the top to rename the dataflow. The save state in the top bar reads **Saved** when the canvas is saved and **Unsaved** when it is not; click it, or choose **File > Save dataflow**. After the first save, Curio saves every 30 seconds while there are unsaved changes, and asks before you leave with changes it has not saved.

<LoopVideo src="/media/dataflows/canvas.mp4" poster="/media/dataflows/canvas.webp" label="A new, empty dataflow: the tiles of the built-in node rail are pointed out one by one, and the File menu opens." :w="1280" :h="768" />

<TryIt path="/dataflow/new" label="Start a new dataflow" />

## Kinds of nodes

- **Data Loading** brings data in with Python, and can read values from the nodes connected to it. It opens on its **Data** box: drop a file or a Data Catalog dataset there, or click **Choose file**, and its code, on the **Code** tab, loads it.
- **Data Transformation** and **Python Computation** run Python on their inputs, which arrive as `input_0`, `input_1` and so on, one per input circle, and pass on what the code returns.
- **JS Computation** does the same in JavaScript.
- **Data Summary** reports a table's column types, missing values and statistics.
- **Data Pool** shows one result as a table and feeds it to the nodes after it, marking the rows selected in the views [linked](/interactions/) to it.
- **Spatial Join** pairs the rows of two inputs whose shapes meet, by the operation you pick: intersects, within, contains, touches, overlaps, crosses or nearest. It outputs one row per pair, or its second input's rows, each with a count of its pairs.
- **Data Export** downloads its input as CSV, GeoJSON or JSON, with the **Download** button in its **Widgets** tab.
- **Map Editor** adds, changes and removes the features of a map's layers, on the map (see [Scenarios](/scenarios/#edit-features-on-a-map)).
- **Vega-Lite**, **Autark** and **Simple View** draw [charts, maps, tables and images](/visualization/).
- **Note** holds a title and a short text that explain a part of the dataflow (see [Notes](#notes)).

Code runs on the Curio server, not in your browser.

## Connecting nodes

Drag from an output (on a node's right edge) to an input (on another node's left edge). Curio refuses a connection between types that do not fit, and one that would make a loop. An output can feed many nodes. A node that takes several inputs, such as Python Computation, Data Pool, Vega-Lite or Autark, shows a new empty input circle below each one you connect; in code and specs, each input is a chip or its name, `input_0` for the first circle, `input_1` for the second, and so on. The handle on top of views and Data Pools is for [interaction edges](/interactions/). To remove a connection, click it and press Delete or Backspace; deleting a node also removes its connections.

## Running a dataflow

Press the play button at the left of a node's header, or select the node and press Ctrl+Enter (Cmd+Enter on a Mac), which also works inside its editor. Upstream nodes that have not run successfully, or whose code has changed, run first. The node then reads **Done** or **Error**; a code node prints its output below its editor, and offers to install a Python library it is missing.

The **Run all nodes** button, at the bottom of the left column, runs the whole dataflow in order and turns into a stop button while it runs. When a node fails, the nodes after it do not run, and each says that the node feeding it failed; the rest of the dataflow still runs.

<LoopVideo src="/media/dataflows/build.mp4" poster="/media/dataflows/build.webp" label="A dataset dragged onto the canvas becomes a Data Loading node, which is connected to a Data Transformation node, run with the play button and saved." :w="1280" :h="768" />

## Inside a node

A node's header shows the play button, the node's title and kind, and its run status. Its other buttons show while the pointer is over the node or the node is selected. The first of them switch its tabs: **Code**, **Widgets**, **Grammar** and **Output**, as the node has them. **Provenance**, between Grammar and Output, opens the node's [past runs](/provenance/) in a drawer. Code and specs sit in a gray box, and a code node prints its output below its code. In **Widgets**, you add the node's controls, such as a slider or a date (see [Widgets and selections](/widgets/)). The switch after the tabs saves the node's table output to your Data Catalog.

Click the title to rename the node; the gear beside it opens **Node settings**, for [making a reusable node](/authoring-nodes/). After the switch come a button that explains the node, **Pin to dashboard** for the dataflow's [dashboard](/dashboards/), **Minimize**, which folds the node into a chip with its icon and title (hover a long title to read it whole) that opens again with a click, and, at the right end, **Delete node**. **View > Minimize Nodes** folds them all, and **View > Expand Nodes** opens them again. Drag a node's bottom-right corner to resize it, and double-click a node where you would drag it, such as its header, to zoom the view onto it. For viewers of a shared dataflow, nodes keep their size and have no **Delete node**.

Above the code or spec, one row lists every chip the node can use, in categories that start closed: **Inputs**, **Scenarios**, **Widgets** and **Selections**. Click a category to list its chips, then drag a chip's tag into the code or spec, or click the tag to put the chip at the cursor (see [The chips above the spec](/scenarios/#the-chips-above-the-spec)).

## Notes

A **Note** node explains a part of the dataflow: a title and a short text on one of six colors. It has no inputs or outputs, and a run skips it.

1. Drag **Note** from the palette onto the canvas. A new note opens on its form.
2. Write its **Title** and **Text**, pick its **Color**, and click **Save**.
3. To change it, click **Edit** on the note.

The text is simple markdown: `#` headings, `-` lists, `**bold**`, `*italics*`, `` `code` `` and links. Only an `https` link is a link, and it opens in a new tab. On the dashboard and on a shared dataflow, a note shows its text and cannot be edited. The [Researcher](/ai-agents/) answers questions from the web with notes: the question on a yellow one, then each answer on a green one with its sources.

## Notebook view

The **Canvas | Notebook** switch, at the right of the top bar beside **Monitor**, shows the same dataflow as a column of cells across the page, like a Jupyter notebook, and the page scrolls. Each cell is followed by the cells it feeds, the most recently connected first, before the next cell that reads from nothing: the order **File > Export as notebook** writes.

A cell grows with its code and its output, and has the header and buttons of a node on the canvas, without **Delete node** or **Minimize**. A code cell shows its output below its code; a Vega-Lite or Autark cell shows its spec above its chart or map. Connections run in the bar to the right of the cells, where each cell has its inputs as dots at the top, its interaction dot halfway down and its output at the bottom. Hover over a dot to see what feeds it; selecting a cell outlines it and darkens its connections.

Nodes and connections are added and removed on the canvas: the notebook view has no column of nodes on its left, its dots do not connect, and Delete removes neither a cell nor a connection there. In it, you edit and run a cell's code; **Run all** sits at the top right of the page. The view changes nothing in the dataflow, so **Canvas** shows it as it was laid out. The address carries the view (`?view=notebook`), so a reload, or the address copied from the browser, opens the notebook view again.

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

`curio_secret` is one of the functions Curio gives node code, listed with their arguments in [Functions node code calls](https://github.com/urban-toolkit/curio/blob/main/agents/agent.curio.builtin@1/knowledge/node-functions.md).

The key reaches the node only while it runs, and it never appears in the saved dataflow, in proposals, in the chat or in the run log. A node that names a key you have not saved fails with a message naming it. When you paste code that holds a key, a bar above the editor offers **Save as API key**, which opens the same form with the host filled in; an agent's Solve that reaches an API without a saved key offers **Add key for** the host. On a server started with `--deploy`, guest accounts cannot save a key.
