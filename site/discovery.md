---
title: "Discovery Catalog"
description: "Search open data portals, open storage, ask services for an area, and add trained models, straight into your catalogs."
group: using
order: 70
app: /catalog/discovery
deeper:
  - { doc: docs/DISCOVERY-CATALOG.md, label: "Discovery Catalog reference" }
  - { doc: docs/DATA-CATALOG.md, label: "Data Catalog reference" }
---

# Discovery Catalog

The Discovery Catalog lists the places your Curio server can reach for data and models: open data portals such as city open data sites, storage such as folders and public buckets, services such as OpenStreetMap and Mapillary that answer for an area, and Hugging Face's image segmentation models. A dataset you take from it lands in your [Data Catalog](/data-catalog/) like a file you imported yourself, and a model lands in your [Model Catalog](/model-catalog/).

## The sources

Open the **Discovery Catalog** tab at the top of the Projects page. Each card is one source. The ones that come with Curio include the City of Chicago Data Portal, data.gov.uk, ArcGIS Hub Open Data, GeoSampa (São Paulo), OpenStreetMap, Mapillary, Google Street View and Hugging Face models. Filter the cards by provider or by access in the left rail. **View details** on a card shows the source's address, licence, formats, download limit and whether it takes a key.

The **Direct URL** card is marked **Link only**: it downloads one file from a link you paste, and searches skip it.

<MediaTodo kind="still" source="new:discovery" caption="The Discovery Catalog page lists the sources this deployment can reach, with filters by provider and access, and the details of the selected source." />

## Search every portal

Type in the **Search every portal…** box, and the cards give way to matching datasets from all the portals at once, each tagged with the portal it came from. If a portal is slow or down, a line names the portals that did not answer, and the results from the others still show. To search one portal on its own, click **Browse datasets** on its card. Your search stays in the page address, so you can bookmark it or send it to someone.

## Download a dataset

Each result lists the formats it comes in. Pick one if there is a choice, and click **Download**. A progress bar with **Cancel** shows while the file downloads, and a message tells you when the dataset is in your Data Catalog. **View on the portal ↗** opens the dataset's own page on the portal's site.

Curio downloads single CSV, GeoJSON, JSON, Parquet and GeoTIFF files, up to the size a source's details show as **Max download**. It refuses archives such as `.zip` files, and a failed download says why.

## Ask a service for an area

A service has nothing to browse. You say where, and it answers with one dataset:

- **OpenStreetMap** gives buildings, roads, parks, water and land surface, for a box or for named areas.
- **Mapillary** gives street-level photos for a box, taken between the dates you choose, each credited to its photographer, and the signs and objects Mapillary detected in them.
- **Google Street View** gives one image per panorama and heading for a box. Google bills its requests to your key.

Click **Download** on the row you want, and set the **Area**: a place you search for, coordinates, the extent of a dataset you have, or, for OpenStreetMap, named areas. The photos and images land as one collection in your Data Catalog, which a **Data Loading** node reads one row per photo.

## Add a model

Open the **Hugging Face models** card and search, for example for `segformer`. Each row names the model's task, its weights, its downloads and its licence. Click **Add to Model Catalog**: Curio downloads the model and, when it needs them, the libraries it runs on. Then drag the model onto an **Image Segmentation** node on the canvas. See [Model Catalog](/model-catalog/).

## Use a download in a dataflow

A download is an ordinary dataset in your Data Catalog, with a preview, a schema and loading code, and its details say where it came from. Downloading does not add it to a dataflow: on the canvas, click **Data Catalog** in the top bar, click **Add to project** on the dataset, and drag it onto the canvas. A row marked **In your Data Catalog** was already downloaded, and its **View dataset** button opens your copy instead of downloading it again.

The Dataset Finder agent can also search the portals for you and propose a download, which only happens once you apply it. See [AI agents](/ai-agents/).

## Set an API key

Mapillary and Google Street View need a key of your own. The City of Chicago portal and Hugging Face answer without one, and a token raises your rate limit; a Hugging Face token also opens the gated models your account can read.

1. **Get the key** from the service. The source's **View details** links to where you get one.
   - **Mapillary access token**: sign in at [mapillary.com/dashboard/developers](https://www.mapillary.com/dashboard/developers), register an application, and copy its **Client Token**. It starts with `MLY|`.
   - **Google Maps API key**: create a key in the [Google Cloud console](https://developers.google.com/maps/documentation/streetview/get-api-key) and enable the **Street View Static API** for its project.
   - **Hugging Face token**: create one with read access at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).
   - **Socrata app token**: sign up at [evergreen.data.socrata.com](https://evergreen.data.socrata.com/signup) and create an app token.
2. **Open API Settings**: the button at the top of the Projects and catalog pages, or in the Agent Catalog drawer on the canvas. A source's **Add yours in API Settings** opens it at that source's row.
3. **Find the row** under **Discovery Catalog**. Each row says which sources use it.
4. **Paste the key** into the row and click its **Save**. The field then reads *(saved - leave blank to keep)*.
5. **Check the card.** In the Discovery Catalog, the source's card reads **Token set**, and its rows download.

A key belongs to your account and is sent only to its own source. Curio shows whether a key is set, never its value, and **Remove saved key** clears it. If the server provides a key for everyone, the row says so, and a key of your own takes its place. On a server started with `--deploy`, guest accounts cannot save a key.
