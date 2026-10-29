---
title: "Add skills and agents"
description: "Write a skill in the Agent Skills format and an agent's manifest, import both, and connect them so the agent reads the skill."
group: extending
order: 25
app: /catalog/agents
deeper:
  - { doc: docs/AGENT-CATALOG.md, anchor: add-skills-and-agents, label: "Add skills and agents, step by step" }
  - { doc: docs/EXTENDING.md, anchor: 9-writing-a-skill, label: "Writing a skill" }
  - { doc: docs/AGENT-CATALOG.md, anchor: 6-the-manifest, label: "The agent manifest" }
  - { doc: docs/AGENT-CATALOG.md, anchor: skills, label: "How agents hold and load skills" }
---

# Add skills and agents

A skill tells an agent how to do a specific task, and an agent is an autonomous runtime with a goal, its own tools and model, and a memory ([AI agents](/ai-agents/)). You can write both: a skill in the open [Agent Skills format](https://agentskills.io/specification), which other Agent Skills tools read too, and an agent as a manifest and its prompt files. Import both and connect them, and the agent's chat loads the skill when a task needs it.

The example on this page is in Curio's repository: the skill [`street-trees`](https://github.com/urban-toolkit/curio/tree/main/docs/examples/skills/street-trees), which tells an agent how to count and map a city's street trees from its tree census, and the agent **Tree Counter**, [`agent.you.tree-counter@1`](https://github.com/urban-toolkit/curio/tree/main/docs/examples/agents/agent.you.tree-counter@1), whose manifest names the skill.

## Write a skill

A skill is a folder named as the skill, holding a `SKILL.md`: YAML frontmatter between two `---` lines, then the body, the Markdown an agent reads. The start of street-trees' `SKILL.md`:

```markdown
---
name: street-trees
description: "Use this skill when: a dataflow counts or maps the city's street trees"
metadata:
  author: parks-team
---
## Street trees

A city's street tree census lists its street trees, one row a tree: where the tree stands, its species, the size of its trunk and how it is doing. This skill tells you how to count those trees and map them in a dataflow.
```

The frontmatter holds the format's fields:

- `name`: the folder's name, 1 to 64 lowercase letters, digits and hyphens, with no hyphen first or last and none twice in a row.
- `description`: when to use the skill, in 1 to 1,024 characters. An agent reads the description before it loads the skill, so start it with "Use this skill when" and name the task in the words a user uses for it.
- `license`, `compatibility` (at most 500 characters) and `metadata`, which are optional. `metadata` holds strings by string keys, such as `author`, and a `version` quoted so YAML reads it as a string.

A value that holds `: ` or ` #` goes in quotes, as street-trees' description does.

The body holds the instructions an agent follows, such as street-trees' "Count the living trees only, unless the user asks for stumps or dead trees too". Keep `SKILL.md` under 500 lines. A file the body links sits one level below the folder, as street-trees' [`references/species.md`](https://github.com/urban-toolkit/curio/blob/main/docs/examples/skills/street-trees/references/species.md) does with the species a census may name, and a chat reads it when the body says to.

To check a skill against the format, install the format's reference validator with `pip install skills-ref==0.1.1` and run `agentskills validate` on the skill's folder.

## Write an agent

An agent is a folder named `<agentId>@<major>`, the major of its version, holding its `manifest.json` and, in `prompts/`, its prompt files. Its id is `agent.`, you as its publisher and its name, so Tree Counter's folder is `agent.you.tree-counter@1`:

```json
{
  "id": "agent.you.tree-counter",
  "name": "Tree Counter",
  "category": "canvas",
  "version": "1.0.0",
  "purpose": "Count and map a city's street trees from its tree census, by block, neighborhood or species.",
  "skills": ["street-trees"],
  "capabilities": [{ "id": "trees.count", "contractVersion": "1" }],
  "prompts": {
    "system": { "path": "curio:default_preamble.md", "variables": [] },
    "instruction": { "path": "prompts/instruction.md", "variables": [] }
  },
  "compatibleTargets": [{ "kind": "canvas", "requires": [] }],
  "tools": [{ "id": "dataflow.read" }, { "id": "catalog.search" }, { "id": "node.create" }],
  "provenance": { "publisher": "you", "trust": "imported" }
}
```

- `name`, `purpose` and `category` are what the Agent Catalog shows. The category says what the agent acts on: `node`, `canvas` for the whole dataflow, `data`, `package` or `evaluate`.
- `prompts`: `system` names the preamble, here `curio:default_preamble.md`, the one Curio's own agents read, which holds the core skills and takes no file. `instruction` is the agent's instruction, its goal: Tree Counter's tells it to read the dataflow first, to search the Data Catalog when no node loads a census, and to load the street-trees skill before it writes a node's code.
- `tools`: what its chat can do. Tree Counter reads the dataflow, searches the Data Catalog and proposes nodes. A chat that lists skills holds `skill.read` without naming it here. [`tools.md`](https://github.com/urban-toolkit/curio/blob/main/agents/agent.curio.builtin@1/tools.md) describes every tool Curio gives agents.
- `skills`: the skills it holds, by name, Curio's and your own. Without this field, the agent holds every skill Curio ships and none of yours; with an empty list, none.
- `capabilities`: what the agent does, as ids such as `trees.count`. Curio finds the agent for each of its own tasks by its capability, never by its name, so an agent of yours that declares what one of Curio's agents does is picked where that agent would be.
- `compatibleTargets`: where it attaches, `node`, `connection` or `canvas`.

## Connect them

1. **Import the skill.** On the **Agent Catalog** tab of the Projects page, click **All skills** in the rail, then **Import skill**, and pick the skill's folder, its files or a `.zip` of its folder. The review shows the skill as Curio read it, its files, and the agents that will use it, each ticked. Untick each agent that should go without it, then click **Import**.
2. **Import the agent.** Click **All agents** in the rail, then **Import agent** in the header, and pick its `manifest.json` and its prompt files. The Agent Catalog drawer on the canvas has **Import agent** in its footer too.
3. **Chat with it.** [Add the agent to a dataflow](/ai-agents/#add-an-agent-to-a-dataflow), drop it on empty canvas, and ask, for example, how many living trees each neighborhood has. Its chat lists the skill, loads it with `skill.read` when your message asks for its task, and the line under the reply names it.

An agent holds a skill in three ways: its manifest names the skill in `skills`, as Tree Counter's names `street-trees`; the skill's import review left the agent ticked; or **Add skill** in the agent's details gave it the skill. So one of Curio's agents, such as the Node Builder, can use your skill too ([Add and remove skills](/ai-agents/#add-and-remove-skills)).

A skill the instruction names in its own `skills`, `prompts.instruction.skills`, is in the chat from its first message, with no `skill.read`.

## Share them

**Export**, in a skill's details, saves the skill as a `.zip` of its folder, which any Agent Skills tool reads. When the server allows it, **Publish** offers a skill or an agent you imported to every account on the server ([Your own skills](/ai-agents/#your-own-skills)).

## Skills in a package

A node package can ship skills for its nodes in its own `skills/`, in the same format, and every agent on a dataflow that uses the package reads them ([Build a package](/packages/#skills-for-the-agents)).

## In Curio's repository

Curio's own skills are the folders of [`skills/`](https://github.com/urban-toolkit/curio/tree/main/skills), in the same format, and its agents are the folders of [`agents/`](https://github.com/urban-toolkit/curio/tree/main/agents), each read as an imported agent is. A skill added there reaches the agents whose manifests name it in `skills`. The backend checks every skill against the format when it starts, and a skill that breaks the format stops the start, naming its file.
