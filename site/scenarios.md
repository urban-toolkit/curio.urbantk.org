---
title: "Scenarios"
description: "Keep alternatives of a dataflow as scenarios, change their levers, and compare their outcomes in charts and maps drawn in the scenarios' colors."
group: using
order: 45
card: { poster: /media/scenarios/shadow-study.webp, alt: "Example 06 on the canvas with three scenario frames" }
deeper:
  - { doc: docs/USAGE.md, anchor: scenarios, label: "Scenarios in the usage guide" }
  - { doc: docs/USAGE.md, anchor: the-interaction-node, label: "The Interaction node" }
  - { doc: docs/USAGE.md, anchor: comparing-scenarios, label: "Comparing scenarios" }
  - { doc: docs/USAGE.md, anchor: every-input-in-one-dataset, label: "Every input in one dataset" }
  - { doc: docs/USAGE.md, anchor: scenario-colors-and-order, label: "Scenario colors and order" }
  - { doc: docs/examples/06-back-bay-road-sunlight.md, label: "Example 06: Back Bay road sunlight when buildings change" }
  - { doc: docs/README.md, anchor: charts-that-compare-scenarios, label: "Nine ways to chart scenario comparisons" }
  - { doc: packages/curio.scout@1/README.md, label: "The Scout package" }
---

# Scenarios

A scenario is a named selection of a dataflow's nodes, or the whole dataflow, kept to compare alternatives: the same shadow study with buildings twice as tall, say, or with two towers removed. Its boundary splits the dataflow into three parts:

- **Fixed context:** the nodes outside the scenario that it reads, through a connection or through a [Parameter node](/widgets/#share-a-value-with-a-parameter-node). The scenario takes their outputs as given. A node that two alternatives share sits outside both, as their common context.
- **Levers:** the nodes in the scenario, which is what an alternative changes: its loaders, widget values, code and specs, and the features an [Interaction node](#remove-or-change-features) removes or changes.
- **Outcomes:** the outputs of the scenario's last nodes, which is what gets compared.

A node belongs to one scenario at most.

<GuideFigure src="/media/scenarios/shadow-study.webp" alt="Example 06 on the canvas with three scenario frames" caption="Example 06 on the canvas: a shared loader and Data Pool feed three scenarios, each in its own color inside a frame. Scout's Bars charts the mean sunlight of their roads, and a Python node takes the sunlight each road loses, which an Autark map draws." :w="670" :h="520" />

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

<GuideFigure src="/media/scenarios/in-project.webp" alt="The Scenario Catalog drawer's In project tab with one scenario's card" caption="The In project tab: Save selection as scenario and Duplicate as scenario on top, then a card for each of the dataflow's scenarios, here Twice as tall, with its commands." :w="519" :h="520" />

A collapsed scenario is one box in its color that lists its fixed context and its outcomes with their latest output. Its connections are drawn to the box, and dragging the box moves it. Double-click the box to expand it in place. A collapsed scenario's nodes still run with **Run All**, and the context they share runs once.

<GuideFigure src="/media/scenarios/collapsed.webp" alt="The Baseline scenario collapsed into one box" caption="Baseline collapsed into one box, with the Data Pool it reads and its outcome Roads by sunlight, done. The connections into and out of the scenario are drawn to the box." :w="1260" :h="960" />

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

To compare scenarios, connect each scenario's outcome to an input circle of its own on a node outside the scenario boxes: each connection takes the next circle. That node charts them, maps them or takes their difference.

A [Vega-Lite node](/visualization/#vega-lite-charts) whose spec names its dataset with the chip `[!! inputs !!]` reads every input's rows in one table, in circle order. Each row has three more columns:

- `scenario_name`, the name of the scenario box its input comes from, or the name of the node that feeds it when that node is in no box;
- `scenario`, that box's id, empty for a node in no box;
- `__input__`, the circle its input came in on.

The scenario chips write the boxes' names and colors into the spec:

| Chip | Writes | Goes in |
|---|---|---|
| `[!! scenario colors !!]` | a scale: the boxes' names as its `domain`, their colors as its `range` | the `scale` of a color, fill or stroke by `scenario_name` |
| `[!! scenario text_colors !!]` | the same scale, each color in a shade that reads on white | the `scale` of a text mark's color |
| `[!! scenario order !!]` | the boxes' names | the `sort` of an axis, an offset or a facet by `scenario_name` |
| `[!! scenario input_1 !!]` | the color input_1 has in that scale | a mark's color, or a map layer's |

```json
{
  "data": {"name": "[!! inputs !!]"},
  "mark": "bar",
  "encoding": {
    "x": {"field": "scenario_name", "type": "nominal", "sort": [!! scenario order !!]},
    "y": {"field": "sunlight", "type": "quantitative", "aggregate": "mean"},
    "color": {"field": "scenario_name", "type": "nominal", "scale": [!! scenario colors !!]}
  }
}
```

The boxes come in the order the dataflow lists them. An input from no box comes after them, named by its node, in a gray of its own. When no input comes from a box, `[!! scenario colors !!]` and `[!! scenario text_colors !!]` write the names alone, and the chart's own palette colors them. Renaming or recoloring a box, or drawing one around a node that feeds the chart, draws the chart again with no run. A spec without the chips draws in Vega-Lite's own colors. The [Scout package's charts](/scout/#charts-that-compare-scenarios) are written this way, ready to connect.

## The chips above the spec

Above a node's code or spec, one row lists every chip the node can use, by category, each with its count: **Inputs**, **Scenarios**, **Widgets**, **Selections** and **Shared**. A category shows only when it has chips. The categories start closed: click one to list its chips under the row, and click it again to close it. Several can be open, and a category stays open while the dataflow is open. Drag a chip's tag into the code or spec, or click it to put the chip at the cursor.

- **Inputs:** a tag for each input, `input_0`, `input_1` and so on, whose arrow lists its columns once the node feeding it has run. In a Vega-Lite spec with an input, also the **inputs** tag, whose arrow lists the fields of the stacked rows, `scenario_name`, `scenario` and `__input__` first.
- **Scenarios:** on a node with an input from a scenario box. In a Vega-Lite spec, first the boxes' swatches with their names, the tag of `[!! scenario colors !!]`, then **text colors** and **order**. In a Vega-Lite or Autark spec, a tag for each input, such as **input_1 ■ Twice as tall**, in the color its chip writes.
- **Widgets**, **Selections** and **Shared:** the node's [widgets](/widgets/), its [selection tags](/widgets/#hand-a-node-what-you-selected) and the Parameter nodes' values.

A node with no input from a box has no **Scenarios**, and the hover of a scenario chip in its spec says what the chip writes there. On a node with no input, `[!! inputs !!]` is red until you connect one. `[!! inputs !!]` and the scenario chips are for specs: Python and JavaScript code takes neither.

<GuideFigure src="/media/scenarios/chart-header.webp" alt="A Scout Bars chart on its Grammar tab, with the Scenarios category open above its spec" caption="Scout's Bars chart of the mean accumulated shadow in Chicago Loop shadow with towers removed or edited, on its Grammar tab. Its row reads Inputs 3, Scenarios 5, Widgets 3 and Shared 1, with Scenarios open: the two boxes' swatches and names, text colors and order, then each input in its box's color. The spec names its dataset with the inputs chip." :w="526" :h="350" />

## Maps and differences

An [Autark map](/visualization/#autark-maps) draws a layer in the color of the scenario box its input comes from when that input's scenario chip is the layer's `color`. Its tag under **Scenarios** drags it in, in quotes:

```json
{ "dataRef": "[!! input_1 !!]", "width": 80, "title": "Fastest route", "color": "[!! scenario input_1 !!]" }
```

A recolored box gives the layer its new color at the map's next run. To map each scenario's outcome side by side, give their maps the same `colorMapRange`, `[low, high]`, and a value has one color on all of them.

To take a difference:

- **Of two rasters**, a [Raster Calculator](/scout/#building-rasters-and-shadows) subtracts them cell by cell. `raster_calculate("subtract", [input_1, input_0], output_file=curio_output_file)` gives input_1 minus input_0, and with `absolute=True` the size of that difference, 0 where nothing changed. The two rasters must lie on one grid.
- **Of two tables or layers**, a Python node joins the two inputs' rows on a column both have, such as `osm_id` or `building_id`, and subtracts their numbers.

To draw a difference on a map, connect the node to an Autark node after it. Its spec picks what the map colors by, its color scheme and its legend's `title`. A signed difference reads best on a diverging scheme centered on 0, and an absolute one on a sequential scheme:

```json
{ "map": { "layerRefs": [{ "dataRef": "[!! input_0 !!]", "getFnv": "band_1", "colorMapInterpolator": "interpolateRdBu", "colorMapCenter": 0, "title": "Shadow change (minutes)" }] } }
```

<GuideFigure src="/media/scenarios/sunlight-change.webp" alt="An Autark map of Back Bay's roads colored by the sunlight each one loses" caption="Example 06's Roads by sunlight change: the sunlight each road loses when the buildings get twice as tall, which a Python node takes road by road, in red, yellow and blue from -360 to 360 minutes." :w="588" :h="496" />

## In the examples

Example 06, "Back Bay road sunlight when buildings change", has three scenarios over one loader: Baseline, Twice as tall (its `height_factor` widget set to 2), and Two towers removed (an Interaction node takes out two towers). Each ends in a Roads node that takes its roads with their sunlight. Scout's **Bars** charts each scenario's mean road sunlight from the three Roads nodes, and a Python node takes the sunlight each road loses in Twice as tall, which an Autark map draws in red, yellow and blue from -360 to 360 minutes. The [SCOUT examples](/scout/) compare scenarios of shadows, park shade, flooding and routes.

"Nine ways to chart scenario comparisons", under **Tests** on the projects page, charts the scenarios of nine example tables from the Data Catalog, each a different way. For each table, a Data Transformation node per scenario keeps that scenario's rows, and a chart of the [Scout package](/scout/#charts-that-compare-scenarios) takes each scenario's node on an input of its own, with its columns set in its **Widgets** tab: **Lines with a band**, **Curves by group**, **Bars with error bars**, **Ensemble strips**, **Grouped bars**, **Stacked bars with totals**, **Donuts**, **Weighted matrix** and **Table**.

<GuideFigure src="/media/scenarios/charts-carbon.webp" alt="Stacked bars of two building frames' carbon by life-cycle stage, with their totals" caption="From Nine ways to chart scenario comparisons: Scout's Stacked bars with totals stacks the carbon of a concrete frame and a timber frame by life-cycle stage, with each total on top and each frame's name in its scenario's color." :w="680" :h="440" />
