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

Agents answer through the provider you choose in **AI Settings**, which opens from the button at the top of the Projects and catalog pages or from the Agent Catalog drawer on the canvas. Pick **OpenAI**, **Anthropic**, **Gemini**, or **Custom** for any OpenAI-compatible endpoint, such as a model you run yourself (Custom asks for a **Base URL**). Paste your API key and choose the **Model**: **Fetch models** asks the endpoint what it serves and turns the field into a list, or you can type a model name. Then click **Save**.

Your account holds one API key, so saving a key under another provider replaces it. If whoever runs the server set a default, AI Settings shows it, and a field you leave blank uses it. Guest accounts cannot save a key, and get AI only if the server provides a guest key. Curio does not bill agent runs: the provider charges whoever's key is used.

<GuideFigure src="/media/install/ai-settings.webp" alt="The AI Settings window" caption="AI Settings, with a tab for each provider, the API key and the model." :w="1280" :h="768" />

## Add an agent to a dataflow

On the canvas, open **Data > Agent Catalog**, or open the **Agent Catalog** dropdown in the Tools panel and click **Browse Agent Catalog +**. The drawer has two tabs: **Browse all**, and **In project** for the agents this dataflow has. In the catalogs, a project is one of your saved dataflows.

Click **Add to project** and confirm. An agent that relies on others says so on its button, as in **Add to project (+1 required)**, and the agents it needs are added with it. Added agents appear in the Tools panel's **Agent Catalog** dropdown.

The **Agent Catalog** tab at the top of the Projects page lists the agents for your whole account. Click one to read about it; **Add to all projects** adds it to every project you have and to new ones. **Import agent** adds one you wrote yourself.

<LoopVideo src="/media/ai-agents/agentcatalog.mp4" poster="/media/ai-agents/agentcatalog.webp" caption="Agents are found by search in the Agent Catalog drawer and added to the dataflow, then listed in the Tools panel." :w="1280" :h="768" />

## Attach it to your work

Adding an agent makes it available; attaching it puts it to work. Drag it from the **Agent Catalog** dropdown and drop it:

- on a node, to work with that node's code and output (a badge appears under the node)
- on a connection, to work with what flows between two nodes (a badge appears on the connection)
- on empty canvas, to work with the whole dataflow (it joins the bar at the top of the canvas)

An agent only accepts the targets it was made for. Each attachment has its own conversation, and one agent can be attached in several places. Once an agent is attached, the bar at the top also shows a **Goal** field: say what the dataflow is for, and the agents that read it take it into account. To detach an agent, hover its badge and click ✕, which also deletes its conversation.

<LoopVideo src="/media/ai-agents/agentattach.mp4" poster="/media/ai-agents/agentattach.webp" caption="An agent is dropped on a node, another on the connection between two nodes and a third on empty canvas, and each drop is confirmed." :w="1280" :h="768" />

## Chat and review changes

Click a badge to open the agent's chat. The header says what the agent is attached to, the arrows step through your attached agents, and you can rename or clear the conversation. The first message is the agent's instruction, which the pencil lets you edit. Type in **Message this agent…** and send.

What an agent does depends on the agent: explain or debug a node, write node code, find datasets (including in the [data lakes](/data-lakes/)), plan or build a whole dataflow, suggest connections and packages, or review your work. Proposed changes, such as new nodes, connections, code or packages, appear as cards in the chat. Nothing changes until you click **Apply**, and **Dismiss** drops a proposal.

<MediaTodo kind="clip" source="tour:agentrun" caption="An agent's chat opens from its badge on a node, a question about the node is sent, and the answer appears in the chat." />
