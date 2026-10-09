---
title: "Charts and maps"
description: "Vega-Lite charts, Autark maps, and simple views of tables and images."
group: using
order: 30
card: { poster: /media/visualization/autark.webp, alt: "A brushed Autark histogram of building heights and the Autark map that highlights those buildings" }
deeper:
  - { doc: docs/USAGE.md, anchor: vega-lite-node, label: "The Vega-Lite node" }
  - { doc: docs/ARCHITECTURE.md, anchor: data-between-nodes, label: "How charts and maps read their input" }
  - { doc: docs/examples/11-autark-pbf-loading.md, label: "Example: an Autark map from an OpenStreetMap extract" }
  - { doc: docs/examples/16-simple-view-tables-and-images.md, label: "Example: Simple View tables and images" }
  - { doc: docs/README.md, anchor: examples, label: "Example gallery" }
---

# Charts and maps

Three kinds of node draw what flows into them. A Vega-Lite node draws a chart from a JSON specification, an Autark node draws a map or a plot of city data, and a Simple View shows a table or a set of pictures with nothing to write.

## Vega-Lite charts

Connect a table, such as a pandas DataFrame or a GeoPandas GeoDataFrame, to a **Vega-Lite** node and write its specification in the **Grammar** tab. Curio supplies the rows, so the specification leaves out `data` and names columns directly:

```json
{
  "mark": "bar",
  "encoding": {
    "x": { "field": "neighborhood", "type": "nominal" },
    "y": { "field": "vegetation_pct", "type": "quantitative" }
  }
}
```

Press play to draw it. If the editor is still empty when data first arrives, Curio fills it with a starter specification chosen from the column types. For a GeoDataFrame, `"mark": "geoshape"` draws a map, and Curio picks the geometry column and a projection unless you set them yourself. A chart with several views keeps its size, and the node scrolls to show all of it. Once a chart has a specification, it redraws by itself whenever new data arrives.

<LoopVideo src="/media/visualization/linked-charts.mp4" poster="/media/visualization/linked-charts.webp" caption="Run all nodes on an example dataflow draws two Vega-Lite charts, a stacked bar chart and a line chart, from the same computed table." :w="1280" :h="768" />

## Autark maps

An **Autark** node takes one JSON specification, called an UrbanSpec: `data` loads OpenStreetMap, CSV or GeoJSON data; `compute` runs a GPU shader written in WGSL; and either `map` draws layers in 2D or 3D, colored by a column, or `plot` draws a chart such as a histogram. A node draws one view, so a map and a plot take two Autark nodes, which an interaction edge can link (see [Linked views](/interactions/)). A node with only `data` passes its layers on, named after their tables (such as `table_osm_buildings`), for another Autark node to draw. A table from another node arrives as a layer named after the input circle it comes in on, `input_0` for the first, here colored by its `mean` column:

```json
{ "map": { "layerRefs": [{ "dataRef": "input_0", "getFnv": "mean", "getFnvType": "quantitative" }] } }
```

A raster, such as a GeoTIFF from the Data Catalog or the output of a Raster Calculator, draws as a raster layer colored by one of its bands, `band_1`, `band_2` and so on: `{ "dataRef": "input_0", "getFnv": "band_1" }`.

Maps, plots and compute need a browser with WebGPU, such as a recent Chrome or Edge. Without it, the node says **WebGPU is not available**, and its **Check again** button asks the browser again.

<LoopVideo src="/media/visualization/autark.mp4" poster="/media/visualization/autark.webp" caption="One Autark node loads Lower Manhattan from an OpenStreetMap extract, and two more draw a histogram of building heights and a map, linked by an interaction edge: brushing the lowest bars highlights those buildings on the map." :w="1280" :h="768" />

## Simple View

A **Simple View** node needs no specification. It shows a DataFrame or GeoDataFrame as a table, or as one card per row when a column holds pictures, either links to images or images stored in the data; with several such columns, **Image column** picks which one to show. Anything else, such as a number, a list or JSON, appears as text with a **Copy text** button.

<GuideFigure src="/media/visualization/simple-view.webp" alt="A Simple View node showing one card per row" caption="A Simple View node shows one card per row, each picture beside the values of its row." :w="1280" :h="768" />

## In the example gallery

The examples in your [projects](/projects-and-files/) show each of these at work. "Vega-Lite GeoDataFrame maps" draws maps with Vega-Lite, "Autark PBF loading" and "Autark GPU shader" build Autark maps, "Simple View: tables and images" covers Simple View, and "Heterogeneous data + linked views" puts an Autark map beside Vega-Lite charts that respond to each other (see [Linked views](/interactions/)). The example gallery linked below has a step-by-step walkthrough for each one.
