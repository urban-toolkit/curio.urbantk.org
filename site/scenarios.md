---
title: "Scenarios"
description: "Keep alternatives of a dataflow as scenarios, change their levers, and compare their outcomes in a Compare Scenarios node."
group: using
order: 45
card: { poster: /media/scenarios/compare-chart.webp, alt: "A Compare Scenarios node charting the mean sunlight of two scenarios" }
deeper:
  - { doc: docs/USAGE.md, anchor: scenarios, label: "Scenarios in the usage guide" }
  - { doc: docs/USAGE.md, anchor: the-interaction-node, label: "The Interaction node" }
  - { doc: docs/USAGE.md, anchor: comparing-scenarios, label: "Comparing scenarios" }
  - { doc: docs/examples/06-back-bay-road-sunlight.md, label: "Example 06: Back Bay road sunlight when buildings change" }
  - { doc: docs/README.md, anchor: charts-that-compare-scenarios, label: "Nine ways to chart scenario comparisons" }
---

# Scenarios

A scenario is a named selection of a dataflow's nodes, or the whole dataflow, kept to compare alternatives: the same shadow study with buildings twice as tall, say, or with two towers removed. Its boundary splits the dataflow into three parts:

- **Fixed context:** the nodes outside the scenario that it reads, through a connection or through a [Parameter node](/widgets/#share-a-value-with-a-parameter-node). The scenario takes their outputs as given. A node that two alternatives share sits outside both, as their common context.
- **Levers:** the nodes in the scenario, which is what an alternative changes: its loaders, widget values, code and specs, and the features an [Interaction node](#remove-or-change-features) removes or changes.
- **Outcomes:** the outputs of the scenario's last nodes, which is what gets compared.

A node belongs to one scenario at most.

<GuideFigure src="/media/scenarios/shadow-study.webp" alt="Example 06 on the canvas with three scenario frames" caption="Example 06 on the canvas: a shared loader and Data Pool feed three scenarios, each in its own color inside a frame. Two Compare Scenarios nodes chart their mean sunlight and take the sunlight each road loses, which an Autark map draws." :w="960" :h="400" />

## Make a scenario

1. Select its nodes: hold Shift and drag a box around them.
2. Choose **View > Save selection as scenario**, or **File > Save dataflow as scenario** for the whole dataflow.
3. To build an alternative, choose **View > Duplicate as scenario**. The selected nodes are copied below themselves with the connections between them, every connection into the selection feeds the copy too, and the selection and the copy become two scenarios.
4. Change the copy's levers: a widget value, a line of code.

Each copy remembers the node it was copied from.

## Work with scenarios

The dataflow's scenarios are in the [Scenario Catalog](/scenario-catalog/) drawer's **In project** tab: click **Scenario** in the top bar, then **In project**, which shows how many the dataflow has. Saving a selection or duplicating it as a scenario opens that tab. On top of it are **Save selection as scenario** and **Duplicate as scenario**, and each scenario's card offers:

- **Run scenario**: run its levers, and the nodes of its fixed context that have not run or have changed since;
- **Collapse** or **Expand**;
- **Add selected** or **Remove selected**: the nodes selected on the canvas before the drawer opened;
- **Delete**, which leaves its nodes on the canvas.

**View details** on a card renames, recolors and describes the scenario, and lists its fixed context, levers and outcomes. Pointing at a card marks the scenario's fixed context on the canvas.

<GuideFigure src="/media/scenarios/in-project.webp" alt="Example 06 with the Scenario Catalog drawer's In project tab open" caption="The In project tab beside example 06: a card for each scenario, with its commands. Pointing at Baseline marks the Data Pool, the fixed context it reads." :w="1490" :h="1030" />

A collapsed scenario is one box in its color that lists its fixed context and its outcomes with their latest output. Its connections are drawn to the box, and dragging the box moves it. Double-click the box to expand it in place. A collapsed scenario's nodes still run with **Run All**, and the context they share runs once.

<GuideFigure src="/media/scenarios/collapsed.webp" alt="The Baseline scenario collapsed into one box" caption="Baseline collapsed into one box: the Data Pool it reads, and its outcome, Roads by sunlight, done. The connection from the pool and those to the Compare Scenarios nodes are drawn to the box." :w="1260" :h="960" />

The nodes of a scenario's fixed context and its outcomes save their outputs to your [Data Catalog](/data-catalog/) when they run, whatever their **Save output** setting, so the [Scenario Catalog](/scenario-catalog/) can show them and other dataflows can use them. Scenarios, their colors, descriptions and collapsed state are saved with the dataflow.

## Remove or change features

The **Interaction** node, the one with the hand icon, removes features from a layer, or changes them, by hand or by a condition: two towers taken out of a city's buildings, or every building over 100 m lowered, say. In a scenario, it is a lever. It is a node of its own, apart from the [interaction edges](/interactions/) that link views.

1. Drag **Interaction** from the palette onto the canvas and connect a layer to it: a Python node's GeoDataFrame, or the layers an Autark node or a Data Pool hands on.
2. Pick the layer in **Layer**, when the input carries several, and the column that identifies a feature in **Id**, such as `osm_id` or `building_id`.
3. Double-click features on the node's map to pick them. A table lists them with their values, and **Clear pick**, or Escape, forgets them.
4. Edit the picked features: **Remove** them (or press Delete) or **Restore** them, raise or lower the column picked in **Nudge** with **▲** and **▼** (or the arrow keys), **Scale** it, or **Set value** in a column. Typing a new value into a cell of the table, then Enter, sets it for that feature.
5. Or edit every feature a condition picks: type the condition in **Where**, such as `height > 100`, and the node says how many features it picks. Choose what to do to them, remove, scale, offset, set, expr or restore, with the column and the value it needs, and press **Apply**. An expr edit writes what an expression makes of each feature, such as `levels * 3.2`.
6. Press **Update results** to run the node and every node below it with the edits.

Each edit goes into the node's log, under the map. The box before an edit switches it off: it stays in the log, and the run skips it. The × beside an edit deletes it, and **Undo** and **Redo**, or Ctrl+Z and Shift+Ctrl+Z (Cmd on a Mac), take back the last edit and make it again. These keys, Delete, the arrows and Escape act on the node while it has the focus, after a pick on its map or a click in it.

The edits apply in order. An edit by `building_id` applies to every part of a building. The output is the edited layer, with the input's other layers as they came; the input itself is never changed.

<GuideFigure src="/media/scenarios/interaction.webp" alt="An Interaction node with a map of three building parts and a log of two edits" caption="An Interaction node on three building parts, two of them building 1's. Its log holds Scale height by 0.5 where height &gt;= 50, and Remove where building_id == 1, switched off, so the run skips it." :w="560" :h="460" />

## Compare scenarios

The **Compare Scenarios** node compares scenarios' outcomes on the canvas.

1. Drag **Compare Scenarios** from the palette onto the canvas.
2. Connect each scenario's outcome to one of its input circles. Each input is labelled by its scenario.
3. Run it.

It works in one of two ways, which **Compare as** switches:

- **Chart** stacks its inputs into one table, with each scenario's name on its rows, and draws it in the scenarios' colors as bars, grouped bars, lines, points, a pie, lollipops or a table. Pick the **X** and **Y** columns, and how the values of a group are combined in **Combine**: mean, sum, median, minimum, maximum, a count, or none, which plots each row's value as it is. A table writes a scenario whose color is too light to read on white in a darker shade of that color.
- **Difference** subtracts `input_0`, the reference, from `input_1`: two rasters on one grid cell by cell, each up to 4096 by 4096 cells, or two layers or tables row by row, matched on `osm_id`, `building_id` or a column you pick in **Key**. **Change** picks the signed difference or, with **Absolute**, its size. Each row of a layer's or a table's difference says in its `change` column whether it changed, stayed the same, was removed or was added. A table's difference shows as a table, each row in the color of its change.

The node starts in Difference when its two inputs are rasters or layers, and in Chart otherwise. What it makes is its output: other nodes can read it, and the node can be pinned to the [dashboard](/dashboards/).

To draw a raster's or a layer's difference on a map, connect the node to an [Autark node](/visualization/#autark-maps) after it. The Autark spec picks what the map colors by, its color scheme and its legend's `title`. A signed difference of rasters reads best on a diverging scheme centered on 0, and an absolute one on a sequential scheme:

```json
{ "map": { "layerRefs": [{ "dataRef": "input_0", "getFnv": "band_1", "colorMapInterpolator": "interpolateRdBu", "colorMapCenter": 0, "title": "Shadow change (minutes)" }] } }
```

To map each scenario's outcome side by side, give their maps the same `colorMapRange`, `[low, high]`, and a value has one color on all of them.

<GuideFigure src="/media/scenarios/compare-chart.webp" alt="A Compare Scenarios node in Chart, with two lollipops" caption="Compare Scenarios in Chart: the mean sunlight of Baseline and Twice as tall as lollipops. Above it, the node warns that one scenario reads fixed context the other does not." :w="560" :h="420" />

<GuideFigure src="/media/scenarios/compare-difference.webp" alt="A Compare Scenarios node in Difference" caption="Compare Scenarios in Difference, with Change set to Signed: the node holds two rasters' difference and says to draw it with an Autark node after it." :w="560" :h="124" />

<GuideFigure src="/media/scenarios/compare-difference-map.webp" alt="An Autark map of the difference between two rasters" caption="The Autark node after it draws that difference, Twice as tall minus Baseline, on a red to blue scheme centered on 0, under the title its spec gives." :w="526" :h="350" />

The **What differs** tab lists the levers that differ between the scenarios: the widget values and code lines that changed, and each scenario's Interaction edits, an edit switched off marked off. A node and its copies count as one lever. Above the tabs, the node warns when the scenarios read different fixed context, when an input comes from a node in no scenario, and when two inputs come from one scenario.

## In the examples

Example 06, "Back Bay road sunlight when buildings change", has three scenarios over one loader: Baseline, Twice as tall (its `height_factor` widget set to 2), and Two towers removed (an Interaction node takes out two towers). Its two Compare Scenarios nodes chart their mean road sunlight and take the sunlight each road loses, which an Autark map draws in red, yellow and blue from -360 to 360 minutes. The [SCOUT examples](/scout/) compare scenarios of shadows, park shade, flooding and routes.

"Nine ways to chart scenario comparisons", under **Tests** on the projects page, charts the scenarios of nine example tables from the Data Catalog, each a different way. Compare Scenarios draws two of them itself, as grouped bars and as a table. A Vega-Lite node after it draws each of the others: lines with a band, curves by state, bars with error bars, a strip of ticks per scenario, stacked bars with totals, donuts and a matrix of weights.

<GuideFigure src="/media/scenarios/charts-carbon.webp" alt="Stacked bars of two building frames' carbon by life-cycle stage, with their totals" caption="From Nine ways to chart scenario comparisons: a Vega-Lite node after a Compare Scenarios node stacks the carbon of a concrete frame and a timber frame by life-cycle stage, with each total on top." :w="680" :h="440" />
