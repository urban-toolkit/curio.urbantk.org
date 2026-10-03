---
title: "Provenance"
description: "Curio keeps a version history of each dataflow and a run history of each node, so you can go back to an earlier version."
group: using
order: 50
card: { poster: /media/provenance/provenance-graph.webp, alt: "The Provenance window" }
deeper:
  - { doc: docs/ARCHITECTURE.md, anchor: provenance-tracking, label: "How provenance is tracked" }
  - { doc: docs/TRILL-SPEC.md, label: "Where the history is saved" }
---

# Provenance

Curio keeps two histories while you work. The dataflow's version history records the whole graph each time a node or a data connection is added or removed, and each node keeps a record of its runs. Both are saved with the project, so they are still there the next time you open it.

## The version history

Click **Provenance** in the top bar to open the dataflow's history as a graph. Each card is one version: a thumbnail of the dataflow at that step, with the date and time it was recorded. The graph starts at the top with the empty dataflow, and each line joins a version to the one made after it. Drag the graph to move around it, and use the zoom buttons in its corner.

A dataflow opened without a saved history, such as a loaded file or an example opened for the first time, starts one with a version for each of its nodes and connections.

<LoopVideo src="/media/provenance/provenance-graph.mp4" poster="/media/provenance/provenance-graph.webp" caption="The Provenance window opens from the Provenance menu, and its graph of versions is dragged to reach the ones below the fold." :w="1280" :h="768" />

## Going back to an earlier version

Click a card to put that version on the canvas. The rest of the history stays, so a click on a newer card moves forward again. Going back is an edit like any other: the save state reads **Unsaved**, the nodes need to run again, and the next save stores the version you picked. If you change the dataflow from there, the new versions branch off from the one you went back to, and the later ones stay in the graph.

<LoopVideo src="/media/provenance/provenance-revert.mp4" poster="/media/provenance/provenance-revert.webp" caption="Clicking earlier and earlier versions in the provenance graph changes the canvas each time to the dataflow that version holds." :w="1280" :h="768" />

## A node's run history

The **Provenance** tab of a node, among the tabs at the bottom of its editor, shows the node's runs as a graph. Python, JavaScript and Vega-Lite nodes add a card each time they run, with the run's number, the types of data that went in and came out, and the first line of the code or specification that ran.

Click a card to put that code back in the editor, without running it. The next run then branches from the card you picked, so you can try one idea, go back, and try another without losing either.

<MediaTodo kind="still" source="new:nodeprovenance" caption="A node's Provenance tab shows its runs as cards, each with the run's number, its input and output types and the first line of its code." />

## What is kept

Both histories are saved inside the project every time it saves. A file from **File > Save dataflow as** holds only the dataflow itself, not its history, so a dataflow loaded from a file starts a new one (see [Projects and files](/projects-and-files/)).
