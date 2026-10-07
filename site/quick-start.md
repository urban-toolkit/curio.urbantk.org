---
title: "Quick start"
description: "Build a first dataflow in the hosted instance: make a small table and chart it with Vega-Lite."
group: getting-started
order: 20
card: { poster: /media/quick-start/quickstart-chart.webp, alt: "A Data Loading node feeding a Vega-Lite bar chart" }
app: /
deeper:
  - { doc: docs/QUICK-START.md, label: "Quick start tutorial" }
  - { doc: docs/USAGE.md, anchor: vega-lite-node, label: "The Vega-Lite node" }
  - { doc: docs/DATA-CATALOG.md, label: "Data Catalog guide" }
---

# Quick start

This page builds a first dataflow in the hosted instance: a small table made in a **Data Loading** node, drawn as a bar chart by a **Vega-Lite** node. It takes a few minutes and needs nothing installed. If you run Curio on your own computer instead (see [Install](/install/)), skip the sign-in step; the rest is the same.

## Sign in

Open the hosted instance and choose **Create account** on the sign-in page. A name, a username and a password are enough; the email is optional. A new account opens on the **Projects** page, which already holds its own copies of the example dataflows for you to open and change.

<TryIt path="/auth/signup" label="Create an account" />

**Continue as Guest** lets you look around without an account, but a guest cannot save dataflows, and anything a guest adds, such as an imported dataset, is shared with every other guest.

<LoopVideo src="/media/quick-start/signup.mp4" poster="/media/quick-start/signup.webp" caption="The Create an account form is filled in with a name, a username and a password, and the new account lands on its Projects page." :w="1280" :h="768" />

## Create a dataflow

On the **Projects** page, click **+ New Dataflow**. The canvas opens with the built-in nodes in the rail on the left (hover a tile to see its name) and the top bar along the top: the **File**, **View** and **Share** menus, **Provenance**, the save state, and a button for each catalog. Click the dataflow's name at the top to rename it.

<LoopVideo src="/media/dataflows/canvas.mp4" poster="/media/dataflows/canvas.webp" caption="Clicking + New Dataflow opens an empty canvas, and the tiles of the built-in node rail and the menus along the top are pointed out one by one." :w="1280" :h="768" />

## Load a small dataset

Drag the **Data Loading** tile onto the canvas. The node opens on its code editor: paste this Python, which builds a small table and returns it to the next node.

```python
import pandas as pd

d = {'a': ["A", "B", "C", "D", "E", "F", "G", "H", "I"], 'b': [28, 55, 43, 91, 81, 53, 19, 87, 52]}
df = pd.DataFrame(data=d)

return df
```

Click the orange play button at the bottom left of the node, or press Ctrl+Enter (Cmd+Enter on a Mac) while you edit it. The node shows **Done** when the run succeeds and **Error** when it fails.

<GuideFigure src="/media/quick-start/data-loading.webp" alt="A Data Loading node with the table code" caption="A Data Loading node holds the table code, with Done shown next to its play button." :w="1280" :h="768" />

## Chart it with Vega-Lite

Drag the **Vega-Lite** tile onto the canvas, then drag from the handle on the right edge of the Data Loading node to the handle on the left edge of the Vega-Lite node to connect them. The Vega-Lite node opens on its grammar editor. It may already hold a starter chart picked from the table's columns; replace it with this spec:

```json
{
  "mark": "bar",
  "encoding": {
    "x": {"field": "a", "type": "nominal", "axis": {"labelAngle": 0}},
    "y": {"field": "b", "type": "quantitative", "stack": null}
  }
}
```

Click the Vega-Lite node's play button, and the chart appears in the node with one bar per letter. Playing a node first runs any node upstream of it that has not run yet or whose code changed, and **Run all nodes**, at the bottom of the rail, runs the whole dataflow.

<LoopVideo src="/media/quick-start/quickstart-chart.mp4" poster="/media/quick-start/quickstart-chart.webp" caption="The Data Loading node is connected to a new Vega-Lite node, the bar chart spec is pasted into its grammar editor, and pressing play draws one bar per letter." :w="1280" :h="768" />

## Save it and bring your own data

Save with **File > Save dataflow**, or click the save state next to the **Share** menu, which reads **Saved** once everything on the canvas is saved. After the first save, Curio also saves your changes automatically as you work. **File > Save dataflow as** downloads the dataflow as a file, which **File > Load dataflow** opens as a new dataflow.

To chart a file of your own, click **Data Catalog** in the top bar, click **Import dataset** at the bottom of the drawer and pick a CSV, GeoJSON or other supported file, then click **Add to project** on its card and confirm. Drag the dataset from the rail's **Data Catalog** list onto the canvas, and Curio creates a Data Loading node with the code that reads it. [Data Catalog](/data-catalog/) covers datasets in depth, and [Charts and maps](/visualization/) covers what Vega-Lite and Autark can draw.

<LoopVideo src="/media/data-catalog/datacatalog.mp4" poster="/media/data-catalog/datacatalog.webp" caption="Browse Data Catalog + opens the Data Catalog drawer, Add to project puts a dataset into the dataflow, and the dataset then appears in the rail&#x27;s Data Catalog list." :w="1280" :h="768" />
