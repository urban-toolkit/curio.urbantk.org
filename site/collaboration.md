---
title: "Collaboration"
description: "Edit a dataflow with the editors you invite while others watch: everyone's cursor, code as it is typed, every change kept, and agents at work as one more person."
group: using
order: 110
deeper:
  - { doc: docs/COLLABORATION.md, label: "Real-time collaboration" }
  - { doc: docs/COLLABORATION.md, anchor: who-edits-owner-editors-and-watchers, label: "Owner, editors and watchers" }
  - { doc: docs/COLLABORATION.md, anchor: when-two-people-change-the-same-thing, label: "When two people change the same thing" }
  - { doc: docs/AGENT-CATALOG.md, anchor: invited-editors, label: "Invited editors and the dataflow's agents" }
  - { doc: docs/COLLABORATION.md, anchor: known-limitations, label: "Known limitations" }
---

# Collaboration

Everyone who opens a saved dataflow while signed in shares one copy of it, which the Curio server keeps. The owner and the editors the owner invites change it together: code shows in everyone's editor as it is typed, and nodes, connections, widgets and scenarios change on every screen at once. Anyone else with the dataflow's link watches, read-only. An agent at work on the dataflow is one more person there.

<MediaTodo kind="clip" source="tour:collaboration" caption="Seen from the owner's screen: an invited editor joins and gets a chip in the dock, their cursor moves over the canvas, and the code they type shows in the node as they type it." />

## Invite editors

The owner of a saved dataflow invites editors by their username:

1. On the canvas, choose **Share > Invite editors**.
2. Type the account's **Username** and click **Add**. The account joins the **Editors** list, where the ✕ beside it removes it.
3. Send them the dataflow's link, from **Share > Copy dataflow link**.

An editor opens the link and edits the dataflow with you. Adding or removing an editor counts at once, also for someone who has the dataflow open. Only an account can be an editor: a guest is never one, and a guest invites nobody.

| Who | What they do |
|---|---|
| The owner | Edits, invites and removes editors, and works with the dataflow's agents. |
| An editor | Edits code, nodes, connections, widgets and scenarios, runs the dataflow on the server, and works with its agents. |
| Anyone else with the link | Watches, read-only: every edit, keystroke and cursor shows as it lands, and their own cursor shows to the others. **File > Save dataflow** saves them a copy in their own projects. |

A guest on a hosted Curio watches other accounts' dataflows. Its canvas of an example stays its own, and so does what its agents change there.

## See who is here

The dock at the top of the canvas, beside the canvas agents, has a chip for each other person in the dataflow, with their initials in their color. Hover a chip for their name, their role and the node they are editing, such as **Ana (editor), editing Street trees**, and click it to move your view to where they point on the canvas. The **Activity** button at the end of the row lists who joined, who left and whose role changed.

Each person's pointer shows on the others' canvases as a cursor in their color with their name, at the same point of the dataflow whatever each of you has panned or zoomed to. A cursor that rests for 5 seconds fades until it moves again. A person's color comes from their account, so it is the same in each of their tabs. A node someone is in shows their initials in its corner; hover them to read **Editing:** and their name.

## Edit together

- **Code and specs:** each keystroke shows in the others' editors as it is typed, with each person's cursor in their color and their name over it, and it is kept as it is made. **Ctrl+Z** (**Cmd+Z** on a Mac) in a node's editor undoes your own typing in that node, never someone else's.
- **Everything else:** adding, removing and connecting nodes, a widget's value, a scenario, and a node's title, size and settings change on every screen at once. While someone drags a node, the others see it move.
- **Runs** are each person's own: a node's result shows on the canvas of whoever ran it. An editor's runs go to the server, as the owner's do, with the datasets, packages and models the owner added to the dataflow and the editor's own saved keys. The dataflow's saved outputs come from the owner's runs, and a watcher's runs stay in their tab.
- **An editor's own data** reaches the dataflow through the owner's review. A file an editor drops on the canvas or on a node goes into the editor's own Data Catalog, and that drop, the editor's **Add to project** or a card of their Data Catalog dragged onto the canvas or a node asks the owner to add the dataset. Until the owner reviews it, the node reads **WAITING** on its dataset pill. The owner's Data Catalog drawer lists each request under **Waiting for review**, with **Asked by** and the editor's name: **Apply** copies the dataset into the owner's Data Catalog and adds it to the dataflow, and **Dismiss** leaves nothing behind. A dataset of the shared catalog asks nothing.

When two people change the same thing:

| What happens | What you see |
|---|---|
| You remove a node someone is typing in | Curio asks first: **Ana is editing this node. Remove it anyway?** |
| Someone removes a node while you type in it | A message names who removed it, with **Put it back**, which adds the node again with your code and the connections whose other end is still there. |
| You connect to a node someone removes at the same moment | The connection is not kept, and a message names who removed the node. |
| Two people set one widget, or drag one node | Every tab ends on the same value, or the same place. |

## Every change is kept

The server keeps each change as it is made, whoever makes it, and a tab that opens the dataflow later finds every change. On the owner's tab, the top bar reads **Saved** once the server has every change made there, **Saving...** while some are on their way, and **Offline** while Curio cannot reach the server. Leaving the dataflow, or closing its tab, asks first only while a change of yours has not reached the server.

**File > Save dataflow**, on the owner's tab, also saves the outputs the dataflow keeps, and is a version in the dataflow's history. An editor or a watcher saves a copy with **File > Save dataflow**, in their own projects.

The history is the same for the owner and the editors, in the [Provenance](/provenance/) drawer: a version for each node or connection added or removed, for each person's typing once they pause or leave the editor (**Ana edited**), for each change an agent makes (**Node Builder, asked by Ana**), and for each save and each version put back. Putting a version back changes everyone's canvas. A watcher sees no history, and only the owner can clear the history before a version.

## Agents in the dataflow

An agent at work is one more person in the dataflow, from the moment a chat message, another agent, **Solve** or **Build & validate** starts it until its reply ends.

- **Its chip:** every tab's dock has a chip for it, with its glyph in its category's color and a dot while it works. Hover it for who asked it, the nodes it is writing and the skills it is using, such as **Node Builder (asked by Ana), editing Map Editor, using map-edits**. A click opens its chat for the owner and the editors, and moves a watcher's view to the node it is writing. **Activity** says when it joined and who asked it, and what it did as it left: **Dataflow Builder left: added 3 nodes and 2 connections**.
- **Its cursor, for drags on the canvas only:** when an agent adds a node, from its tile in the tool rail or a card in a catalog drawer, moves a node, or drops a card onto a node, every tab plays the drag. Its cursor, with its name, carries what it drags from where that tab shows it, and the change lands as the drop ends. A node's code, its settings, connections and removals land with no cursor.
- **The code in view:** before an agent writes a node, it waits while someone else is in the node; after 30 seconds it gives up, and nothing changes. While it writes, it holds the node, whose corner shows the agent's glyph (**Editing: Node Builder (asked by Ana)**), and every tab showing the node turns it to its code or spec, or to its **Widgets** tab for a widget's value, and marks the changed lines or widgets for a moment. Then the node goes back to the tab it showed, unless you picked one meanwhile.
- **One action at a time:** an agent's actions land in order. A Dataflow Builder plan is checked whole, then its nodes are dragged in one after another, with no code yet, and its connections and scenarios follow once the nodes they join are there. Clicking **Build & validate plan**, in the plan's strip, then writes their code one node at a time, in plan order. When someone removes a node the plan joins while it lands, the plan stops there: what landed stays, and its card in the chat says what was left undone.
- **Its changes:** a node's code or settings, a new node or a plan land at once for everyone, as an edit does. Each is a version in the history named after the agent and who asked it, and its card in the chat has **Undo** (see [AI agents](/ai-agents/#chat-and-changes)).

The owner and the editors work with the dataflow's agents in chats they share, where a message someone else wrote shows their name above it. A reply shows in each of their tabs as it is written, and goes on when the tab that asked for it closes. A chat answers one message at a time: a message sent meanwhile waits its turn, whoever sent it can withdraw it, and the owner or any editor can stop a reply (see [AI agents](/ai-agents/#chat-and-changes)). An editor's chats answer with the owner's model and key, and name only the editor's own saved keys. An install an agent asks for in an editor's chat, such as a package, a dataset or a download from the [Discovery Catalog](/discovery/), waits for the owner, who reviews it in the same chat. A watcher sees an agent at work in the dock and on the canvas, but not its badges or its chats.

## On your own server

Inviting editors needs an account for each person, so a Curio you host for a group starts with `--deploy` (see [Run your own server](/self-hosting/)). On a Curio started without `--deploy`, everyone who opens it is its one local user, which owns every dataflow there: every tab edits, and each other tab shows as **Shared Guest** with a number, such as **Shared Guest 2**.

Collaboration travels over WebSocket connections at the backend's address plus `/socket.io`. Caddy's `reverse_proxy` passes them as they are; another reverse proxy must forward the `Upgrade` and `Connection` headers on that path. `--collab-origins` limits which origins' pages may connect, and a server people reach across a network you do not trust belongs behind HTTPS. Run one backend process: it keeps each open dataflow's live copy in its memory. Who is here, the locks and the Activity list are kept in that memory too, so a restart clears them.
