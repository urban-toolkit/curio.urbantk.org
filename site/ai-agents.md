---
title: "AI agents"
description: "Attach AI agents to a node, a connection or the whole canvas, and choose the model they use."
group: using
order: 90
card: { poster: /media/ai-agents/agentattach.webp, alt: "Agents attached to a dataflow" }
app: /catalog/agents
deeper:
  - { doc: docs/AGENT-CATALOG.md, label: "Agent Catalog reference" }
  - { doc: docs/USAGE.md, anchor: llm-configurations, label: "Configuring the AI provider" }
---

# AI agents

Agents are AI assistants you attach to a node, a connection between two nodes, or the whole canvas, to chat about that part of your dataflow. When an agent suggests a change, nothing happens until you apply it.

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

## Chat and review changes

Click a badge to open the agent's chat. The header says what the agent is attached to, the arrows step through your attached agents, and you can rename or clear the conversation. The first message is the agent's instruction, which the pencil lets you edit. Type in **Message this agent…** and send.

What an agent does depends on the agent: explain or debug a node, write node code, find datasets (including in the open data portals of the [Discovery Catalog](/discovery/)), plan or build a whole dataflow, suggest connections and packages, or review your work. Proposed changes, such as new nodes, connections, code, settings or packages, appear as cards in the chat. Nothing changes until you click **Apply**, and **Dismiss** drops a proposal.

<MediaTodo kind="clip" source="tour:agentrun" caption="An agent's chat opens from its badge on a node, a question about the node is sent, and the answer appears in the chat." />

## What agents work with

Agents build with Curio's own nodes, [functions](https://github.com/urban-toolkit/curio/blob/main/skills/node-functions/SKILL.md), catalogs and chips, as you do, and read what you made with them.

An agent uses only what you have. The code it writes reads your Data Catalog's datasets, runs the models you added and uses the keys you saved. It calls only the functions and imports only the modules its node gets. For any other model, the agent asks you to add it in the [Model Catalog](/model-catalog/).

An agent that writes code reads what the dataflow can use: its datasets and models, and the names of your Node code keys, never their values. When it writes a node's code, it also reads the node's template: its description, its starter and the functions its code can import.

An agent that reads the dataflow also sees how each node is set, such as a Data Pool's modes, a Simple View's image column, a Spatial Join's operation and each widget's value, and which nodes are tiles of the [dashboard](/dashboards/#pin-nodes). The Node Builder and the Dataflow Builder set these on the nodes they add, and change them on a node you have: ask, for example, to make a pool merge with AND, or to use *within* instead of *intersects*. The review card names each change as the node's own controls do, such as **Image column: overlay_url**, and applying it changes the node as picking it there would.

An agent writing a node beside a [Map Editor](/scenarios/#edit-features-on-a-map) node reads its edits. Asked for a scenario of another project, the Dataflow Builder finds it in your [Scenario Catalog](/scenario-catalog/) and names it and its project for you to drag in.

Once you apply a change an agent made to a node's code, it is an entry named after the agent in the node's [Provenance](/provenance/) drawer, and a node an agent adds with its code starts with one. Open it to see when it was made and the code it left, and put that code back as you would a run's. The Node Builder and the Dataflow Builder read these histories as the dataflow was last saved, so you can ask either what changed in a node since a run.

<GuideFigure src="/media/ai-agents/agent-entry.webp" alt="The Node provenance drawer of a Python node named Years, with one entry, Node Builder" caption="The Provenance drawer of a Python node after a change the Node Builder made to its code was applied: entry 1, named after the agent." :w="520" :h="190" />

## In chat, tools and modes

Curio describes what an agent does in three words:

- **In chat:** what you can ask an agent where you dropped it.
- **Tools:** the actions an agent takes during a chat, such as reading the dataflow, searching the web, proposing a node or proposing a package install. Anything that changes your dataflow is a proposal you apply.
- **Modes:** what another agent, Solve or the agent itself can ask it to do. A mode runs as a separate call with no tools, on evidence Curio gathers for it. You never chat with a mode.

| Agent | In chat | Tools | Modes (who asks) |
|---|---|---|---|
| **Researcher** | Explains a node or the dataflow, diagnoses errors, helps define what to build, answers web questions as notes, checks facts | Read the dataflow and a node's last run; search and read the web; propose notes as [Note nodes](/dataflows/#notes); propose a notes package | Notes from search results (Dataflow Builder); Check a fact (Node Builder, Dataset Finder, Dataflow Builder) |
| **Node Builder** | Builds a node, rewrites a node's content, changes a node's settings, suggests nodes for a connection, finds or writes node types | Read the dataflow, a node's last run and its history; search the Data and Model Catalogs; propose a node, a content change, a settings change, a package install or a package draft | Write a node's content (Node Builder, Dataflow Builder, Solve); Recommend packages (Dataflow Builder); Write a package (Node Builder, Researcher, Dataflow Builder) |
| **Dataflow Builder** | Plans a whole dataflow, then solves its nodes | Read the dataflow, runs and node histories; search the Scenario Catalog; propose a plan, a node, a settings change or a package draft; read worked examples | None |
| **Dataset Finder** | Finds datasets in the Data Catalog and in portals | Search the catalog and portals; propose a download | Find datasets (Node Builder, Dataflow Builder, Solve) |

### How an agent picks what to run

Every call to the model is the shared preamble plus one instruction. A message you type goes to the agent's chat instruction, and in that same call the model decides what you asked for and which tools to use. A mode runs only when something asks for it, as a separate call.

For example, you ask the Node Builder on a node to "turn this into a bar chart":

1. Your message goes to the Node Builder's chat, which reads the node and asks for its content mode.
2. The content mode writes the chart in a separate call, with no tools, from the node and what feeds it.
3. The chat shows the change as a review card. The node changes when you apply it.

The [Agent Catalog reference](https://github.com/urban-toolkit/curio/blob/main/docs/AGENT-CATALOG.md#the-agents) lists every agent's prompts, walks through more examples, and describes the three helpers that only have modes.
