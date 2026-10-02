---
title: "Model Catalog"
description: "Trained models your nodes run, such as image segmentation for street photos, and how a node runs one."
group: using
order: 75
app: /catalog/models
deeper:
  - { doc: docs/MODEL-CATALOG.md, label: "Model Catalog reference" }
  - { doc: docs/examples/10-street-vision-cv-analysis.md, label: "Example 10: street-level computer vision" }
---

# Model Catalog

The Model Catalog holds the trained models your nodes can run. **DDRNet23-Slim**, which labels every pixel of a street photo as road, sidewalk, building, vegetation, sky and 14 other classes, ships with Curio. Models you add from the [Discovery Catalog](/discovery/) land here too.

## Browse the models

Open the **Model Catalog** tab at the top of the Projects page. Each card is one model; filter them by origin (**Shipped with Curio** or **Downloaded**) or by runtime in the left rail. **View details** shows a model's runtime, the classes it labels, the size of image it reads, its licence and where it came from. A model you added can be deleted from the drawer beside the cards; one that ships with Curio cannot.

<MediaTodo kind="still" source="new:modelcatalog" caption="The Model Catalog page, with DDRNet23-Slim and a model added from Hugging Face." />

## Run a model in a dataflow

An **Image Segmentation** node, from the Street Vision package, runs a model over a collection of photos, such as street photos from Mapillary that a **Data Loading** node reads. Each photo gets the share of its pixels every class covers, the class that covers most, and an overlay that **Simple View** shows beside the photo.

A new Image Segmentation node runs DDRNet23-Slim. To run another model, open **Models** in the left Tools panel and drag the model onto the node; its code then names the new model. Set `classes` in the code to the classes you want reported, or `None` for all of them. Dropped on a node that runs no model, a model does nothing, and the node says so.

[Example 10](https://github.com/urban-toolkit/curio/blob/main/docs/examples/10-street-vision-cv-analysis.md) runs two models over the same 40 Mapillary photos of Lincoln Park in Chicago: DDRNet23-Slim, and a model from Hugging Face.

## Add a model from Hugging Face

In the Discovery Catalog, open **Hugging Face models**, search, and click **Add to Model Catalog** on a model. Curio runs ONNX models, and Transformers models with safetensors weights; for a Transformers model it also installs `torch` and `transformers`. A model it cannot run says why on its row.

A dataflow names its models by id. Someone you share it with runs a model that ships with Curio as it is; for a model you added, they add one of their own and drag it onto the node.
