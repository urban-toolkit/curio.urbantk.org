---
title: "Widgets and parameters"
description: "Set the values a node's code reads in a form, share one value across nodes with a Parameter node, and hand a node what you selected in a view."
group: using
order: 15
card: { poster: /media/widgets/widgets-tab.webp, alt: "A node's Widgets tab with a slider, checkboxes, radio buttons, a date and a location" }
deeper:
  - { doc: docs/USAGE.md, anchor: widgets, label: "Widgets in the usage guide" }
  - { doc: docs/USAGE.md, anchor: shared-values-the-parameter-node, label: "The Parameter node" }
  - { doc: docs/USAGE.md, anchor: selection-tags, label: "Selection tags" }
  - { doc: docs/AUTHORING-NODES.md, anchor: widgets-in-a-template, label: "Widgets in a node template" }
---

# Widgets and parameters

A widget is a value a node's code reads that you set in a form instead of in the code: a threshold, a season, a date, a place. Python, Vega-Lite and Autark nodes have widgets. A **Parameter** node holds one such value for every node of the dataflow, and a selection tag hands a node the rows you selected in a chart or a map.

## Add a widget

1. Open the node's **Widgets** tab (the toolbox icon in its header) and click **Add widget**.
2. Give it a name (letters, digits and underscores), a type, a label and a default. A choice, a checkbox group or a multi-select also takes its choices, and a number or a slider takes a minimum, a maximum, a step and units.
3. Drag the widget's tag from the strip above the code into the code, or click the tag to put it at the cursor. It shows as a chip; point at the chip to see the value it stands for.
4. Set the value in the **Widgets** tab and run the node.

<GuideFigure src="/media/widgets/add-widget.webp" alt="The Add widget form of a Python node" caption="The Add widget form for a slider named rain: its label, minimum, maximum, step, units and default." :w="526" :h="350" />

A widget is a number, a slider, a text, a choice (a dropdown or radio buttons), a checkbox, a checkbox group, a multi-select, a date and time, a location (a latitude and a longitude, or a place search), a list of numbers or of texts, a range, or a text file.

<GuideFigure src="/media/widgets/widgets-tab.webp" alt="A node's Widgets tab with five widgets" caption="A node's Widgets tab: a slider in millimetres, a checkbox group, radio buttons, a date and time, and a location with its place search." :w="526" :h="350" />

When the node runs, each chip is replaced by its value, written in the code's language: a season chip runs as `"winter"` in Python, and an opacity chip as `0.5` in a Vega-Lite spec. Inside a quoted text, a chip becomes the value's text. The code saves a chip as `[!! name !!]`.

<GuideFigure src="/media/widgets/code-chips.webp" alt="Widget tags above a node's code and chips inside it" caption="Each widget's tag in the strip above the code, and the same widgets as chips in the code." :w="526" :h="350" />

Values are saved with the dataflow. Changing one marks the node as needing a new run, so **Run** and **Run All** run it again. A chip whose name the node has no widget for stops the run with a message naming it.

## Share a value with a Parameter node

A **Parameter** node holds one widget that any node of the dataflow can read, such as a period or a region that several nodes use.

1. Drag **Parameter** from the palette onto the canvas, give it a name, a type, a label and a default as for a widget, and click **Add parameter**.
2. Its tag, **@name**, shows under **Shared** in the strip above every node's code. Drag it into the code, where it shows as an amber chip.
3. Set the value in the Parameter node.

A Parameter node has no connections. It lists the nodes whose code uses it, and changing its value marks them as needing a new run. **Edit** renames it, and their code follows the new name. Pinned to the [dashboard](/dashboards/), it shows its value.

<GuideFigure src="/media/widgets/parameter.webp" alt="A location Parameter node beside a Data Loading node that reads it" caption="From the FloodScenarios dataflow: the Top-left corner Parameter node, a location, lists the three nodes whose code uses it. Beside it, a Data Loading node shows the shared tags above its code and the amber chips in it." :w="1190" :h="360" />

## Hand a node what you selected

A selection tag gives a node's code the rows you selected in a view: a brush or a click in a Vega-Lite chart, or a pick or a brush in an Autark map or plot.

1. Run the view, so its rows are known.
2. In the reading node's **Widgets** tab, under **Selections**, click **Add selection**. Pick the view and the column that identifies its rows, such as `osm_id` or `building_id`, name the tag, and click **Add selection tag**.
3. Drag the tag into the code, where it shows as a peach chip.
4. Select in the view and run the node.

The chip becomes the list of the selected rows' ids:

```python
picked = [!! selection buildings !!]
return arg[arg["osm_id"].isin(picked)]
```

With nothing selected, the list is empty. A new selection marks the node as needing a new run, and the ids are saved with the dataflow. A tag holds at most 10,000 ids.

<GuideFigure src="/media/widgets/selection-tag.webp" alt="An Autark map with one ZIP code picked, and a Python node that reads it" caption="From example 17: a ZIP code picked on an Autark map with a double-click, and a Python node whose code reads the picked ZIP codes through the zips selection tag, a peach chip. The node printed the one it was handed." :w="1220" :h="800" />
