---
title: "Spark: Data Partitioning Strategies"
description: "Understanding Hash vs Range partitioning to optimize parallelism and balance workloads in Spark RDDs."
pubDate: "Mar 01 2024"
tags: ["spark", "optimization", "bigdata"]
---

## Spark: Partitions

RDDs are stored in partitions. Programmer specifies number of partitions for an RDD (Default value used if unspecified). More partitions means more parallelism but also more overhead.
...
