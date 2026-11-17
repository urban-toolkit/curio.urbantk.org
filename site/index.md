---
layout: home
hero:
  name: Curio
  text: Dataflows for urban visual analytics
  tagline: Load city data, transform it with Python, and build linked charts and maps in a dataflow that records every change. Use it in your browser, or run it on your own computer.
  image:
    light: /media/brand/curio-hero.webp
    dark: /media/brand/curio-hero-dark.webp
    alt: The Curio logo, a bird drawn as a dataflow
  # Each button jumps to a section of this page: the catalogs, the use cases, then the topic grid's groups (site.ts).
  actions:
    - theme: brand
      text: Overview
      link: "#overview"
    - theme: alt
      text: Example use cases
      link: "#use-cases"
    - theme: alt
      text: Getting started
      link: "#getting-started"
    - theme: alt
      text: Using Curio
      link: "#using"
    - theme: alt
      text: Extending Curio
      link: "#extending"
useCases:
  - title: Video camera analysis
    text: Bring footage from traffic and street cameras into a dataflow. Computer vision nodes turn what each camera sees into data, which you can map, chart and compare with the city's other datasets. The SAGE-IDOT example, which ships with Curio, reads a day of three cameras at Illinois rail crossings where they are stored, places every object their YOLO models saw on the ground, and shows how full each lane before and after the crossing gets, minute by minute, on a map and in linked charts.
    icon: cctv
    doc: { path: docs/examples/32-sage-idot-rail-crossings.md, label: "The SAGE-IDOT rail crossings example" }
  - title: Ortho image fixing
    text: Find and fix the flaws in aerial orthoimagery before it feeds mapping and computer vision models. Each fix is a step in a dataflow, so it can be reviewed, run again on new tiles, and traced in the dataflow's provenance.
    icon: satellite
    inDevelopment: true
  - title: City comparison
    text: Run the same analysis on several cities and compare the results side by side. Build the dataflow once, point it at each city's data, and read the differences in linked maps and charts.
    icon: city
    inDevelopment: true
  - title: Flooding and weather analysis
    text: Combine weather records, climate rasters and census data to see which neighborhoods and residents are exposed to extreme heat or flooding. The Milan heat example, which ships with Curio, computes a thermal comfort index for every census tract and links a map with charts of residents over 65.
    image:
      src: /media/home/weather.webp
      alt: "The Milan heat example in Curio: a map of thermal comfort by census tract, a scatter plot of it against residents over 65, and a box plot of residents over 65"
    doc: { path: docs/examples/09-heterogeneous-data-linked-views.md, label: "The Milan heat example" }
---

<TopicGrid />
