---
title: "Contribute"
description: "Set up a development copy of Curio, run its tests, find your way around the repository, and open a pull request."
group: extending
order: 30
deeper:
  - { doc: docs/CONTRIBUTING.md, label: "Contributing to Curio" }
  - { doc: docs/CONTRIBUTING.md, anchor: running-tests, label: "Running tests" }
  - { doc: docs/ARCHITECTURE.md, label: "System architecture" }
  - { doc: docs/ONBOARDING.md, label: "Onboarding for students" }
---

# Contribute

Curio is developed in the open on GitHub, and changes arrive as pull requests against its `main` branch. This page covers a development setup, the tests, the layout of the repository and the pull request itself. Students joining the project start with the onboarding document, and the architecture document explains how the pieces fit together.

## Set up a development copy

Fork the repository on GitHub, clone your fork, and add the original as a second remote so you can keep up with it. Work in a fresh environment, such as a conda one, with the Python version that `pyproject.toml` requires and the Node.js version pinned in `.nvmrc`; Curio refuses to start on an older Node.js.

```bash
git clone https://github.com/<your-account>/curio.git
cd curio
git remote add upstream https://github.com/urban-toolkit/curio.git
pip install -r requirements.txt
python curio.py start --dev
```

`--dev` serves the web app from the webpack dev server, so frontend edits reload as you save. Without it, Curio serves the built bundle, which needs a rebuild before frontend changes show. The first start installs dependencies and takes a while; later starts are quick. On Windows, use Git Bash or WSL.

## Run the tests

`python curio.py test` starts the servers, runs the backend, sandbox, Jest and Playwright end-to-end suites, and shuts everything down. It first deletes the checkout's `.curio/` folder, where local projects and data live, along with the frontend's installed modules and build, so keep work you care about in another clone. `--use-existing` skips that cleanup and uses servers that are already running.

```bash
python curio.py test                                  # every suite
python curio.py test unit --use-existing              # backend, sandbox and Jest
python curio.py test e2e --headed --workflows Vega.json
```

A suite also runs on its own: `backend`, `sandbox`, `jest` or `e2e`. The end-to-end tests need a browser installed once with `playwright install chromium`. Backend tests refuse outbound network connections, so a test that talks to a third party should use a fake transport. A change to a database model needs an Alembic migration; the contributing guide has the commands.

## The repository at a glance

- `utk_curio/backend/`: the Flask API for accounts, projects, the catalogs and node runs, with its tests, including the Playwright suite, in `tests/`.
- `utk_curio/sandbox/`: the process that runs node code, with its tests.
- `utk_curio/frontend/urban-workflows/`: the React and TypeScript app, with Jest tests in `src/tests/`.
- `packages/`, `datasets/`, `discovery/` and `models/`: the node packages, datasets, Discovery Catalog sources and models an install ships with.
- `docs/`: the in-depth guides, the schemas, and the example dataflows the tests load.
- `scripts/`: the test runner and helpers such as the package scaffold.
- `curio.py`: the launcher.

The architecture document describes the three servers, how nodes are declared and rendered, how data moves between nodes, and how a node run is executed. The onboarding document, written for students, lists the tools to install, a first-week task list, and answers to common setup errors.

## Open a pull request

Create a branch in your fork, keep each pull request to one feature, one fix or one set of related documentation changes, and open it against `main` in `urban-toolkit/curio`. The template asks what changed, which issue it resolves, which parts of Curio it touches and whether `python curio.py test` passed, and it asks you to load the example dataflows in `docs/examples/dataflows/` and run their nodes. A pull request that changes code also runs the full stack in continuous integration. To report a bug instead, open an issue with the steps to reproduce it, what you expected, what happened, and your environment.
