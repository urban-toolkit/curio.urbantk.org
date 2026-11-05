---
title: "Scenarios"
description: "Keep alternatives of a dataflow as the scenarios of a scenario set, and compare them on shared outcomes: charts and maps drawn in the scenarios' colors."
group: using
order: 45
card: { poster: /media/scenarios/shadow-study.webp, alt: "Example 06 on the canvas with three scenario frames" }
deeper:
  - { doc: docs/USAGE.md, anchor: scenarios, label: "Scenarios in the usage guide" }
  - { doc: docs/SCENARIO-CATALOG.md, anchor: defining-a-scenario, label: "Defining a scenario" }
  - { doc: docs/USAGE.md, anchor: the-map-editor-node, label: "The Map Editor node" }
  - { doc: docs/USAGE.md, anchor: comparing-scenarios, label: "Comparing scenarios" }
  - { doc: docs/USAGE.md, anchor: several-inputs, label: "Several inputs and their chips" }
  - { doc: docs/USAGE.md, anchor: every-input-in-one-dataset, label: "Every input in one dataset" }
  - { doc: docs/USAGE.md, anchor: scenario-colors-and-order, label: "Scenario colors and order" }
  - { doc: docs/examples/06-back-bay-road-sunlight.md, label: "Example 06: Back Bay road sunlight when buildings change" }
  - { doc: docs/README.md, anchor: charts-that-compare-scenarios, label: "Nine ways to chart scenario comparisons" }
  - { doc: packages/curio.vega-lite@1/README.md, label: "The Vega-Lite package's charts" }
---

# Scenarios

A scenario is a named selection of a dataflow's nodes, kept to compare alternatives: the same shadow study with buildings twice as tall, say, or with two towers removed. It splits the dataflow into three parts:

- **Scenario-specific nodes:** the nodes unique to it, in its box, which is what an alternative changes: its loaders, widget values, code and specs, and the features a [Map Editor node](#edit-features-on-a-map) adds, changes or removes.
- **Shared context:** every node upstream of it, outside every box, that it uses. The scenario takes their outputs as given.
- **Shared outcomes:** every node downstream of it, outside every box, that it feeds: the maps, charts and tables the alternatives are compared on.

Every scenario belongs to one **scenario set**: the scenarios that answer one question, compared on the same shared context and shared outcomes. Scenarios of different sets never mix. A node of the shared context or the shared outcomes can serve some of the set's scenarios only.

A node belongs to one scenario at most.

<GuideFigure src="/media/scenarios/shadow-study.webp" alt="Example 06 on the canvas with three scenario frames" caption="Example 06 on the canvas: a shared loader and Data Pool feed three scenarios, each in its own color inside a frame. The Vega-Lite package's Bars charts the mean sunlight of their roads, and a Python node takes the sunlight each road loses, which an Autark map draws." :w="670" :h="520" />

## Make a scenario

1. Choose **View > Define scenario**. It opens in a drawer at the right of the canvas, and the canvas's nodes stay selectable while it is open.
2. **Scenario-specific nodes:** select the scenario's nodes on the canvas (click one, or hold Shift and drag a box around several) and click **+ Add selected node**; **×** takes one out. Nodes selected before the drawer opened are listed already.
3. **Next: shared context & outcomes** lists the shared context and the shared outcomes Curio finds by following the connections from those nodes, and the canvas marks them. Confirm them, take a node out with **×**, or select one on the canvas and click **+ Add selected node**. When the set already has scenarios, each list marks its nodes **Already in the set** or **New to the set**.
4. **Next: name & set** asks for the scenario's name, its color and its set: name a new scenario set, or pick one of the dataflow's. No two scenarios of a set share a name. **Save scenario** saves it; nothing is saved before.

To build an alternative, click **Duplicate scenario** on the scenario's card (see [Work with scenarios](#work-with-scenarios)). Its nodes are copied below themselves with the connections between them, and every connection into them feeds the copy too. The copy is a scenario of the same set, with the next color and the same shared context, and Define scenario opens on it at **Name & set**: rename it, recolor it, or put it in another set. Nothing reads the copy yet, so it has no shared outcomes: connect its nodes to the comparison, then add the comparison with **Edit scenario**.

Then change the copy's nodes: a widget value, a line of code. Each copy remembers the node it was copied from.

## Work with scenarios

The dataflow's scenarios are in the [Scenario Catalog](/scenario-catalog/) drawer's **In project** tab: click **Scenario** in the top bar, then **In project**, which shows how many the dataflow has. It lists them in a panel for each scenario set, headed by the set's name and how many scenarios it holds. The pencil beside the name renames the set, and no two sets of a dataflow share a name. On top of the tab is **Define scenario**, and each scenario's card offers:

- **Run scenario**: run its nodes, and of the nodes feeding it only those that have not run or have changed since;
- **Edit scenario**: Define scenario filled in with the scenario's nodes, shared context and outcomes, name, color and set, whose **Save** changes it in place;
- **Duplicate scenario**: a copy of it, as above;
- **Delete**, which asks first and leaves its nodes on the canvas.

**View details** on a card renames, recolors and describes the scenario, and lists its shared context, its scenario-specific nodes and its shared outcomes. Pointing at a card marks the scenario's context and outcomes on the canvas.

<GuideFigure src="/media/scenarios/in-project.webp" alt="The Scenario Catalog drawer's In project tab with one scenario's card" caption="The In project tab: a card for each of the dataflow's scenarios, here Twice as tall, with its commands." :w="519" :h="520" />

On the canvas, each scenario set is outlined under its name, **Scenario set:** and the set's name. A scenario's nodes wear its color inside a frame, with its name and a **Collapse** button above. The set's shared context and shared outcomes are framed in gray, each under a **Shared context** or **Shared outcomes** pill with a **Collapse** button. Under each of their nodes is a row of circles, one per scenario of the set, filled where that scenario uses the node; point at the circles to read which scenarios do.

A collapsed scenario is one box tinted in its color, with a card for each of its nodes: the node's kind, its title and its latest output. Its connections are drawn to the cards they enter and leave, and dragging the box moves it. A collapsed shared context or shared outcomes is one gray box with a card for each node and the set's circles on it. Double-click a box to expand it in place. A collapsed scenario's nodes still run with **Run all nodes**, and the context they share runs once.

<GuideFigure src="/media/scenarios/collapsed.webp" alt="The Baseline scenario collapsed into one box" caption="Baseline collapsed into one box in its color. The connections into and out of the scenario are drawn to the box." :w="1260" :h="960" />

When they run, the shared context nodes that feed a scenario, its own last nodes and its set's shared outcomes save their outputs to your [Data Catalog](/data-catalog/), whatever their **Save output** setting, so the [Scenario Catalog](/scenario-catalog/) can show them and other dataflows can use them. Scenarios and their sets are saved with the dataflow, with their colors, descriptions, shared context and outcomes, and what is collapsed.

## Edit features on a map

The **Map Editor** node edits a map's layers on the map: two towers taken out of a city's buildings, every building over 100 m lowered, a road reshaped or a park drawn, say. In a scenario, it is one of the scenario-specific nodes: its edits are what that scenario changes.

1. Connect the nodes that load your layers to **Map Editor**, and Map Editor to an [Autark map](/visualization/#autark-maps).
2. Link the two with an [interaction edge](/interactions/), from the dot on top of Map Editor to the dot on top of the map. A feature picked on the map is then picked in Map Editor, and the features Map Editor picks light up on the map.

<GuideFigure src="/media/scenarios/map-edits-pick.webp" alt="An Autark buildings map in which both parts of the picked building are lit in blue, under the tip Click an area to pick it, and shift-click to add one" caption="A buildings map linked to Map Editor: the building picked with a click lights up, both of its parts, in the map's own highlight." :w="515" :h="343" />

3. Pick a layer in the node, then an action:
   - **Add** draws a point, a line or an area on the map, then asks for its values.
   - **Edit** changes a feature's values or its shape, one value of several features at once, or the features a rule such as `height > 100` matches, with a value or an expression such as `levels * 3.2`.
   - **Remove** takes out the features you click, or the features a rule matches.
   - **Add a property** adds a column to every feature of the layer.
4. Pick features on the map with a click; shift-click adds more, and Escape forgets them.
5. The map shows each edit at once. **Commit edits** runs the nodes below with them.

Each edit is an entry in the node's list and in its [Provenance](/provenance/) drawer. The box before an entry switches it off: it stays in the list, and the run skips it. The × beside it deletes it, and **Undo** and **Redo**, or Ctrl+Z and Shift+Ctrl+Z (Cmd on a Mac), move between the entries. [Agents](/ai-agents/#what-agents-work-with) read these edits, and the edits an agent makes show as entries named after it.

Edits find features by a column whose values differ in every feature, such as `osm_id` or `building_id`, and an edit by `building_id` changes every part of a building. The input itself is never changed.

On a building of several parts, the map's tools change one part at a time, and the form in **Edit** is for all of them: a property its parts differ in is empty, with their values listed under it, and a value typed there goes to every part. Its **Parts** menu picks one part, and the form then shows and changes that part alone. A change on the map that would make a shape's outline cross itself, or its parts overlap, is refused: the shape goes back as it was, and the map's tip says why. An edit in the node's code that would do the same is skipped: the map keeps the shape as it was, and the run's output says why.

<GuideFigure src="/media/scenarios/map-edits.webp" alt="A Map Editor node with its layer's actions and a list of one edit" caption="A Map Editor node linked to its buildings map: the actions for its Buildings layer, and a list of one edit, Set height to 99 on building_id 1, which the two nodes below get with Commit edits." :w="560" :h="460" />

## Compare scenarios

To compare scenarios, connect the node of each scenario's box that the comparison reads to an input circle of its own on a node outside the boxes: each connection takes the next circle. That node, one of their set's shared outcomes, charts them, maps them or takes their difference.

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

The boxes come in the order the dataflow lists them. An input from no box comes after them, named by its node, in a gray of its own. When no input comes from a box, `[!! scenario colors !!]` and `[!! scenario text_colors !!]` write the names alone, and the chart's own palette colors them. Renaming or recoloring a box, or drawing one around a node that feeds the chart, draws the chart again with no run. A spec without the chips draws in Vega-Lite's own colors. The [Vega-Lite package's charts](/scout/#charts-that-compare-scenarios) are written this way, ready to connect.

## The chips above the spec

Above a node's code or spec, one row lists every chip the node can use, by category, each with its count: **Inputs**, **Scenarios**, **Widgets** and **Selections**. A category shows only when it has chips. The categories start closed, each with a chevron pointing down. Click one to list its chips under the row, and its chevron points up; click it again, or open another category, to close it. A category stays open on that node while the dataflow is open. On the canvas, the row and its open chips take at most half of the node's editor, and the chips scroll past that. Drag a chip's tag into the code or spec, or click it to put the chip at the cursor.

- **Inputs:** a line for each input, `input_0`, `input_1` and so on, in circle order. In a Vega-Lite spec, the line of **inputs**, the stacked rows, comes last.
- **Scenarios:** on a node with an input from a scenario box. In a Vega-Lite spec, first the boxes' swatches with their names, the tag of `[!! scenario colors !!]`, then **text colors** and **order**. In a Vega-Lite or Autark spec, a tag for each input, such as **input_1 ■ Twice as tall**, in the color its chip writes.
- **Widgets** and **Selections:** the node's [widgets](/widgets/) and its [selection tags](/widgets/#hand-a-node-what-you-selected).

A line of **Inputs** holds a square button, the input's tag, and where the input comes from: its scenario box, or else the name of the node that feeds it. Once that node has run, the line also says what the input holds, such as **from Existing: 5 columns**, **from Autark: 5 layers** or **from Python Computation: 2 values, a tuple**. The line of **inputs** names the inputs it stacks and, once they have run, how many fields their rows carry, such as **input_0 and input_1, stacked: 8 fields**.

Click a line's square button to open its list, indented under the line, and click it again to close it. An input's list holds its columns, and the list of **inputs** the fields of the stacked rows, `scenario_name`, `scenario` and `__input__` first. An input with layers, such as an Autark node's tables, lists a line for each layer: the layer's tag, then its columns, or **no columns**. Drag a column's tag where a column name goes. Several lists can be open, and each stays open on its node while the dataflow is open.

<GuideFigure src="/media/scenarios/input-lines.webp" alt="A Vega-Lite chart's Inputs open, with input_0's columns listed under its line" caption="A Vega-Lite chart fed from a Data Pool, with Inputs open. The line of input_0 reads from Data Pool: 3 columns, and its list, open under it, holds geometry, accessibility and neighborhood_name. The line of inputs, input_0, stacked: 5 fields, comes last, closed." :w="526" :h="350" />

Hover over a tag, or over its chip in the code or spec, to preview what it holds: an input's source, size and first rows, a column's type, first values and range or count of distinct values, a widget's value, a selection's ids and selected rows, or the scenario boxes' colors.

<GuideFigure src="/media/scenarios/chip-preview.webp" alt="A Vega-Lite chart's input_0 tag with its preview: source, size, column types and first rows" caption="A Vega-Lite chart's input_0 tag, hovered: from Data Pool, 79 rows by 3 columns of a GeoDataFrame, and its first 5 rows under each column's name and type." :w="343" :h="296" />

A node with no input from a box has no **Scenarios**, and the hover of a scenario chip in its spec says what the chip writes there. On a node with no input, `[!! inputs !!]` is red until you connect one. `[!! inputs !!]` and the scenario chips are for specs: Python and JavaScript code takes neither.

<GuideFigure src="/media/scenarios/chart-header.webp" alt="A Bars chart of the Vega-Lite package on its Grammar tab, with the Scenarios category open above its spec" caption="The Vega-Lite package's Bars chart of the mean accumulated shadow in Chicago Loop shadow with towers removed or edited, on its Grammar tab. Its row reads Inputs 3, Scenarios 5 and Widgets 3, with Scenarios open: the two boxes' swatches and names, text colors and order, then each input in its box's color. The spec names its dataset with the inputs chip." :w="526" :h="350" />

## Maps and differences

An [Autark map](/visualization/#autark-maps) draws a layer in the color of the scenario box its input comes from when that input's scenario chip is the layer's `color`. Its tag under **Scenarios** drags it in, in quotes:

```json
{ "dataRef": "[!! input_1 !!]", "width": 80, "title": "Fastest route", "color": "[!! scenario input_1 !!]" }
```

A recolored box gives the layer its new color at the map's next run. To map each scenario's result side by side, give their maps the same `colorMapRange`, `[low, high]`, and a value has one color on all of them.

To take a difference:

- **Of two rasters**, a [Raster Calculator](/scout/#building-rasters-and-shadows) subtracts them cell by cell. `raster_calculate("subtract", [input_1, input_0], output_file=curio_output_file)` gives input_1 minus input_0, and with `absolute=True` the size of that difference, 0 where nothing changed. The two rasters must lie on one grid.
- **Of two tables or layers**, a Python node joins the two inputs' rows on a column both have, such as `osm_id` or `building_id`, and subtracts their numbers.

To draw a difference on a map, connect the node to an Autark node after it. Its spec picks what the map colors by, its color scheme and its legend's `title`. A signed difference reads best on a diverging scheme centered on 0, and an absolute one on a sequential scheme:

```json
{ "map": { "layerRefs": [{ "dataRef": "[!! input_0 !!]", "getFnv": "band_1", "colorMapInterpolator": "interpolateRdBu", "colorMapCenter": 0, "title": "Shadow change (minutes)" }] } }
```

<GuideFigure src="/media/scenarios/sunlight-change.webp" alt="An Autark map of Back Bay's roads colored by the sunlight each one loses" caption="Example 06's Roads by sunlight change: the sunlight each road loses when the buildings get twice as tall, which a Python node takes road by road, in red, yellow and blue from -360 to 360 minutes." :w="588" :h="496" />

## In the examples

Example 06, "Back Bay road sunlight when buildings change", has three scenarios in one set, over one loader and its Data Pool, their shared context: Baseline, Twice as tall (its `height_factor` widget set to 2), and Two towers removed (a Map Editor node takes out two towers, on a buildings map it feeds). Each ends in a Roads node that takes its roads with their sunlight. The set's shared outcomes compare them: the Vega-Lite package's **Bars** charts each scenario's mean road sunlight from the three Roads nodes, and a Python node takes the sunlight each road loses in Twice as tall, which an Autark map draws in red, yellow and blue from -360 to 360 minutes. The [SCOUT examples](/scout/) compare scenarios of shadows, park shade, flooding and routes.

"Nine ways to chart scenario comparisons", under **Tests** on the projects page, charts the scenarios of nine example tables from the Data Catalog, each a different way. For each table, a Python Computation node per scenario keeps that scenario's rows, and a chart of the [Vega-Lite package](/scout/#charts-that-compare-scenarios) takes each scenario's node on an input of its own, with its columns set in its **Widgets** tab: **Lines with a band**, **Curves by group**, **Bars with error bars**, **Ensemble strips**, **Grouped bars**, **Stacked bars with totals**, **Donuts**, **Weighted matrix** and **Table**.

<GuideFigure src="/media/scenarios/charts-carbon.webp" alt="Stacked bars of two building frames' carbon by life-cycle stage, with their totals" caption="From Nine ways to chart scenario comparisons: the Vega-Lite package's Stacked bars with totals stacks the carbon of a concrete frame and a timber frame by life-cycle stage, with each total on top and each frame's name in its scenario's color." :w="680" :h="440" />
