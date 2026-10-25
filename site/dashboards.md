---
title: "Dashboards and sharing"
description: "Pin nodes to a dashboard page, share it with a link, or share the dataflow itself."
group: using
order: 100
card: { poster: /media/dashboards/dashboard.webp, alt: "A dashboard with two charts" }
deeper:
  - { doc: docs/USAGE.md, anchor: dashboards, label: "Dashboards in the usage guide" }
---

# Dashboards and sharing

Every dataflow has a dashboard: a page of its own that shows only the nodes you pin, ready to present. Share its link and people see your charts and maps and can try other values of the controls you pin, or share the dataflow's link so they can open the whole canvas.

## Pin nodes

Each node has a small circle labelled **Pin to dashboard** among the buttons in its header, which show while the pointer is over the node. Click it on the charts and maps you want to show, and it turns into a red dot; click it again (**Unpin from dashboard**) to take the node off. Pinning also means the data behind those nodes is saved to your [Data Catalog](/data-catalog/) when the dataflow runs, and that saved data is what the dashboard draws.

After pinning, run the dataflow and save it. The dashboard shows the last saved version: save again whenever you change pins or rerun nodes.

[Agents](/ai-agents/) know which nodes are tiles, so you can ask one whether a chart is on the dashboard; only you pin and unpin. A specification an agent writes for a pinned Autark map is sent back when it loads data of its own, and the agent loads that data in a node before the map instead. An agent's Solve stops on such a map, says why and leaves it to you. The review card of a plan that removes pinned nodes marks each as a **dashboard tile** and says how many leave the dashboard.

## Open the dashboard

On the canvas, choose **Share > Open dashboard**. The dashboard opens in a new tab at an address of its own, and its tiles draw from the saved outputs, with nothing to press. A tile whose nodes have no saved output runs them when the page opens, and says **Computing...** until its results are ready. **Open dataflow**, at the top, takes you back to the canvas.

As the owner, click **Edit layout** to move tiles by their title bar and resize them, then **Save layout**. This arranges the dashboard only: nodes keep their places on the canvas. If nothing is pinned yet, the page says so and links back to the dataflow.

A map made with Autark draws in the viewer's own browser, so it needs a browser with WebGPU. Text that a code node prints is not shown on the dashboard.

## Try other values

Anyone viewing the dashboard can change its pinned controls: the value of a pinned Parameter node, and the widgets of a pinned node that shows them. Text, text list and file widgets keep their saved value.

- A change runs again on its own once you stop changing it; there is no Run button. The nodes it reaches run on the server with the owner's data, models and packages, and none of the owner's keys, and the tiles below show the result.
- A viewer never changes the dataflow or the owner's Data Catalog, and putting a value back shows the saved results again.
- What such a run makes is kept for 7 days, so the next viewer who picks the same values sees it at once.
- A node that only a browser runs, such as an Autark computation on the GPU, runs in each viewer's own browser.

<LoopVideo src="/media/dashboards/dashboard.mp4" poster="/media/dashboards/dashboard.webp" label="Two charts are pinned and the dataflow is saved, then the dashboard opens and draws both charts without running anything." :w="1280" :h="768" />

## Share a link

The **Share** menu offers two links, and both need the dataflow to be saved first:

- **Copy dashboard link** copies the dashboard's address. Visitors see the pinned tiles and can change the pinned controls, with no account.
- **Copy dataflow link** copies the canvas address. Visitors see the whole dataflow, read-only, and **File > Save dataflow** saves a copy, with its saved results, to their own workspace.

Anyone who can sign in to that Curio server can open a dataflow link. If the server allows guests, the sign-in page also offers **Continue as Guest**. The dashboard has the same **Share** menu, with both links.

To edit a dataflow with other people at the same time, see [Collaboration](/collaboration/).

<GuideFigure src="/media/dashboards/share-menu.webp" alt="The Share menu on the canvas" caption="The Share menu on the canvas, with Open dashboard, Copy dashboard link and Copy dataflow link." :w="1280" :h="768" />
