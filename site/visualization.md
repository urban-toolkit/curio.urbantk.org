---
title: "Charts and maps"
description: "Vega-Lite charts, Autark maps, and simple views of tables and images."
group: using
order: 30
card: { poster: /media/visualization/autark.webp, alt: "A brushed Autark histogram of building heights and the Autark map that highlights those buildings" }
deeper:
  - { doc: docs/USAGE.md, anchor: vega-lite-node, label: "The Vega-Lite node" }
  - { doc: docs/USAGE.md, anchor: autark-node, label: "The Autark node" }
  - { doc: docs/ARCHITECTURE.md, anchor: data-between-nodes, label: "How charts and maps read their input" }
  - { doc: docs/examples/11-autark-pbf-loading.md, label: "Example: an Autark map from an OpenStreetMap extract" }
  - { doc: docs/examples/38-autark-solstice-sun-two-cities.md, label: "Example: four linked views in one Autark node" }
  - { doc: docs/examples/16-simple-view-tables-and-images.md, label: "Example: Simple View tables and images" }
  - { doc: docs/README.md, anchor: examples, label: "Example gallery" }
---

# Charts and maps

Three kinds of node draw what flows into them. A Vega-Lite node draws a chart from a JSON specification, an Autark node draws maps and plots of city data, and a Simple View shows a table or a set of pictures with nothing to write.

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

<LoopVideo src="/media/visualization/linked-charts.mp4" poster="/media/visualization/linked-charts.webp" label="Run all nodes on an example dataflow draws two Vega-Lite charts, a stacked bar chart and a line chart, from the same computed table." :w="1280" :h="768" />

## Autark maps

An **Autark** node takes one JSON specification, called an UrbanSpec: `data` loads tables, `compute` runs passes over them, and `map` and `plot` draw them, as maps of layers in 2D or 3D, colored by a column, and as plots such as histograms. A node with no `map` or `plot` passes its tables on by their names (such as `table_osm_buildings`), for another node to draw or read. A table from another node arrives as a layer named after the input circle it comes in on, `input_0` for the first, here colored by its `mean` column:

```json
{ "map": { "layerRefs": [{ "dataRef": "input_0", "getFnv": "mean", "getFnvType": "quantitative" }] } }
```

A raster, such as a GeoTIFF from the Data Catalog or the output of a [Raster Calculator](/scout/#building-rasters-and-shadows), draws as a raster layer colored by one of its bands, `band_1`, `band_2` and so on: `{ "dataRef": "input_0", "getFnv": "band_1" }`.

A layer's `title` names it in the legend, and `color` draws it in one color. A line layer takes a `width` in the map's planar units (about three quarters of a meter at Chicago), a polygon layer a `stroke` color, a points layer a `pointSize`, the radius of each point in meters, and a raster layer `colorMapReverse` and `colorMapCenter` to reverse its color scheme or center it on a value. A layer colored by a number runs its colors from its lowest value to its highest, or over `colorMapRange`, `[low, high]`: maps that set the same range color a value alike. A layer whose `color` is its input's scenario chip, such as `"[!! scenario input_1 !!]"`, is drawn in the color of the scenario box that input comes from (see [Maps and differences](/scenarios/#maps-and-differences)).

`layerType` draws a layer's table as another type of its kind of geometry, such as lines as `roads`; `"legend": true` puts a layer's colors in the map's legend; and `pickedComps` and `skippedComps` draw features as picked as the map opens, or hide them, by their positions. The Autark node section of the usage guide, linked below, covers these and more.

Maps, plots and compute need a browser with WebGPU, such as a recent Chrome or Edge. Without it, the node says **WebGPU is not available**, and its **Check again** button asks the browser again.

<LoopVideo src="/media/visualization/autark.mp4" poster="/media/visualization/autark.webp" label="One Autark node loads Lower Manhattan from an OpenStreetMap extract, and two more draw a histogram of building heights and a map, linked by an interaction edge: brushing the lowest bars highlights those buildings on the map." :w="1280" :h="768" />

### Several views

A node draws every map and plot its specification writes, each in a pane of its own: the maps first, then the plots. `layout` arranges the panes: `"vertical"` stacks them, `"horizontal"` puts them side by side, and `"grid"` fills `columns` columns (2 by default), row by row, with `gap` pixels between panes. An `id` names a map or a plot, and `links` joins a plot to a layer of a map: a brush on the plot lights the same features on the map, and a pick on the map selects them in the plot.

```json
{
  "layout": { "type": "horizontal", "gap": 8 },
  "map": { "id": "buildings", "layerRefs": [{ "dataRef": "table_osm_buildings", "isPick": true, "getFnv": "height" }] },
  "plot": { "id": "heights", "dataRef": "table_osm_buildings", "mark": "bar", "axis": ["height", "@transform"], "transform": { "preset": "binning-1d" }, "events": ["brushX"] },
  "links": [{ "source": "heights", "target": "buildings" }]
}
```

The node keeps its size, and its views share it. Each map has its own menu and legend, and R frames again the map you clicked last. In a node of several views, each view with an `id` also has an interaction dot of its own, which links that view alone to other nodes (see [Which views take part](/interactions/#which-views-take-part)).

### Data and compute

The sources of `data` run in order, and each makes or changes a table that later sources, passes, maps and plots name:

- `osm` loads OpenStreetMap layers, such as `buildings` and `roads`, from an extract (`pbfFileUrl`) or from OpenStreetMap's Overpass API, where its `tagSets` also pick features by their tags, such as cafés.
- `csv`, `json` and `geojson` load a file, or rows written in the specification, and `geotiff` loads a GeoTIFF as a raster.
- `heatmap` bins a table into a grid, with a band for each entry of its `groupBy`, such as a count of the table's rows within `near.distance` of each cell's center or the mean of one of their columns. With no `groupBy`, its one band counts the rows. A heatmap is a raster.
- `join` adds to each feature of a table the rows of another that meet it or lie within `near.distance`, aggregated by its `groupBy`; `sql` saves the rows of a `SELECT` over the tables before it as a new table; `update` changes a table's rows; and `drop` removes a table.

A heatmap, a join, an update or a drop also reads a table of the node's input by its name, such as `"joinDataRef": "input_0"` for the points a Python node returns. Autark cuts every table to the area of the first table in its workspace, so load another area, such as a second city, with a `workspace` of its own: a map, a plot or a pass reads the tables of the `workspace` it names.

Each feature of an OpenStreetMap layer has its OpenStreetMap id in `osm_id`, and a building's parts share its `building_id`. Tags that hold numbers, such as `height`, `building:levels`, `maxspeed` and `lanes`, are numbers: lengths in meters, speeds in km/h and counts as plain numbers. A value written with a unit, such as `282 ft` or `30 mph`, is converted, and any other value, such as `none` or `4 floors`, is left empty, as in a [Discovery Catalog](/discovery/#use-a-download-in-a-dataflow) download. A building part with no height stands 6 m tall above its base wherever the node uses a height: the map draws it so and a compute pass reads it so, while a plot shows the heights its table holds. `"buildingsZeroHeight": true`, on a buildings layer, draws such parts at random heights of 3 to 7 floors instead, and passes read no height for them.

Each entry of `compute` is a pass, run in order. A GPGPU pass runs a function written in WGSL on the GPU, once for every feature of a table. A render pass draws the tables its `layers` name, also on the GPU, from each feature of its `viewpoints` table, and counts what the frames show, such as the share of sky a street sees between the buildings. On the CPU, a windows pass places the windows of a buildings table, and a clusters pass numbers the groups of rows whose shapes touch. A pass writes into its table, or into a new one named by `outputTableName`, which later passes, maps and plots read by that name. With `"writeBack": true`, a pass also keeps the table it writes in the node's database, where a source with `"after": "compute"`, run once every pass has run, reads it: a join, a heatmap or a SQL query of a pass's result.

### Camera, terrain and style

A map opens framed on what its layers draw, looking straight down on their middle. Its `camera` turns that view: `pitch` tilts it, `bearing` turns it to face a compass heading, `zoom` sets how far away the eye is, `center` is the `[longitude, latitude]` it looks at, and `motion` is a tour the map plays once it opens, which a drag, a scroll or a key stops. Pressing R frames the map again, turns it by its camera and plays its tour again. `terrain` raises the ground to the heights of a raster's band, with the flat layers draped over it and the buildings standing on it. `style` names one of autk-map's styles, such as `light`, or gives the nine colors of a style of your own; `highlightColor` colors the picked features, and `"showUi": false` hides the map's menu and legend.

### Plots

A plot draws a table's rows as its `mark` says, such as bars, a scatter or lines, over the columns `axis` names, and `transform` bins or sorts them first, as a histogram does. `color` colors the marks by a column, `tickFormats` and `axisLabels` set the ticks and the axes' titles, `selection` draws rows as selected, and `events` lists the selections a click or a brush sends. A plot also draws a table with no geometry, such as the rows of a `sql` source. `markColor` and `highlightColor` color a plot's marks and its selected ones: every Autark plot on a page draws in the last ones set, so give every plot of a dataflow the same ones, or none.

## Simple View

A **Simple View** node needs no specification. It shows a DataFrame or GeoDataFrame as a table, or as one card per row when a column holds pictures, either links to images or images stored in the data; with several such columns, **Image column** picks which one to show. Anything else, such as a number, a list or JSON, appears as text with a **Copy text** button.

<GuideFigure src="/media/visualization/simple-view.webp" alt="A Simple View node showing one card per row" caption="A Simple View node shows one card per row, each picture beside the values of its row." :w="1280" :h="768" />

## In the example gallery

The examples in your [projects](/projects-and-files/) show each of these at work. "Vega-Lite GeoDataFrame maps" draws maps with Vega-Lite, "Autark PBF loading" and "Autark GPU shader" build Autark maps, "Simple View: tables and images" covers Simple View, and "Heterogeneous data + linked views" puts an Autark map beside Vega-Lite charts that respond to each other (see [Linked views](/interactions/)). "Autark: Back Bay or the Loop, whose streets get more sun at the solstice" loads two cities into two workspaces and draws four linked views in one Autark node. "Autark: park access heatmap" and "Autark: sidewalk problems in the Loop" bin parks and Project Sidewalk's labels into heatmaps, "Sky seen from the street" runs a render pass, and "Autark: green share and summer heat in Niterói" and "Autark: park area within reach and summer heat in Niterói" load a summer temperature GeoTIFF beside OpenStreetMap layers. The example gallery linked below has a step-by-step walkthrough for each one.
