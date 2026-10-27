---
title: "Widgets and selections"
description: "Set the values a node's code reads in a form, share one value across nodes through connections, and hand a node what you selected in a view."
group: using
order: 15
card: { poster: /media/widgets/widgets-tab.webp, alt: "A node's Widgets tab with a slider, checkboxes, radio buttons, a date and a location" }
deeper:
  - { doc: docs/USAGE.md, anchor: widgets, label: "Widgets in the usage guide" }
  - { doc: docs/USAGE.md, anchor: running-stale-nodes-automatically, label: "Running stale nodes automatically" }
  - { doc: docs/USAGE.md, anchor: selection-tags, label: "Selection tags" }
  - { doc: docs/AUTHORING-NODES.md, anchor: widgets-in-a-template, label: "Widgets in a node template" }
---

# Widgets and selections

A widget is a value a node's code reads that you set in a form instead of in the code: a threshold, a season, a date, a place. Python, Vega-Lite and Autark nodes have widgets. A Data Loading or Data Export node keeps the widgets it comes with: its **Widgets** tab shows only their controls. A Python node that returns a widget's value shares it with the nodes connected to it, and a selection tag hands a node the rows you selected in a chart or a map.

## Add a widget

1. Open the node's **Widgets** tab (the toolbox icon in its header) and click **Add widget**.
2. Give it a name (letters, digits and underscores), a type, a label and a default. A choice, a checkbox group or a multi-select also takes its choices, and a number or a slider takes a minimum, a maximum, a step and units.
3. Above the code or spec, click the **Widgets** category to list the tags of the node's widgets. Drag the widget's tag into the code, or click the tag to put it at the cursor. It shows as a chip; point at the chip to see the value it stands for.
4. Set the value in the **Widgets** tab and run the node.

<GuideFigure src="/media/widgets/add-widget.webp" alt="The Add widget form of a Python node" caption="The Add widget form for a slider labelled Rain: its type, label, minimum, maximum, step, units and default." :w="526" :h="350" />

A widget is a number, a slider, a text, a choice (a dropdown or radio buttons), a checkbox, a checkbox group, a multi-select, a date and time, a location (a latitude and a longitude, or a place search), a list of numbers or of texts, a range, a text file, or a dataset, which a file or a Data Catalog dataset dropped on the node sets.

<GuideFigure src="/media/widgets/widgets-tab.webp" alt="A node's Widgets tab with five widgets" caption="A node's Widgets tab: a slider in millimetres, a checkbox group, radio buttons, a date and time, and a location with its place search." :w="526" :h="350" />

When the node runs, each chip is replaced by its value, written in the code's language: a season chip runs as `"winter"` in Python, and an opacity chip as `0.5` in a Vega-Lite spec. Inside a quoted text, a chip becomes the value's text. The code saves a chip as `[!! name !!]`.

<GuideFigure src="/media/widgets/code-chips.webp" alt="A Python node's code with widget chips, under the closed Widgets category" caption="A Python node's code with its five widgets as chips. Above it, the Widgets category, closed, counts them: a click lists their tags." :w="526" :h="350" />

Values are saved with the dataflow. Changing one marks the node as needing a new run, so **Run** and **Run All** run it again. With **View > Run stale nodes automatically** on, the change runs the node and the nodes below it by itself, half a second after the last change, so a slider drag runs them once. A chip whose name the node has no widget for stops the run with a message naming it.

## Share a value across nodes

To give several nodes one value, such as a season or a region, put its widget on one Python node whose code returns it, `return [!! season !!]`, and connect that node to each node that reads it. Each of them reads the value on that input, such as `input_1`. A Data Loading node takes inputs too, so several loaders can read one region.

## Hand a node what you selected

A selection tag gives a node's code the rows you selected in a view: a brush or a click in a Vega-Lite chart, or a pick or a brush in an Autark map or plot.

1. Run the view, so its rows are known.
2. In the reading node's **Widgets** tab, under **Selections**, click **Add selection**. Pick the view and the column that identifies its rows, such as `osm_id` or `building_id`, name the tag, and click **Add selection tag**.
3. Above the code, click the **Selections** category and drag the tag into the code, where it shows as a peach chip.
4. Select in the view and run the node.

The chip becomes the list of the selected rows' ids:

```python
picked = [!! selection buildings !!]
return input_0[input_0["osm_id"].isin(picked)]
```

With nothing selected, the list is empty. A new selection marks the node as needing a new run, and the ids are saved with the dataflow. A tag holds at most 10,000 ids.

<GuideFigure src="/media/widgets/selection-tag.webp" alt="An Autark map with one ZIP code picked, and a Python node that reads it" caption="From example 17: a ZIP code picked on an Autark map with a double-click, and a Python node whose code reads the picked ZIP codes through the zips selection tag, a peach chip. The node printed the one it was handed." :w="1220" :h="800" />
