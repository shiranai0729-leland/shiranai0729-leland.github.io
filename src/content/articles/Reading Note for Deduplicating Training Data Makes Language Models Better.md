---
title: "Reading Notes: Deduplicating Training Data Makes Language Models Better"
description: "An introduction to Resilient Distributed Datasets (RDDs) in PySpark, covering lineage, transformations, and actions."
pubDate: "Oct 22 2024"
tags: ["paper", "machine-learning", "nlp"]
---

# Reading notes - Deduplicating Training Data Makes Language Models Better

### 1 Introduction & Motivation

A key factor behind the recent progress in Natural language processing (NLP) and large language models (LLMs) is that the scale of both model parameter and dataset is growing rapidly. This moves us into all web-based crawled dataset, leading to an unpromised data quality. It's too expensive to performance manual review. It's impossible for us to regulate and design the datasets to guarantee its quality just as good as when we are still working with gold-label datasets and middle-size models. Also, this issue cannot be simply avoided by only crawling from top domains (this site also has a top domain🤗). And numerous documents are machine-generated today, among which news websites suffer most.

Based on motivations and backgrounds upon, this paper "Deduplicating Training Data Makes Language Models Better" propose following facts:

- Over 1% of tokens emitted unprompted from a model trained on standard datasets (e.g., C4) are part of a memorized sequence.
- Train-test overlap is common in non deduplicated datasets.
- Training models on deduplicated datasets is more efficient. (Since it directly decrease GPU hours needed)
- Deduplicating training data does not hurt perplexity.

In the paper, researchers investigate 4 popular datasets and bring up 2 approaches to execute deduplication.

### 2 Approach



### 3 Outcome

