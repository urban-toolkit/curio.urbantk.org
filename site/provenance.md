---
title: "Provenance"
description: "Curio keeps a version history of each dataflow and a run history of each node, so you can go back to an earlier version."
group: using
order: 50
card: { poster: /media/provenance/provenance-history.webp, alt: "The Dataflow provenance drawer" }
deeper:
  - { doc: docs/USAGE.md, anchor: provenance, label: "Provenance in the usage guide" }
  - { doc: docs/ARCHITECTURE.md, anchor: provenance-tracking, label: "How provenance is tracked" }
  - { doc: docs/TRILL-SPEC.md, label: "Where the history is saved" }
---

# Provenance

Curio keeps two histories while you work. The dataflow's version history records the whole graph each time a node or a data connection is added or removed, and each node keeps a record of its runs. Both are saved with the project, so they are still there the next time you open it.

## The version history

Choose **View > Provenance** to open the dataflow's history in a drawer on the right. Each row is one version, numbered from the first at the top, with what made it, such as **Node added: Data Loading** or **Connection added**, and the time it was recorded. The drawer opens on the version that is on the canvas, marked with a filled dot.

Click a version to open it: a thumbnail of the dataflow at that step, the date and time it was recorded, and how many nodes and connections it holds. Opening a version only shows it; the canvas stays as it is. The pin at the left of the drawer's title keeps the drawer open when you click outside it or press Escape.

A dataflow opened without a saved history, such as a loaded file or an example opened for the first time, starts one with a version for each of its nodes and connections.

<LoopVideo src="/media/provenance/provenance-history.mp4" poster="/media/provenance/provenance-history.webp" label="View > Provenance opens the drawer on the newest version, which is clicked open to show its thumbnail, and the list is scrolled back to the first version." :w="1280" :h="768" />

## Going back to an earlier version

Open a version and click **Put this version on the canvas**. The rest of the history stays, so you can go forward again the same way. Going back is an edit like any other: the save state reads **Unsaved**, the nodes need to run again, and the next save stores the version you picked.

<LoopVideo src="/media/provenance/provenance-revert.mp4" poster="/media/provenance/provenance-revert.webp" label="Version 6 and then version 5 are opened in the drawer and put on the canvas with their button, and each time the canvas changes to the dataflow that version holds, one node fewer." :w="1280" :h="768" />

If you change the dataflow from there, the new versions branch off from the one you went back to. The line down the left leads to the newest version, and the versions you left behind fold under the one they branched from, as **4 versions on another branch**. Click the fold to show them, and again to hide them.

<GuideFigure src="/media/provenance/branch.webp" alt="The Dataflow provenance drawer with four versions on another branch" caption="Version 8 was put back after version 12 and changed again, so versions 9 to 12 sit on another branch, shown open under version 8, and the line goes on to version 13, the one on the canvas." :w="520" :h="720" />

## A node's run history

The **Provenance** button among a node's tabs, in its header, lists the node's runs in the same drawer. Each time the node runs, it adds a row with the run's number, what went in and what came out, such as **In: DATAFRAME | Out: GEODATAFRAME** (or **ERROR** for a run that failed), and the time it started. In the notebook view, a cell's **Provenance** button opens the same drawer.

Click a run to open it: when it started, how long it ran, and the code or specification that ran. **Put this code back in the node** puts that code in the node's editor without running it. The next run then branches from the run you picked, so you can try one idea, go back, and try another without losing either. Runs left behind fold under the run they branched from, as versions do.

<GuideFigure src="/media/provenance/node-runs.webp" alt="The Node provenance drawer with three runs of a Python Computation node" caption="The runs of a Python Computation node: run 1's code was put back after run 2, so run 3 branches from run 1 and run 2 sits on another branch, shown open under run 1. Run 3 is open, with when it started, its code and the button that puts that code back in the node." :w="520" :h="720" />

## What is kept

Both histories are saved inside the project every time it saves. A file from **File > Save dataflow as** holds only the dataflow itself, not its history, so a dataflow loaded from a file starts a new one (see [Projects and files](/projects-and-files/)).
