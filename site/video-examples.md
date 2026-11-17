---
title: "Video and camera examples"
description: "Objects SAM 3 tracks along a sidewalk walk, the walk's frames and blocks, and three SAGE cameras at rail crossings, read where they are stored on data.urbantk.org."
group: using
order: 48
deeper:
  - { doc: docs/examples/31-sideseeing-objects-along-a-walk.md, label: "Example 31: SideSeeing objects tracked along a walk" }
  - { doc: docs/examples/32-sage-idot-rail-crossings.md, label: "Example 32: SAGE-IDOT rail crossings" }
  - { doc: docs/examples/33-sideseeing-frames-segments-blocks.md, label: "Example 33: SideSeeing frames, segments and blocks" }
  - { doc: packages/model.curio.sam3@1/README.md, label: "SAM 3 and its two nodes" }
  - { doc: packages/curio.media@1/README.md, label: "The Media package's nodes" }
  - { doc: docs/DISCOVERY-CATALOG.md, anchor: adding-from-a-storage-source, label: "Adding from a storage source, read in place or cached" }
  - { doc: docs/USAGE.md, anchor: linking-charts, label: "Linking charts, and a video's player" }
  - { doc: docs/README.md, anchor: examples, label: "Example gallery" }
---

# Video and camera examples

Three examples turn what cameras record into data you can map and chart. Two follow a walk along the sidewalks of Chicago's West Loop, recorded with the SideSeeing app on a phone looking down at the sidewalk: 14 minutes of video, faces and license plates blurred, and its GPS track. The third follows three SAGE cameras at rail crossings of the Illinois Department of Transportation (IDOT). Their videos, snapshots and detections stay in buckets on data.urbantk.org, which the [Discovery Catalog](/discovery/#add-from-storage) lists: a Curio server that mounts buckets reads them in place, and elsewhere **Cache files** copies them first.

## Find them

The three dataflows are in the examples every account starts with, under **Examples** in **By source** on the [projects page](/projects-and-files/#the-projects-page): "SideSeeing: objects tracked along a walk" (example 31), "SAGE-IDOT rail crossings" (example 32) and "SideSeeing: frames, segments and blocks" (example 33). The **Computer vision** tag in the rail lists the two that run SAM 3, and the **Video** data type the two walks.

## Objects along a walk

Example 31 runs **Track Objects**, a node of SAM 3 in the [Model Catalog](/model-catalog/), on the whole walk. It looks for nine kinds of sidewalk object in a frame every 2.5 seconds and follows each from frame to frame, and **Simple View** plays the overlay it draws. The player is linked to two views, as [Follow a video as it plays](/interactions/#follow-a-video-as-it-plays) describes:

- on a swimlane, each object's bar takes its label's color once the video passes the moment SAM 3 first saw it;
- on an Autark map of the West Loop's streets, the walk's GPS fixes up to where the video stands take Autark's highlight color.

Tracking the whole walk takes about three and a half minutes on a GPU. The first run downloads SAM 3's weights, 3.4 GB.

## Frames, segments and blocks

Example 33 reads the same walk a frame at a time:

- **Sample Video Frames** takes a frame every 2 seconds, and **Segment Images** finds in each frame what 9 labels name with SAM 3. Simple View shows each frame beside its overlay, and a Vega-Lite chart the mean share of a frame each label covers.
- Each frame is placed on the walk through its GPS track, on an Autark map of the West Loop's streets.
- **Split Video** cuts the walk into blocks at the street corners it passes ([Collections](/data-catalog/#collections)). Simple View plays each block, linked to the map, and a chart gives each block's share of frames that show each label.

On a GPU, the walk's 433 frames take about 3 minutes.

## Rail crossings seen by three SAGE cameras

Example 32 reads three SAGE nodes at IDOT rail crossings, W042, W065 and W06E. Each camera takes a snapshot every 5 minutes and runs three YOLO models on a new image about every 3 seconds. For each camera, the example reads the day the Cities in Motion workshop team studied out of its month of detections, and that day's snapshots:

- It places every object a model saw on the ground, at the bottom middle of its box, through the camera's homography, and averages the chosen model's confidence on cells of 2 m, which an Autark map draws with the zones: the lanes before and after the crossing.
- **Zone occupancy** counts the objects in each zone per image, per 100 square metres, minute by minute, against night, twilight and day at the camera's place and date.
- **Frames** draws up to six snapshots of a half hour with the zones and the chosen model's boxes, and each caption gives every model's count.
- **Boxes by model** and **Agreement** compare the three models with YOLO26n, which the team ran on the snapshots.

Its [dashboard](/dashboards/) shows eight tiles. A viewer picks the camera, the model, the classes, the lowest confidence and the half hour of frames, and the tiles that choice reaches run again on the server.

The records and snapshots are SAGE's. The control points, the zones and the YOLO26n boxes are the Cities in Motion workshop team's. Both are used with the permission of their authors.
