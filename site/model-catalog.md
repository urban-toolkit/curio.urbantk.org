---
title: "Model Catalog"
description: "Trained models and the nodes that run them, such as image segmentation for street photos, as model packages you add to a dataflow."
group: using
order: 75
app: /catalog/models
deeper:
  - { doc: docs/MODEL-CATALOG.md, label: "Model Catalog reference" }
  - { doc: docs/BRINGING-MODELS.md, label: "Bring a model you trained" }
  - { doc: docs/examples/10-street-vision-cv-analysis.md, label: "Example 10: street-level computer vision" }
---

# Model Catalog

The Model Catalog holds the trained models your nodes run. Each model is a model package: the model's weights and their license, with the node that runs it. **DDRNet23-Slim**, which labels every pixel of a street photo as road, sidewalk, building, vegetation, sky and 14 other classes, ships with Curio, and so do SCOUT's Deep Umbra and weather GNN (see [SCOUT examples](/scout/)). Models you add from the [Discovery Catalog](/discovery/), or import as a package, land here too.

## Browse the models

Open the **Model Catalog** tab at the top of the Projects page. Each card is one model, with its runtime, its type, how many classes it labels, its size and its weights' license. Search and sort the cards, and filter them in the left rail by **All models**, **In all projects**, **By type** or **By runtime**. Click a card to see it in the drawer on the right, which offers **Add to all projects**, **Publish** or **Unpublish** for a model of your own, **Remove from account** for a model of your own that no dataflow uses, and **View details**: the model's type, runtime, input size, labels, size, weights license and publisher, the node it drops as, and its package.

<MediaTodo kind="still" source="new:modelcatalog" caption="The Model Catalog page, with DDRNet23-Slim, Deep Umbra and the SCOUT weather GNN." />

## Add a model to a dataflow

On the canvas, click **Model Catalog** in the top bar, or open the **Model Catalog** dropdown in the Tools panel and click **Browse Model Catalog +**. The drawer has two tabs: **Browse all**, and **In project** for the models this dataflow has. **Add to project** lists the model's permissions and libraries, then installs them. **Remove from project** takes a model out of the dataflow; it is refused while the model's node, or a node the model was dropped onto, is on the canvas, and its confirmation names every dataflow whose code loads the model.

Drag a model's card onto the canvas, and its node appears where you drop it: **Image Segmentation** for DDRNet23-Slim, **Accumulated Shadow** for Deep Umbra and **Weather Routing** for the weather GNN. When the dataflow does not have the model yet, the review of **Add to project** comes first, and the node appears once the model and its libraries are installed.

## Run a model in a dataflow

A node's code loads its model by id, with `curio_load_model("<id>")`, which [Functions node code calls](https://github.com/urban-toolkit/curio/blob/main/skills/node-functions/SKILL.md) lists with its arguments. **Image Segmentation** runs a segmentation model over a collection of photos, such as street photos from Mapillary that a **Data Loading** node reads. Each photo gets the share of its pixels every class covers, the class that covers most, and an overlay that **Simple View** shows beside the photo. Set `classes` in the code to the classes you want reported, or `None` for all of them.

To run another model of the same type, drag its card onto the node: the node's `curio_load_model` line names that model, and the rest of its code stays as it is. A model of another type is refused, with a message naming both types.

An [agent](/ai-agents/#what-agents-work-with) writes only models you added into a node, and asks you to add any other.

[Example 10](https://github.com/urban-toolkit/curio/blob/main/docs/examples/10-street-vision-cv-analysis.md) runs two models over the same 40 Mapillary photos of Lincoln Park in Chicago: DDRNet23-Slim, and a model from Hugging Face.

## Add a model from Hugging Face

In the Discovery Catalog, open **Hugging Face models**, search, and click **Add to Model Catalog** on a model. Curio runs semantic segmentation models, as ONNX graphs or as Transformers checkpoints with safetensors weights; for a Transformers model it also installs `torch`, `transformers` and `safetensors`. A model it cannot run says why on its row. A model added this way comes with an **Image Segmentation** node that runs it.

## Make and share a model package

**Save as package node…**, in the **Node settings** of a node whose code loads one of your models, makes a new model package: a copy of the model's weights, with the node as its node. **Export**, in a model's details, saves its package as a `.curio.zip` archive, weights included, which **Import package** reads in any Curio. To make a model package from a model you trained, see the guide to bringing models linked below.

A dataflow names its models by id and lists their packages. Someone you share it with runs a model that ships with Curio once opening the dataflow has added its package. For a model of your own, send them its archive, or publish it on your server for them to add.
