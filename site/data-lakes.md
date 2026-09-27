---
title: "Data lakes"
description: "Search open data portals from Curio and download a dataset straight into your Data Catalog."
group: using
order: 70
card: { poster: /media/data-lakes/data-lakes.webp, alt: "The Data Lake Catalog page" }
app: /catalog/lakes
deeper:
  - { doc: docs/DATA-LAKE-CATALOG.md, label: "Data Lake Catalog reference" }
  - { doc: docs/DATA-CATALOG.md, label: "Data Catalog reference" }
---

# Data lakes

The Data Lake Catalog lists the open data portals your Curio server can reach, such as city open data sites. Search them all from one box, download a dataset, and it lands in your [Data Catalog](/data-catalog/) like a file you imported yourself.

## The portals

Open the **Data Lake Catalog** tab at the top of the Projects page. Each card is one portal; the ones that come with Curio include the City of Chicago Data Portal, data.gov.uk, ArcGIS Hub Open Data and GeoSampa (São Paulo). Filter the cards by provider or by access in the left rail. **View details** on a card shows the portal's address, licence, formats, download limit and whether it takes a token.

The **Direct URL** card is marked **Link only**: it has no datasets to browse, so searches skip it.

## Search every portal

Type in the **Search every portal…** box, and the cards give way to matching datasets from all the portals at once, each tagged with the portal it came from. If a portal is slow or down, a line names the portals that did not answer, and the results from the others still show. To search one portal on its own, click **Browse datasets** on its card. Your search stays in the page address, so you can bookmark it or send it to someone.

<GuideFigure src="/media/data-lakes/data-lakes.webp" alt="The Data Lake Catalog page" caption="The Data Lake Catalog page lists the portals this deployment can reach, with filters by provider and access, and the details of the selected portal." :w="1280" :h="768" />

## Download a dataset

Each result lists the formats it comes in. Pick one if there is a choice, and click **Download**. A progress bar with **Cancel** shows while the file downloads, and a message tells you when the dataset is in your Data Catalog. **View on the portal ↗** opens the dataset's own page on the portal's site.

Curio downloads single CSV, GeoJSON, JSON, Parquet and GeoTIFF files, up to the size a portal's details show as **Max download**. It refuses archives such as `.zip` files, and a failed download says why.

## Use the download in a dataflow

A download is an ordinary dataset in your Data Catalog, with a preview, a schema and loading code, and its details say which portal it was **Downloaded from**. Downloading does not add it to a dataflow: on the canvas, open **Data > Data Catalog**, click **Add to project** on the dataset, and drag it onto the canvas. A search result marked **In your Data Catalog** was already downloaded in that format, and its **View dataset** button opens your copy instead of downloading it again.

The Dataset Finder agent can also search these portals for you and propose a download, which only happens once you apply it. See [AI agents](/ai-agents/).

## Portal tokens

Some portals accept an API token. The City of Chicago portal answers without one, and a token raises your rate limit. A card that takes a token shows **Token set**, **Token optional** or **Token needed**, and a portal that needs one offers no **Browse datasets** until you set it.

A token belongs to your account. Paste it into **Socrata app token** in **AI Settings**, which opens from the top of the Projects and catalog pages or from the Agent Catalog drawer on the canvas, and click **Save**. Leave the field blank to keep a saved token, or click **Remove saved token** to clear it; Curio shows whether a token is set, never its value. If the server provides a token for everyone, the field says so, and a token of your own takes its place. Guest accounts cannot save a token.
