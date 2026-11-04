---
title: "Skill Catalog"
description: "The skills Curio's agents read, Curio's own, yours and those of packages: what each tells an agent, the agents that use it, and importing, exporting and publishing your own."
group: using
order: 95
app: /catalog/skills
deeper:
  - { doc: docs/SKILL-CATALOG.md, label: "Skill Catalog reference" }
  - { doc: docs/SKILL-CATALOG.md, anchor: 4-your-own-skills, label: "Your own skills" }
  - { doc: docs/EXTENDING.md, anchor: 9-writing-a-skill, label: "Writing a skill" }
---

# Skill Catalog

A skill tells an [agent](/ai-agents/) how to do a specific task, such as writing a Map Editor node's edits: instructions, procedural knowledge, reference facts and starter templates, in a `SKILL.md` file in the [Agent Skills format](https://agentskills.io/specification). A skill does nothing on its own: an agent reads it when a task needs it, and one skill serves many agents. The Skill Catalog lists the skills your agents can read: the ones Curio ships, your own, the published ones you can add, and those of the packages you can add.

## Browse the skills

Open **Skill Catalog** in the top bar of the Projects page. In the rail, **All skills** lists every skill and **Core** the three every call holds. Each card says whose the skill is. Click a card for its drawer: what the skill serves, the agents that use it and where it comes from. **View details** adds its text as an agent reads it, and its files.

Which skills an agent holds is part of the agent. Its details in the Agent Catalog list them, with **Add skill**, **Remove** and **Restore** ([Add and remove skills](/ai-agents/#add-and-remove-skills)), and a skill's name there opens that skill's details.

## The skills Curio ships

Curio's skills are the folders of its repository's [`skills/`](https://github.com/urban-toolkit/curio/tree/main/skills), and the agents Curio ships read them. The core skills, `nodes`, `node-control` and `compatibility`, are in every call of every agent. The procedures, `reuse-first`, `data-sources`, `package-contract`, `fact-checking` and `research-notes`, are the ones agents follow by name. The skills between them are the feature skills, on Curio's nodes and a dataflow's features.

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
| `scenarios` | work with scenario sets, each scenario's scenario-specific nodes, shared context and shared outcomes, and the chips and colors that compare them |
| `dashboards` | keep a dataflow's pinned tiles working on its dashboard |
| `provenance` | read a node's history and the agents' entries in it |
| `reuse-first` | choose a node type: a listed template, then a package to add, then a written package |
| `data-sources` | ground a data source before writing its loader: a typed path, a catalog dataset, a verified URL, a saved key, made-up data only when asked |
| `package-contract` | write a package's backend to Curio's contract |
| `fact-checking` | check a fact against what was probed or fetched, labeling each finding |
| `research-notes` | turn findings into notes on the dataflow, and place them on a note template: the built-in Note, a package to enlist, or a notes package to write |

## Your own skills

- **Import skill**, in the page's header, takes a skill written for any Agent Skills tool: its folder, its files or a `.zip` of its folder. A review shows the skill as Curio read it: its name and description, what does not follow the format, what is left out, its files, and the agents that will use it, each ticked. Untick an agent to leave it without the skill, then click **Import**.
- A taken name is refused: that of a skill Curio ships, of a skill a package you can add ships, or of one of your skills. The review names the skill that has it; type another name and click **Check name**. A newer `version` of one of your skills, in its `metadata`, replaces that skill instead, and the button reads **Replace**.
- **Export**, in a skill's details, saves it as a `.zip` of its folder, which any Agent Skills tool reads.
- When the server allows it, **Publish**, in the drawer of a skill you imported, offers it to every account on the server. Another account gives it to an agent with **Add skill**, which keeps a copy of it in that account.
- **Remove from your skills**, in the drawer of a skill you hold, deletes it and takes it off every agent. A skill that one of your agents' instruction or modes names as its own is not removed.

A guest on a hosted Curio imports, publishes and removes no skill. To write a skill of your own, and an agent that reads it, see [Add skills and agents](/skills-and-agents/).

## Skills from packages

A node package can ship skills for its nodes, such as Rasterization's `rasterization` and the Vega-Lite package's `vega-lite-charts`. The Skill Catalog lists them with their package, as **From Rasterization**, and names as their users the agents on a dataflow that uses the package. Every agent on such a dataflow lists them after its own skills, and a run that writes one of the package's nodes is handed those that serve it. A package's skills come and go with the package, so they have no **Remove**, **Publish** or **Export**, and **Add skill** does not offer them. [Build a package](/packages/#skills-for-the-agents) shows how a package declares them.
