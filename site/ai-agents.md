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

Agents answer with an **LLM configuration**: a provider, its key and a model, which you set up in **API Settings**. **API Settings** is in the top bar: on the Projects and catalog pages it opens the settings page, and on the canvas it opens on the right, with your dataflow still open. It has two tabs, **API keys** and **Agent configuration**.

1. On the **API keys** tab, click **Add configuration**.
2. In **Kind**, choose **Language model**.
3. Give it a **Label**, and pick the **Provider**: **OpenAI**, **Anthropic**, **Gemini**, or **Custom** for any OpenAI-compatible endpoint, such as a model you run yourself (Custom asks for a **Base URL**).
4. Paste the **API key**, and choose the **Model**: **Fetch models** suggests what the endpoint serves, or type a model name.
5. Click **Add configuration**. The configuration shows in the list with **saved** in its **Key** column, and your first configuration is your default.

You can keep several configurations, for different providers or models. On the **Agent configuration** tab, **Default for agents** picks your default, and **Agent models** picks which one each agent runs on; an agent left on **Default** uses your default. If whoever runs the server set a Deployment default, it is offered too. On a server started with `--deploy`, guest accounts cannot add a configuration and answer with the server's guest configuration. Curio does not bill agent runs: the provider charges whoever's key is used.

<MediaTodo kind="still" source="new:apisettings" caption="API Settings: every key in one list on the API keys tab, and the model each agent runs on under Agent configuration." />

## Add an agent to a dataflow

On the canvas, click **Agent Catalog** in the top bar, or open the **Agent Catalog** dropdown in the Tools panel and click **Browse Agent Catalog +**. The drawer has two tabs: **Browse all**, and **In project** for the agents this dataflow has. In the catalogs, a project is one of your saved dataflows.

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

What an agent does depends on the agent: explain or debug a node, write node code, find datasets (including in the open data portals of the [Discovery Catalog](/discovery/)), plan or build a whole dataflow, suggest connections and packages, or review your work. Proposed changes, such as new nodes, connections, code or packages, appear as cards in the chat. Nothing changes until you click **Apply**, and **Dismiss** drops a proposal.

<MediaTodo kind="clip" source="tour:agentrun" caption="An agent's chat opens from its badge on a node, a question about the node is sent, and the answer appears in the chat." />
