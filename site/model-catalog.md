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
  - { doc: packages/curio.segmentation@1/README.md, label: "The Segmentation package" }
  - { doc: packages/model.curio.sam3@1/README.md, label: "SAM 3 and its two nodes" }
---

# Model Catalog

The Model Catalog holds the trained models your nodes run. Each model is a model package: the model's weights and their license, with the node that runs it. **DDRNet23-Slim**, which labels every pixel of a street photo as road, sidewalk, building, vegetation, sky and 14 other classes, with the same results on every x86 CPU, ships with Curio, and so do SCOUT's Deep Umbra and weather GNN (see [SCOUT examples](/scout/)). So does **SAM 3**, which finds the objects a short phrase names, such as *curb ramp* or *traffic cone*, in images and videos. Models you add from the [Discovery Catalog](/discovery/), or import as a package, land here too.

## Browse the models

Open **Model Catalog** in the top bar of the Projects page. Each card is one model, with its runtime, its type, how many classes it labels, its size and its weights' license. Search and sort the cards, and filter them in the left rail by **All models**, **In all projects**, **By type** or **By runtime**. Click a card to see it in the drawer on the right, which offers **Add to all projects**, **Publish** or **Unpublish** for a model of your own, **Remove from account** for a model of your own that no dataflow uses, and **View details**: the model's type, runtime, input size, labels, size, weights license and publisher, the node it drops as, and its package.

<MediaTodo kind="still" source="new:modelcatalog" caption="The Model Catalog page, with DDRNet23-Slim, Deep Umbra and the SCOUT weather GNN." />

## Add a model to a dataflow

On the canvas, click **Model Catalog** in the top bar, or open the **Model Catalog** dropdown in the Tools panel and click **Browse Model Catalog +**. The drawer has two tabs: **Browse all**, and **In project** for the models this dataflow has. **Add to project** lists the model's permissions and libraries, then installs them. **Remove from project** takes a model out of the dataflow; it is refused while the model's node, or a node the model was dropped onto, is on the canvas, and its confirmation names every dataflow whose code loads the model.

Drag a model's card onto the canvas, and its node appears where you drop it: **Image Segmentation** for DDRNet23-Slim, **Accumulated Shadow** for Deep Umbra and **Weather Routing** for the weather GNN. SAM 3's card offers its two nodes, **Track Objects** and **Segment Images**, in a menu where you drop it, and makes the one you pick. When the dataflow does not have the model yet, the review of **Add to project** comes first, and the node appears once the model and its libraries are installed.

## Run a model in a dataflow

A node's code loads its model by id, with `curio_load_model("<id>")`, which [Functions node code calls](https://github.com/urban-toolkit/curio/blob/main/skills/node-functions/SKILL.md) lists with its arguments. **Image Segmentation** runs a segmentation model over a collection of photos, such as street photos from Mapillary that a **Data Loading** node reads. Its code names the model and returns a call of `segment_images`, the **Segmentation** package's function, which the header above the code lists under **Functions**. Each photo gets the share of its pixels every class covers, the class that covers most, and an overlay that **Simple View** shows beside the photo. The node's **Widgets** tab's **Classes** lists the classes to report, such as `vegetation`, `sky` and `road`. A new node opens with it empty, which reports every class the model names.

Segmentation (`curio.segmentation@1`) has no node of its own. DDRNet23-Slim's package, and the package of every segmentation model you add from the Discovery Catalog, depend on it, so adding the model adds it.

**SAM 3** has two nodes. The **Widgets** tab of each holds its settings, such as **Labels**, the phrases to look for, and its code one call of its package's function, which the header above the code lists under **Functions**:

- **Track Objects** follows what its **Labels** name through each video of a collection. Each video comes back as its overlay, which **Simple View** plays, with how many objects of each label it followed and a table of their tracks. It looks at one frame every **Gap between frames** (half a second by default) of the part of each video between **Track from** and its code's `TO_SECONDS`, and at no more than **Maximum frames per video** frames of a video in a run (450 by default): a part that needs more stops the node, with a message naming a gap between frames and a shorter part that fit.
- **Segment Images** finds what its **Labels** name in each image of a collection, or in each frame **Sample Video Frames** took from a video. Each row starts with the columns Image Segmentation gives, so a chart made for Image Segmentation reads them as they are: the label whose objects cover the most of the image (`dominant_class`) and each label's share of it (`<label>_pct`). Then come how many objects of each label it holds (`<label>_objects`) and an overlay of their masks, boxes and labels, which **Simple View** shows beside the image. An object found twice counts once, and each mask loses its small holes and specks, as in Track Objects. **Labels** starts with all 35 of the package's labels, and fewer run faster. **Score threshold** is the score SAM 3 needs to keep an object, and **Maximum images per run**, 300 at first, the most images one run looks at: more rows stop the node before SAM 3 loads.

Both nodes run on the GPU when the Curio server has one, and on its CPU otherwise. The first time a node runs SAM 3 on a Curio server, it downloads SAM 3's weights, 3.4 GB, which can take minutes; meanwhile the node says which file is coming and how far it has come.

To run another model of the same type, drag its card onto the node: the node's `curio_load_model` line names that model, and the rest of its code stays as it is. A model of another type is refused, with a message naming both types.

An [agent](/ai-agents/#what-agents-work-with) writes only models you added into a node, and asks you to add any other.

[Example 10](https://github.com/urban-toolkit/curio/blob/main/docs/examples/10-street-vision-cv-analysis.md) runs two models over the same 40 Mapillary photos of Lincoln Park in Chicago: DDRNet23-Slim, and a model from Hugging Face.

## Add a model from Hugging Face

In the Discovery Catalog, open **Hugging Face models**, search, and click **Add to Model Catalog** on a model. Curio runs semantic segmentation models, as ONNX graphs or as Transformers checkpoints with safetensors weights; for a Transformers model it also installs `torch`, `transformers` and `safetensors`. A model it cannot run says why on its row. A model added this way comes with an **Image Segmentation** node that runs it.

## Make and share a model package

**Save as package node…**, in the **Node settings** of a node whose code loads one of your models, makes a new model package: a copy of the model's weights, with the node as its node. **Export**, in a model's details, saves its package as a `.curio.zip` archive, weights included, which **Import package** reads in any Curio. **Save as package node…** and **Export** refuse SAM 3, with a message saying why. To make a model package from a model you trained, see the guide to bringing models linked below.

A dataflow names its models by id and lists their packages. Someone you share it with runs a model that ships with Curio once opening the dataflow has added its package. For a model of your own, send them its archive, or publish it on your server for them to add.
