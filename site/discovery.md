---
title: "Discovery Catalog"
description: "Search open data portals, open storage, ask services for an area, and add trained models, straight into your catalogs."
group: using
order: 70
app: /catalog/discovery
deeper:
  - { doc: docs/DISCOVERY-CATALOG.md, label: "Discovery Catalog reference" }
  - { doc: docs/DATA-CATALOG.md, label: "Data Catalog reference" }
  - { doc: docs/DISCOVERY-CATALOG.md, anchor: adding-from-a-storage-source, label: "Adding from a storage source, read in place or cached" }
  - { doc: docs/DISCOVERY-CATALOG.md, anchor: downloading-from-openstreetmap, label: "Downloading from OpenStreetMap: layers, rows and numbers" }
---

# Discovery Catalog

The Discovery Catalog lists the places your Curio server can reach for data and models: open data portals such as city open data sites, storage such as folders and public buckets, services such as OpenStreetMap and Mapillary that answer for an area, and Hugging Face's image segmentation models. A dataset you take from it lands in your [Data Catalog](/data-catalog/) like a file you imported yourself, and a model lands in your [Model Catalog](/model-catalog/).

## The sources

Open **Discovery Catalog** in the top bar of the Projects page. Each card is one source. The ones that come with Curio include the City of Chicago Data Portal, data.gov.uk, ArcGIS Hub Open Data, GeoSampa (São Paulo), OpenStreetMap, Mapillary, Google Street View and Hugging Face models. Filter the cards by provider or by access in the left rail. **View details** on a card shows the source's address, licence, formats, download limit and whether it takes a key.

The **Direct URL** card is marked **Link only**: it downloads one file from a link you paste, and searches skip it. A link to a GeoParquet file (`.parquet`) also takes an **Area**: only the parts of the file inside it are read.

<MediaTodo kind="still" source="new:discovery" caption="The Discovery Catalog page lists the sources this deployment can reach, with filters by provider and access, and the details of the selected source." />

## Search every portal

Type in the **Search every portal…** box, and the cards give way to matching datasets from all the portals at once, each tagged with the portal it came from. If a portal is slow or down, a line names the portals that did not answer, and the results from the others still show. To search one portal on its own, click **Browse datasets** on its card. Your search stays in the page address, so you can bookmark it or send it to someone.

## Download a dataset

Each result lists the formats it comes in. Pick one if there is a choice, and click **Download**. A progress bar with **Cancel** shows while the file downloads, and a message tells you when the dataset is in your Data Catalog. **View on the portal ↗** opens the dataset's own page on the portal's site.

Curio downloads single CSV, GeoJSON, JSON, Parquet and GeoTIFF files, up to the size a source's details show as **Max download**. It refuses archives such as `.zip` files, and a failed download says why.

## Add from storage

A storage source is a folder on the Curio server, a public bucket or a Hugging Face dataset repository. Its page lists what it holds as rows, each with its kind, such as **Videos**, **Images**, **Table** or **Files**, a line saying what it holds, and its size. The storage sources that come with Curio include two buckets:

- **SideSeeing street captures**: sidewalk walks in Chicago's West Loop, each with its video, with faces and license plates blurred, its GPS track, and its sensor readings and cell networks as tables.
- **SAGE-IDOT rail crossings**: three SAGE cameras at Illinois Department of Transportation rail crossings, each crossing's month in rows of its own: a snapshot every 5 minutes and, as tables, the objects YOLO models detected in its images.

Click **Add to Data Catalog** on a row, and keep only some of its values if you like, such as one walk. **Files** on a row lists its files, for you to add only the ones you pick. A **Table** row is copied into your Data Catalog, as a download is. Any other row adds as one [collection](/data-catalog/#collections) instead: an index of its files, which stay where the source keeps them.

On a Curio server that mounts buckets, a bucket's collection is read in place: Curio mounts the bucket the first time one of its files is read, nothing is copied into your account, its thumbnails and players work at once, and the collection's details say where it is read from, such as *Read in place from data.urbantk.org*. Elsewhere, and for a Hugging Face repository, click **Cache files** in the collection's details, in the Data Catalog, to copy its files to the Curio server: nodes read them once they are copied.

The Data Catalog comes with one of SideSeeing's walks, read the same way from the SideSeeing bucket: **SideSeeing West Loop walk**, its 14-minute video, and **SideSeeing West Loop walk GPS track**, its `gps.csv`, which node code opens from its row's `path`.

## Ask a service for an area

A service has nothing to browse. You say where, and it answers with one dataset:

- **OpenStreetMap** gives buildings, roads, parks, water and land surface, for a box or for named areas.
- **Mapillary** gives street-level photos for a box, taken between the dates you choose, each credited to its photographer, and the signs and objects Mapillary detected in them.
- **Google Street View** gives one image per panorama and heading for a box. Google bills its requests to your key.

Click **Download** on the row you want, and set the **Area**: a place you search for, coordinates, the extent of a dataset you have, or, for OpenStreetMap, named areas. The photos and images land as one collection in your Data Catalog, which a **Data Loading** node reads one row per photo.

## Add a model

Open the **Hugging Face models** card and search, for example for `segformer`. Each row names the model's task, its weights, its downloads and its licence. Click **Add to Model Catalog**: Curio downloads the model and, when it needs them, the libraries it runs on. Then, on the canvas, drag the model from the **Model Catalog** dropdown in the Tools panel onto an **Image Segmentation** node, or onto the canvas for an Image Segmentation node of its own. See [Model Catalog](/model-catalog/).

## Use a download in a dataflow

A download is an ordinary dataset in your Data Catalog, with a preview, a schema and loading code, and its details say where it came from. Downloading does not add it to a dataflow: on the canvas, click **Data Catalog** in the top bar, click **Add to project** on the dataset, and drag it onto the canvas. A row marked **In your Data Catalog** was already downloaded, and its **View dataset** button opens your copy instead of downloading it again.

In an OpenStreetMap download, every tag a feature has is a column, and the tags that hold numbers are numbers: lengths such as `height` in meters, speeds such as `maxspeed` in km/h, and counts such as `building:levels` and `lanes` as plain numbers. A value in another unit, such as `40 ft` or `30 mph`, is converted, and a value that is not one number, such as `maxspeed=none`, is empty. The OpenStreetMap layers of an [Autark node](/visualization/#autark-maps) hold the same numbers.

The Dataset Finder agent can also search the portals for you and propose a download, which only happens once you apply it. See [AI agents](/ai-agents/).

## Set an API key

Mapillary and Google Street View need a key of your own. The City of Chicago portal and Hugging Face answer without one, and a token raises your rate limit; a Hugging Face token also opens the gated models your account can read.

1. **Get the key** from the service. The source's **View details** links to where you get one, and so does the key's form in API Settings (**Get a Mapillary access token**, for example).
   - **Mapillary access token**: sign in at [mapillary.com/dashboard/developers](https://www.mapillary.com/dashboard/developers), register an application, and copy its **Client Token**. It starts with `MLY|`.
   - **Google Maps API key**: create a key in the [Google Cloud console](https://developers.google.com/maps/documentation/streetview/get-api-key) and enable the **Street View Static API** for its project.
   - **Hugging Face token**: create one with read access at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).
   - **Socrata app token**: sign up at [evergreen.data.socrata.com](https://evergreen.data.socrata.com/signup) and create an app token.
2. **Open API Settings** from the top bar. On the Projects and catalog pages it opens the settings page; on the canvas and the dashboard it opens as a drawer on the right. A source's **Add yours in API Settings**, in its details, opens it on that key's form, so you can skip the next two steps.
3. On the **API keys** tab, click **+** (**Add configuration**) at the end of the table's header.
4. In **Kind**, under **Data source**, choose the key's name. It lists the key of every source on this Curio that takes one: with the sources Curio ships, **Socrata app token**, **Hugging Face token**, **Google Maps API key** and **Mapillary access token**. The form says which sources use it.
5. **Paste the key** and click **Save**. A line confirms it, such as *Saved the Mapillary access token.*, and the key's row shows **Key saved** under its name.
6. **Check the card.** In the Discovery Catalog, the source's card reads **Token set** as soon as you save, and its rows download.

A key belongs to your account and is sent only to the sources that use it. Curio shows whether a key is set, never its value; the key's row ends with **x** (**Remove**) and a pencil (**Edit**). If the server provides a key for everyone, the list shows it with **Set by this Curio** under its name, and adding the same key with **+** saves your own in its place. On a server started with `--deploy`, guest accounts cannot save a key.
