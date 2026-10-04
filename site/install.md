---
title: "Install"
description: "Run Curio on your own computer with pip or Docker, learn its main commands, and set up the AI features."
group: getting-started
order: 30
deeper:
  - { doc: docs/USAGE.md, anchor: installation-from-pip, label: "Installing from pip" }
  - { doc: docs/USAGE.md, anchor: installation-from-git, label: "Installing from git, with Docker or by hand" }
  - { doc: docs/USAGE.md, anchor: llm-configurations, label: "AI provider settings" }
  - { doc: docs/AGENT-CATALOG.md, anchor: operator-notes, label: "AI provider flags and variables" }
---

# Install

On your own computer, Curio runs as three servers: a backend that stores projects, a sandbox that runs node code, and the web app you open in your browser. You can install it with pip or run it in Docker, on Windows, macOS or Linux. A local Curio signs you in automatically, as a single shared guest user, and opens on the projects page.

## Install with pip

Create a fresh Python environment (with conda, for example) with the Python version Curio supports; the installation guide linked at the end of this page names it. Then install and start Curio:

```bash
pip install utk-curio
curio start
```

`curio start` first installs the Python libraries the built-in nodes use, so the first start takes a few minutes. When the servers are up, open `http://localhost:8080`; press Ctrl+C in the terminal to stop them. Start Curio from the same folder each time: it keeps its working files in a `.curio` folder there, and relative file paths in node code start from there too.

Nodes that run JavaScript, such as **JS Computation**, use the Node.js installed on your computer. Curio starts without Node.js, but if the installed one is too old it stops and says which version to install.

## Run it with Docker

With Docker installed, clone the repository and start the stack:

```bash
git clone https://github.com/urban-toolkit/curio.git
cd curio
docker compose up
```

The first run builds the image, which takes a while; `docker compose up --build` rebuilds it after you update the clone. Then open `http://localhost:8080`. The image includes everything Curio needs, Node.js too, and Curio starts with the example dataflows on the projects page.

To change Curio itself, run it from a clone with `python curio.py start` instead (see [Contribute](/contributing/)).

## Commands and flags

`curio --help` lists every command and flag. The ones you are most likely to use:

- `curio start` starts all three servers; `curio start backend`, `sandbox` or `frontend` starts just one.
- `curio setup` installs the Python libraries Curio and its node packages need, then exits.
- `--no-project` skips the projects page and opens the canvas directly, for demos.
- `--deploy` turns on accounts and the sign-in page, for a shared server. It needs a host that can isolate each user's node code, such as the Docker image, and refuses to start on one that cannot (see [Run your own server](/self-hosting/)).
- `--collab` turns on real-time co-editing, which is experimental (see [Collaboration](/collaboration/)).
- `--frontend-port`, `--backend-port` and `--sandbox-port` move the servers off ports 8080, 5002 and 2000.

## Set up the AI features

Curio ships with no AI provider. Its agents, node-authoring assistants and chat answer through an LLM configuration you set up, and Curio sets no spending limit: the provider bills the key's owner.

To add a configuration:

1. **Get an API key** from the provider: [OpenAI](https://platform.openai.com/api-keys), [Anthropic](https://console.anthropic.com/keys) or [Gemini](https://aistudio.google.com/apikey). A model you run yourself, such as one in Ollama or LM Studio, may need no key.
2. **Open API Settings** from the top bar. On the Projects and catalog pages it opens the settings page; on the canvas and the dashboard it opens as a drawer on the right.
3. On the **API keys** tab, click **Add configuration**.
4. In **Kind**, choose **Language model**.
5. Give it a **Label**, and pick the **Provider**: **OpenAI**, **Anthropic**, **Gemini**, or **Custom** for any OpenAI-compatible endpoint (Custom asks for a **Base URL**).
6. Paste the **API key**, and choose the **Model**: **Fetch models** suggests what the endpoint serves, or type a model name.
7. Click **Add configuration**. The configuration shows in the list, with **saved** in its **Key** column when you gave a key.

On a local Curio you are the shared guest, and everyone using that Curio shares the configurations you save. [AI agents](/ai-agents/) covers the rest.

You can instead name a default provider when you start Curio: the key in an environment variable, the provider and model as flags.

```bash
export CURIO_DEFAULT_LLM_API_KEY="your-api-key"
curio start --llm-provider anthropic --llm-model "model-name"
```

`--llm-provider` is `anthropic`, `gemini` or `openai_compatible`, the default, which covers OpenAI and, with `--llm-base-url`, any OpenAI-compatible server such as Ollama or LM Studio. A keyless server still needs a placeholder value in the variable. With Docker, put the same settings in `utk_curio/backend/.env` as `CURIO_DEFAULT_LLM_API_TYPE`, `CURIO_DEFAULT_LLM_MODEL`, `CURIO_DEFAULT_LLM_BASE_URL` and `CURIO_DEFAULT_LLM_API_KEY`, then rebuild with `docker compose up --build`.

On the hosted instance, or on a server started with `--deploy`, each account adds its own configurations in **API Settings**, and a guest answers with the server's guest configuration.
