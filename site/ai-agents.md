---
title: "AI agents"
description: "Attach AI agents to a node, a connection or the whole canvas, and choose the model they use and the skills they read."
group: using
order: 90
card: { poster: /media/ai-agents/agentattach.webp, alt: "Agents attached to a dataflow" }
app: /catalog/agents
deeper:
  - { doc: docs/AGENT-CATALOG.md, label: "Agent Catalog reference" }
  - { doc: docs/AGENT-CATALOG.md, anchor: skills, label: "Skills and the agents that hold them" }
  - { doc: docs/USAGE.md, anchor: llm-configurations, label: "Configuring the AI provider" }
---

# AI agents

Agents are AI assistants you attach to a node, a connection between two nodes, or the whole canvas, to chat about that part of your dataflow. A change an agent makes to your dataflow lands at once, as your own edit does, and you can undo it from the chat.

An agent is an autonomous runtime with a goal (its instruction), its own tools and model, and a memory (the conversation of each chat). A [skill](#skills) tells an agent how to do a specific task, such as writing a Map Editor node's edits: instructions, procedural knowledge, reference facts and starter templates, in a `SKILL.md` file. A skill does nothing on its own, and an agent reads one when a task needs it. One skill serves many agents, and an agent uses many skills.

## Choose the provider and model

Agents answer with an **LLM configuration**: a provider, its key and a model, which you set up in **API Settings**. API Settings has two tabs, **API keys** and **Agent configuration**.

1. **Get an API key** from the provider: [OpenAI](https://platform.openai.com/api-keys), [Anthropic](https://console.anthropic.com/keys) or [Gemini](https://aistudio.google.com/apikey). The form links to the same pages (**Get your OpenAI key**, for example). A model you run yourself, such as one in Ollama or LM Studio, may need no key.
2. **Open API Settings** from the top bar. On the Projects and catalog pages it opens the settings page; on the canvas and the dashboard it opens as a drawer on the right, and your dataflow stays open.
3. On the **API keys** tab, click **Add configuration**.
4. In **Kind**, choose **Language model**.
5. Give it a **Label**, and pick the **Provider**: **OpenAI**, **Anthropic**, **Gemini**, or **Custom** for any OpenAI-compatible endpoint, such as a model you run yourself (Custom asks for a **Base URL**).
6. Paste the **API key**, and choose the **Model**: **Fetch models** suggests what the endpoint serves, or type a model name.
7. Click **Add configuration**. The configuration shows in the list, with **saved** in its **Key** column when you gave a key. **Make this my default** is ticked on your first configuration, so it becomes your default.

You can keep several configurations, for different providers or models. On the **Agent configuration** tab, **Default for agents** picks your default, and **Agent models** picks which one each agent runs on; an agent left on **Default** uses your default. If whoever runs the server set a Deployment default, it is offered too. On a server started with `--deploy`, guest accounts cannot add a configuration and answer with the server's guest configuration. Curio does not bill agent runs: the provider charges whoever's key is used.

<MediaTodo kind="still" source="new:apisettings" caption="API Settings: every key in one list on the API keys tab, and the model each agent runs on under Agent configuration." />

## Add an agent to a dataflow

On the canvas, click **Agent Catalog** in the top bar, or open the **Agent Catalog** dropdown in the Tools panel and click **Browse Agent Catalog +**. The drawer has two tabs: **Browse all**, and **In project** for the agents this dataflow has. In the catalogs, a project is one of your saved dataflows.

Click **Add to project** and confirm. An agent that relies on others says so on its button, as in **Add to project (+1 required)**, and the agents it needs are added with it. Added agents appear in the Tools panel's **Agent Catalog** dropdown.

The **Agent Catalog** tab at the top of the Projects page lists the agents for your whole account. Click one to read about it; **Add to all projects** adds it to every project you have and to new ones. **Import agent** adds one you wrote yourself. Importing a newer version of an agent you have replaces yours, a new major version is added beside the old one, and the same or an older version is refused. When the server allows it, **Publish** shares an agent you imported with everyone on that server, and whoever added it gets a newer version of the same major the next time they add the agent to a dataflow.

<LoopVideo src="/media/ai-agents/agentcatalog.mp4" poster="/media/ai-agents/agentcatalog.webp" label="Agents are found by search in the Agent Catalog drawer and added to the dataflow, then listed in the Tools panel." :w="1280" :h="768" />

## Attach it to your work

Adding an agent makes it available; attaching it puts it to work. Drag it from the **Agent Catalog** dropdown and drop it:

- on a node, to work with that node's code and output (a badge appears under the node)
- on a connection, to work with what flows between two nodes (a badge appears on the connection)
- on empty canvas, to work with the whole dataflow (it joins the bar at the top of the canvas)

An agent only accepts the targets it was made for. Each attachment has its own conversation, and one agent can be attached in several places. Once an agent is attached, the bar at the top also shows a **Goal** field: say what the dataflow is for, and the agents that read it take it into account. To detach an agent, hover its badge and click ✕, which also deletes its conversation.

<LoopVideo src="/media/ai-agents/agentattach.mp4" poster="/media/ai-agents/agentattach.webp" label="An agent is dropped on a node, another on the connection between two nodes and a third on empty canvas, and each drop is confirmed." :w="1280" :h="768" />

## Chat and changes

Click a badge to open the agent's chat. The header says what the agent is attached to, the arrows step through your attached agents, and you can rename or clear the conversation. The first message is the agent's instruction, which the pencil lets you edit. Type in **Message this agent…** and send.

The agent answers on the Curio server: closing or reloading your tab does not stop it, and its reply is in the chat when you come back. A chat answers one message at a time. A message sent while it answers waits under the last message, marked **Waiting its turn**, and **Withdraw** takes it back until then. **Stop**, under a reply being written, stops the agent at its next step: what it wrote and the changes it made stay, and the reply says who stopped it, such as **Stopped by Ana after 12s**. The chats of different attached agents answer at the same time.

What an agent does depends on the agent: explain or debug a node, write node code, find datasets (including in the open data portals of the [Discovery Catalog](/discovery/)), plan or build a whole dataflow, suggest connections and packages, or review your work. A change it makes, to a node's code or settings, a new node or a plan, lands at once, for everyone in the dataflow, as your own edit does. The chat shows each change as a card with **Undo**, which puts back what the change replaced:

- a node's code as it was;
- a new node taken away, with its connections;
- settings back to their old values;
- the dataflow as it was before a plan, with the nodes the plan removed and their connections.

Undo is your own change. When someone changed what it would put back after the agent did, Undo is refused, saying who, and nothing changes.

An install changes your account, so it waits for you: a package, a package draft, a dataset, a download from the Discovery Catalog or an agent added to the dataflow appears as a review card. Nothing installs until you click **Apply**, and **Dismiss** drops it.

<MediaTodo kind="clip" source="tour:agentrun" caption="An agent's chat opens from its badge on a node, a question about the node is sent, and the answer appears in the chat." />

## What agents work with

Agents build with Curio's own nodes, [functions](https://github.com/urban-toolkit/curio/blob/main/skills/node-functions/SKILL.md), catalogs and chips, as you do, and read what you made with them.

An agent uses only what you have. The code it writes reads your Data Catalog's datasets, runs the models you added and uses the keys you saved. It calls only the functions and imports only the modules its node gets. For any other model, the agent asks you to add it in the [Model Catalog](/model-catalog/).

An agent that writes code reads what the dataflow can use: its datasets and models, and the names of your Node code keys, never their values. When it writes a node's code, it also reads the node's template: its description, its starter and the functions its code can import.

An agent that reads the dataflow also sees how each node is set, such as a Data Pool's modes, a Simple View's image column, a Spatial Join's operation and each widget's value, and which nodes are tiles of the [dashboard](/dashboards/#pin-nodes). The Node Builder and the Dataflow Builder set these on the nodes they add, and change them on a node you have: ask, for example, to make a pool merge with AND, or to use *within* instead of *intersects*. The change's card names each setting as the node's own controls do, such as **Image column: overlay_url**, and the change sets the node as picking it there would.

An agent writing a node beside a [Map Editor](/scenarios/#edit-features-on-a-map) node reads its edits. Asked for a scenario of another project, the Dataflow Builder finds it in your [Scenario Catalog](/scenario-catalog/) and names it and its project for you to drag in.

A change an agent makes to a node's code is an entry named after the agent in the node's [Provenance](/provenance/) drawer, and a node an agent adds with its code starts with one. Open it to see when it was made and the code it left, and put that code back as you would a run's. The Node Builder and the Dataflow Builder read these histories, so you can ask either what changed in a node since a run.

<GuideFigure src="/media/ai-agents/agent-entry.webp" alt="The Node provenance drawer of a Python node named Years, with one entry, Node Builder" caption="The Provenance drawer of a Python node after the Node Builder changed its code: entry 1, named after the agent." :w="520" :h="190" />

## An agent at work

While an agent works on the dataflow, on a chat message, a task another agent hands it, a **Solve** or **Build & validate**, everyone with the dataflow open sees it as one more person ([Collaboration](/collaboration/#agents-in-the-dataflow)):

- The dock at the top of the canvas has a chip for it, which says who asked it, the nodes it is writing and the skills it is using, such as **Node Builder (asked by Ana), editing Map Editor, using map-edits**.
- Its cursor shows only while it drags on the canvas: a new node from its tile in the tool rail or a card in a catalog drawer, a node to a new place, or a card onto a node. Its other changes land with no cursor.
- Before it writes a node, it waits while someone else is in the node; after 30 seconds it gives up, and nothing changes. While it writes, the node shows its code or spec, or its **Widgets** tab for a widget's value, then goes back to the tab it showed.
- It does one thing at a time: a plan's nodes are dragged in one after another, then its connections land. When someone removes a node the plan joins meanwhile, the plan stops there, and its card says what was left undone.

Each change it makes is also a version in the dataflow's history, named after the agent and who asked it, such as **Node Builder, asked by Ana**.

### With the editors you invite

The editors you [invite](/collaboration/#invite-editors) work with the dataflow's agents as you do: they add and attach agents, chat and run **Solve**. You and every editor read and write the same chat of each attached agent, and a message someone else wrote shows their name above it. A reply shows in each of your tabs as it is written, a message waits its turn behind anyone's, only whoever sent a waiting message can withdraw it, and any of you can stop a reply. An editor's chats answer with your model and key, as your **API Settings** choose them, and name only the editor's own saved keys, never yours. An install an agent asks for in an editor's chat waits for you: its card reads **Waits for the dataflow's owner to review it**, and you review it in the same chat. Anyone else who opens the dataflow's link sees an agent at work in the dock, but not its badges or its chats.

## Skills

Curio's skills are the folders of its repository's [`skills/`](https://github.com/urban-toolkit/curio/tree/main/skills), each a `SKILL.md` in the [Agent Skills format](https://agentskills.io/specification), and the agents Curio ships read them. The core skills, `nodes`, `node-control` and `compatibility`, are in every call of every agent. The procedures, `reuse-first`, `data-sources`, `package-contract`, `fact-checking` and `research-notes`, are the ones agents follow by name. The skills between them are the feature skills, on Curio's nodes and a dataflow's features.

| Skill | It tells an agent how to |
|---|---|
| `nodes` | pick node types, knowing what each takes and gives |
| `node-control` | change a node's content, settings and runs as Curio allows |
| `compatibility` | connect outputs only to inputs that accept them |
| `node-functions` | call Curio's `curio_*` functions from node code |
| `catalogs` | find and load datasets, models and keys from the catalogs |
| `widgets` | declare, place and set widgets, dataset widgets and values several nodes share |
| `selection-chips` | read a view's selections through selection tags |
| `vega-lite-starter` | start a Vega-Lite chart from its node's starter spec |
| `vega-lite-maps` | draw a map with Vega-Lite |
| `autark` | write an Autark document, from the grammar Curio ships |
| `autark-starter` | start an Autark map from its node's starter document |
| `map-edits` | write a Map Editor node's call and edits, keeping filters in their own node |
| `interaction-edges` | link views with interaction edges and Data Pools |
| `scenarios` | work with scenario boxes, their chips and colors |
| `dashboards` | keep a dataflow's pinned tiles working on its dashboard |
| `provenance` | read a node's history and the agents' entries in it |
| `reuse-first` | choose a node type: a listed template, then a package to add, then a written package |
| `data-sources` | ground a data source before writing its loader: a typed path, a catalog dataset, a verified URL, a saved key, made-up data only when asked |
| `package-contract` | write a package's backend to Curio's contract |
| `fact-checking` | check a fact against what was probed or fetched, labeling each finding |
| `research-notes` | turn findings into notes on the dataflow, and place them on a note template: the built-in Note, a package to enlist, or a notes package to write |

### How a skill reaches a run

- **Always on:** every call holds the core skills.
- **Handed for what a run writes:** a run that writes or checks a node is handed the skills that serve that kind of node, such as `map-edits` for a Map Editor node, and a run that reads the whole dataflow is handed those of its nodes and features, such as `scenarios` for a dataflow with scenario boxes. A chat on a node holds the skills of that kind of node, and a chat or a mode holds the procedures it follows from its first message, such as `reuse-first` in the Node Builder's chat.
- **Loaded by the agent:** in chat, an agent lists its other skills by name and description, and loads one with its `skill.read` tool when a task matches it. A skill a chat loaded stays for the rest of its conversation.
- **Named by you:** type `/` at the start of a message to list the chat's skills, then pick one or keep typing its name, as in `/map-edits remove the two tallest towers`. The run gets the skill with your message, and the conversation keeps it.

A line under each chat reply, **Skills:**, names the skills its run held or loaded, apart from the core skills. Hover a name to see how the run got it: handed for the chat's node or instruction, named with `/` in the message, kept from earlier in the chat, or loaded for this reply.

### Add and remove skills

**View details**, on an agent's card in the Agent Catalog or beside it in the Tools panel's **Agent Catalog** dropdown, opens the agent's details. Their **Skills** section lists the skills the agent holds:

- **Add skill** gives the agent one of the skills it does not hold, which then reads **Added by you**.
- **Remove** takes a skill away.
- **Restore**, once you have changed the list, brings back the skills the agent ships with.

A change is for your account: it covers every project from the agent's next run, its chat and its modes alike. The core skills read **Every call**. A skill that the agent's chat instruction, one of its modes or a call another agent asks it for holds as its own reads **Always in chat**, **Always for** and the mode's name, or **Always when another agent asks**: the Dataset Finder's `catalogs` reads **Always for Find datasets**. Those have no **Remove**. A guest on a hosted Curio sees an agent's skills and changes none.

### Your own skills

On the **Agent Catalog** tab of the Projects page, the rail's **Skills** section lists the skills: **All skills** holds Curio's, then yours, then the published ones you have not added, and **Core** the three every call holds. **View details** on a skill shows what it serves, the agents that use it, and its text as an agent reads it.

- **Import skill**, in the page's header while the rail shows skills, takes a skill written for any Agent Skills tool: its folder, its files or a `.zip` of its folder. A review shows the skill as Curio read it: its name and description, what does not follow the format, what is left out, its files, and the agents that will use it, each ticked. Untick an agent to leave it without the skill, then click **Import**.
- A taken name is refused: that of a skill Curio ships, of a skill a package you can add ships, or of one of your skills. The review names the skill that has it; type another name and click **Check name**. A newer `version` of one of your skills, in its `metadata`, replaces that skill instead, and the button reads **Replace**.
- **Export**, in a skill's details, saves it as a `.zip` of its folder, which any Agent Skills tool reads.
- When the server allows it, **Publish**, in the drawer of a skill you imported, offers it to every account on the server. Another account gives it to an agent with **Add skill**, which keeps a copy of it in that account.
- **Remove from your skills**, in the drawer of a skill you hold, deletes it and takes it off every agent. A skill that one of your agents' instruction or modes names as its own is not removed.

A guest on a hosted Curio imports, publishes and removes no skill. To write a skill of your own, and an agent that reads it, see [Add skills and agents](/skills-and-agents/).

### Skills from packages

A node package can ship skills for its nodes, such as Scout's `scout`. Every agent on a dataflow that uses the package lists them after its own skills, and a run that writes one of the package's nodes is handed those that serve it. [Build a package](/packages/#skills-for-the-agents) shows how a package declares them.

## In chat, tools, modes and skills

Curio describes what an agent does and knows in four words:

- **In chat:** what you can ask an agent where you dropped it.
- **Tools:** the actions an agent takes during a chat, such as reading the dataflow, searching the web, adding a node or asking to install a package. A change to your dataflow lands at once, as your own edit does, and you can undo it from the chat; an install waits for your review.
- **Modes:** what another agent, Solve or the agent itself can ask it to do. A mode runs as a separate call with no tools, on evidence Curio gathers for it. You never chat with a mode.
- **Skills:** what tells an agent how to do a specific task, such as writing a Map Editor node's edits. See [Skills](#skills).

| Agent | In chat | Tools | Modes (who asks) | Skills |
|---|---|---|---|---|
| **Researcher** | Explains a node or the dataflow, diagnoses errors, helps define what to build, answers web questions as notes, checks facts | Read the dataflow and a node's last run; search and read the web; place notes as [Note nodes](/dataflows/#notes); propose a notes package | Notes from search results (Dataflow Builder); Check a fact (Node Builder, Dataset Finder, Dataflow Builder) | The feature skills, loaded in chat when a task needs one; `reuse-first`, `fact-checking` and `research-notes` from its chat's first message, and each mode is handed its own |
| **Node Builder** | Builds a node, rewrites a node's content, changes a node's settings, suggests nodes for a connection, finds or writes node types | Read the dataflow, a node's last run and its history; search the Data and Model Catalogs; add a node, write a node's content or change its settings; propose a package install or a package draft | Write a node's content (Node Builder, Dataflow Builder, Solve); Recommend packages (Dataflow Builder); Write a package (Node Builder, Researcher, Dataflow Builder) | The feature skills, loaded in chat; `reuse-first` and `data-sources` from its chat's first message; its modes are handed those of what they write and their own |
| **Dataflow Builder** | Plans a whole dataflow, then solves its nodes | Read the dataflow, runs and node histories; search the Scenario Catalog; make a plan, add a node or change a node's settings; propose a package draft; read worked examples | None | The feature skills, `reuse-first` and `data-sources`, loaded in chat |
| **Dataset Finder** | Finds datasets in the Data Catalog and in portals | Search the catalog and portals; propose a download | Find datasets (Node Builder, Dataflow Builder, Solve) | `catalogs` and `data-sources`, loaded in chat; `catalogs` handed to Find datasets |

### How an agent picks what to run

Every call to the model is the shared preamble, the skills the call holds and one instruction. A message you type goes to the agent's chat instruction, and in that same call the model decides what you asked for and which tools to use. A mode runs only when something asks for it, as a separate call.

For example, you ask the Node Builder on a node to "turn this into a bar chart":

1. Your message goes to the Node Builder's chat, which reads the node and asks for its content mode.
2. The content mode writes the chart in a separate call, with no tools, from the node and what feeds it.
3. Curio writes the chart into the node, for everyone in the dataflow, and the chat shows the change with its **Undo**.

The [Agent Catalog reference](https://github.com/urban-toolkit/curio/blob/main/docs/AGENT-CATALOG.md#the-agents) lists every agent's prompts, walks through more examples, and describes the three helpers that only have modes.
