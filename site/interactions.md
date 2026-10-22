---
title: "Linked views"
description: "Select in one chart or map and see the selection everywhere it is linked."
group: using
order: 40
card: { poster: /media/interactions/interaction-edge.webp, alt: "A Data Pool linked to a Vega-Lite chart" }
deeper:
  - { doc: docs/examples/09-heterogeneous-data-linked-views.md, label: "Example: a map and a scatter linked directly" }
  - { doc: docs/examples/07-autark-gpu-shader.md, label: "Example: brushing a histogram to light up roads on a map" }
  - { doc: docs/USAGE.md, anchor: vega-lite-node, label: "The Vega-Lite node" }
  - { doc: docs/README.md, anchor: examples, label: "Example gallery" }
---

# Linked views

Linked views respond to each other: select marks in one chart or map, and the matching rows light up in the views linked to it. In Curio, an interaction edge links two views and carries selections between them, never data.

## How linking works

Draw an interaction edge between two views, and a selection in either marks the matching rows of the other: the receiving view sets a column called `interacted` to `"1"` on the selected rows and `"0"` on the rest, and highlights them without drawing again. A Vega-Lite chart and an Autark map link as easily as two charts. In the "Heterogeneous data + linked views" example, brushing the scatter highlights the matching tracts on the map, and a tract picked on the map lights its point in the scatter.

Link the views through a Data Pool instead when a Simple View shows the selection, when selections are combined with Merge (AND) or Merge (OR), when a Vega-Lite chart marks its own selection in `interacted`, or when three or more views share one selection. The pool's output feeds each view, and each view has an interaction edge to the pool.

Removing an interaction edge, or a node at either end, removes the highlight it gave.

<MediaTodo kind="clip" source="tour:interaction" caption="Hovering the bars of a Vega-Lite chart linked to a Data Pool turns each hovered bar red, as the selection is written back into the data." />

## Making an interaction edge

Vega-Lite, Autark, Simple View and Data Pool nodes each have a handle on their top edge. Drag from one view's top handle to another view's, or to a Data Pool's: the interaction edge is drawn in red, with arrows at both ends. A top handle connects only to another top handle, and interaction edges do not change the order in which nodes run. Two Simple Views can't be linked to each other, since neither shows the other's selection.

A typical linked dataflow, like the "Heterogeneous data + linked views" example, prepares its data, feeds it to two views, and links the two with one interaction edge.

<GuideFigure src="/media/interactions/interaction-edge.webp" alt="A Data Pool and a Vega-Lite chart joined by a data connection and an interaction edge" caption="A Data Pool and a Vega-Lite chart joined twice: a grey data connection between their side handles and a red interaction edge between their top handles." :w="1280" :h="768" />

## Which views take part

- **Vega-Lite** sends the selections declared in its specification's `params`: a point, such as `{"name": "pick", "select": "point"}`, or an interval brush. To show linked selections, read the `interacted` column in the specification, for example `"color": {"condition": {"test": "datum.interacted === '1'", "value": "red"}, "value": "grey"}`, and to show its own selection, the selection's name, for example `{"param": "brush", "empty": false, "value": "red"}`. On a `geoshape` map, use a point selection: a brush there selects nothing in the views linked to it.
- **Autark** sends picks on the map layer marked `"isPick": true`, made by double-clicking a feature, and brushes on a plot. It highlights linked selections in its map or plot on its own.
- **Simple View** sends a row when you click one of its image cards, and outlines in red the cards of the rows a Data Pool marks.

Views can also be linked inside a single node: a Vega-Lite specification with several views can connect them through its own `params`.
