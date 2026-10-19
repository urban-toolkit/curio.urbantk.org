---
title: "SCOUT examples"
description: "Building shadows, park shade, flooding with nature-based solutions and weather-aware routing from SCOUT, as Curio packages, models and dataflows that compare scenarios."
group: using
order: 47
card: { poster: /media/scout/flood-change.webp, alt: "A map of the change in flood depth between two scenarios" }
deeper:
  - { doc: docs/examples/24-scout-shadow-model-chicago-loop.md, label: "Example 24: SCOUT shadow model on Chicago Loop buildings" }
  - { doc: docs/README.md, anchor: scout-scenario-studies, label: "The SCOUT scenario studies" }
  - { doc: packages/scout.rasters@1/README.md, label: "The SCOUT Rasters package" }
  - { doc: packages/scout.comparison@1/README.md, label: "The SCOUT Comparison package" }
  - { doc: packages/model.scout.deep-umbra@1/README.md, label: "The Deep Umbra model package" }
  - { doc: packages/model.scout.weather-gnn@1/README.md, label: "The SCOUT weather GNN model package" }
  - { doc: docs/USAGE.md, anchor: rasters, label: "Rasters: the Raster Calculator" }
  - { doc: docs/README.md, anchor: examples, label: "Example gallery" }
---

# SCOUT examples

[SCOUT](https://github.com/urban-toolkit/scout) studies three urban questions: how much shadow tall buildings cast, how deep a flood gets with and without nature-based solutions, and which route avoids bad weather. Curio runs each one with packages, models and datasets that ship with it, in dataflows that compare [scenarios](/scenarios/). SCOUT's data and models are used with the permission of its authors.

## Find them

The five dataflows are in the examples every account starts with, under **By source** on the projects page: "SCOUT shadow model on Chicago Loop buildings" (example 24) under **Examples**, and four under **Tests**: "Chicago Loop shadow with towers removed or edited", "Lower Manhattan park shade with towers removed or capped", "Quad Cities flood depth, nature-based solutions and vulnerability" and "Routing around rain and wind in downtown Chicago". The **SCOUT** tag in the [rail](/projects-and-files/#the-projects-page) lists every dataflow that uses a SCOUT node, model or dataset. On your own computer they come with `--with-examples`, which also installs the SCOUT packages.

## Building rasters and shadows

- **Rasterize Buildings**, from the SCOUT Rasters package, turns a buildings layer with heights in metres into SCOUT's zoom-16 height tiles, side by side in one raster: a mosaic an Autark map draws.
- **Accumulated Shadow**, the node of the Deep Umbra model package in the [Model Catalog](/model-catalog/), runs Deep Umbra, SCOUT's shadow model, on that mosaic. It gives the minutes of a day the ground spends in shadow, as a raster on the same grid; its **Season** widget picks spring, summer or winter.
- A **Raster Calculator**, also from SCOUT Rasters, then takes the shadow's statistics: its mean and median over the ground.

To use SCOUT Rasters in a dataflow of your own, click **Add to project** on its card in the [Node Catalog drawer](/node-catalog/#add-a-package-to-a-project). Its nodes are then under **SCOUT Rasters** in the Tools panel's **Node Catalog** dropdown.

Example 24, "SCOUT shadow model on Chicago Loop buildings", runs them on the buildings of SCOUT's Chicago Loop example: the buildings in 3D, the height mosaic and the summer shadow on Autark maps, and the mean and median shadow.

<GuideFigure src="/media/scout/buildings-3d.webp" alt="An Autark map of the Chicago Loop's buildings in 3D" caption="Example 24: the Loop&#x27;s buildings in 3D, colored by their height in metres." :w="532" :h="356" />

<GuideFigure src="/media/scout/height-mosaic.webp" alt="An Autark map of the height mosaic" caption="The height mosaic Rasterize Buildings makes of them: one raster on SCOUT&#x27;s zoom-16 tile grid, each cell a height." :w="532" :h="356" />

<GuideFigure src="/media/scout/summer-shadow.webp" alt="An Autark map of the summer shadow" caption="Deep Umbra&#x27;s summer shadow on the same grid: the minutes of the day each cell spends in shadow, darker where it is longer." :w="532" :h="356" />

"Chicago Loop shadow with towers removed or edited" compares two scenarios of the same buildings over a shared season, Existing and Towers removed, each with an Autark map of its shadow. Both maps set the same `colorMapRange`, 0 to 720 minutes, so a minute of shadow has one color on both. In Towers removed, an [Interaction node](/scenarios/#remove-or-change-features) takes SCOUT's 15 buildings out by their `building_id`. Add edits to its log to remove, raise or lower more, and **Update results** runs the shadow again. One Compare Scenarios node charts the mean shadow, and another takes its change, which an Autark map draws.

<GuideFigure src="/media/scout/shadow-existing.webp" alt="An Autark map of the Loop's accumulated shadow, Existing" caption="Existing: the accumulated shadow of the Loop&#x27;s buildings, colored from 0 to 720 minutes." :w="526" :h="350" />

<GuideFigure src="/media/scout/shadow-towers.webp" alt="An Autark map of the Loop's accumulated shadow, Towers removed" caption="Towers removed, on the same range: the shadow without SCOUT&#x27;s 15 buildings." :w="526" :h="350" />

<GuideFigure src="/media/scout/towers-lever.webp" alt="The Towers removed scenario's Interaction node with a log of two edits" caption="The Interaction node of Towers removed: SCOUT&#x27;s 15 buildings removed by building_id, and an edit added after them, Remove where height &gt; 200, for 20 removed in all." :w="560" :h="460" />

Deep Umbra ships with Curio's repository and its Docker image; a pip install downloads its weights from GitHub the first time Accumulated Shadow runs.

## Shade in Lower Manhattan's parks

"Lower Manhattan park shade with towers removed or capped" measures the shade in the parks of the Financial District and City Hall with the towers around them removed or capped:

- an Autark node loads Lower Manhattan's parks, and the buildings of a box about 300 m larger, from an OpenStreetMap extract;
- Python nodes give every building part a height, keep the open-air parks, and mark the parts at least the **Tall building height** tall within the **Distance from a park** of any park, two [Parameter nodes](/widgets/#share-a-value-with-a-parameter-node) set to 60 m and 75 m;
- in three scenarios, Existing, Towers removed and Height cap, Interaction nodes remove the marked parts or cut them to the Tall building height. Rasterize Buildings and Accumulated Shadow give the shadow over the season a third Parameter node sets, a Python node measures it in each park, and Autark maps draw the buildings in 3D and the shadow.

One Compare Scenarios node charts each park's mean minutes of shadow, and four take each what-if's change in shadow, cell by cell and per park, which Autark maps draw.

<GuideFigure src="/media/scout/park-change.webp" alt="An Autark map of the change in each park's mean shadow with the towers removed" caption="Towers removed: the change in each park&#x27;s mean shadow, in red, yellow and blue from -720 to 720 minutes." :w="526" :h="350" />

## Flooding and nature-based solutions

"Quad Cities flood depth, nature-based solutions and vulnerability" is SCOUT's flood study of the Quad Cities, built from Curio's own nodes and SCOUT Rasters' Raster Calculator:

- three [Parameter nodes](/widgets/#share-a-value-with-a-parameter-node) set the period (2020 to 2040, 2050 to 2080 or 2080 to 2100) and the region's two corners, which start at the region of SCOUT's flood example;
- Data Loading nodes read only that region's window of SCOUT's whole flood depth rasters, with and without nature-based solutions (NbS), and of its raster of where each solution would go;
- in each of two scenarios, No NbS and NbS, a **Raster Calculator** takes the depth with NbS where the class is one of the solutions its widget checks, and the depth without NbS elsewhere, a second takes the depth's median and mean, and an Autark map draws the depth. Both depth maps set the same `colorMapRange`, 0 to 11 m.

Two Compare Scenarios nodes then take the size of the change in depth between No NbS and NbS, which an Autark map draws, and chart each scenario's median depth.

<GuideFigure src="/media/scout/flood-change.webp" alt="An Autark map of the size of the change in flood depth" caption="Depth change: the size of the change in flood depth between No NbS and NbS, cell by cell, over the region the Parameter nodes set." :w="526" :h="350" />

<GuideFigure src="/media/scout/flood-median.webp" alt="A Compare Scenarios node charting the median flood depth of two scenarios" caption="Median flood depth: the median depth of No NbS and NbS, as bars." :w="560" :h="420" />

The dataflow also weighs the flood against social vulnerability. Two more Data Loading nodes read CDC/ATSDR's Social Vulnerability Index (SVI) for the census tracts and USGS's rivers, lakes and reservoirs from the Data Catalog, and a Data Transformation node keeps the tracts the rivers touch, which an Autark map draws by their SVI percentile. In each scenario, two Data Transformation nodes average the depth over each tract's land, the water left out, and over the riverside land in each period. Compare Scenarios then takes the size of the change in each tract's mean depth, which an Autark map draws, and charts vulnerability against depth and the mean depth by period.

<GuideFigure src="/media/scout/flood-vulnerability.webp" alt="An Autark map of the riverside tracts by their SVI percentile" caption="The tracts the rivers touch, by their SVI percentile: darker where social vulnerability is higher." :w="526" :h="350" />

<GuideFigure src="/media/scout/flood-period.webp" alt="A Compare Scenarios node charting the mean flood depth by period as grouped bars" caption="Depth by period: the riverside tracts&#x27; mean flood depth in each period, No NbS beside NbS." :w="560" :h="420" />

A pip install downloads the flood rasters from GitHub the first time a node reads them. The **Raster Calculator** works on any rasters on one grid, from a Python node or the Data Catalog, cell by cell or as statistics. A Data Loading node reads only part of a large GeoTIFF when its `curio_load_data` call is given `bounds`.

## Weather-aware routing

**Weather Routing**, the node of the SCOUT weather GNN model package in the [Model Catalog](/model-catalog/), finds routes between two points over a roads layer. It weighs each road by the weather that SCOUT's weather graph network predicts on it from SCOUT's WRF forecast in the Data Catalog. Its widgets set the origin and destination, the start time, the mode, the number of routes per factor, and the rain and wind weights; the forecast runs from 5 July 2025, 19:00, to 7 July, 19:00, Chicago time. It outputs the routes, which an Autark map draws, and a table of each route's duration, distance and rain, heat, wind and humidity exposure, which Compare Scenarios charts.

"Routing around rain and wind in downtown Chicago" is SCOUT's weather routing example. An Autark node loads the roads of SCOUT's box in downtown Chicago, and one Weather Routing node finds SCOUT's two routes over them: the fastest, and the one its weather weights favor. Two scenarios, Fastest route and Weather-aware route, each keep one of them. An Autark map draws both routes over the roads in their scenarios' colors, and four Compare Scenarios nodes chart their duration, distance and rain and wind exposure.

<GuideFigure src="/media/scout/routes-map.webp" alt="An Autark map of two routes over the roads of SCOUT's box in downtown Chicago" caption="The Fastest route and the Weather-aware route over the roads of SCOUT's box, each in its scenario's color." :w="526" :h="350" />

<GuideFigure src="/media/scout/routing-duration.webp" alt="A Compare Scenarios node charting the two routes' durations as bars" caption="Duration: each route's mean duration in minutes, as bars in its scenario's color." :w="560" :h="420" />

## Charts that compare scenarios

The SCOUT Comparison package holds charts to connect after a [Compare Scenarios](/scenarios/#compare-scenarios) node, for comparisons its **Chart** tab does not draw: **Lines with a band**, **Curves by group**, **Bars with error bars**, **Ensemble strips**, **Stacked bars with totals**, **Donuts** and **Weighted matrix**. Each is a Vega-Lite node with a spec of its own, and draws the scenarios in the colors of their boxes, in the order of the Compare node's inputs.

1. Click **Add to project** on the SCOUT Comparison card in the [Node Catalog drawer](/node-catalog/#add-a-package-to-a-project). Its charts are then under **SCOUT Comparison** in the Tools panel's **Node Catalog** dropdown.
2. Drag a chart onto the canvas and connect a Compare Scenarios node to it.
3. In its **Widgets** tab, set the columns it plots: each column widget, such as `y` or `part`, takes the name of a column of the Compare node's table. A new chart's widgets hold their own names, so the chart says which column the table lacks until you set them.

In "Nine ways to chart scenario comparisons", under **Tests** on the projects page, each of these charts draws one example table (see [Scenarios](/scenarios/#in-the-examples)).
