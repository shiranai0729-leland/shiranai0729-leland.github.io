---
title: "PySpark 01: RDD Basics"
description: "An introduction to Resilient Distributed Datasets (RDDs) in PySpark, covering lineage, transformations, and actions."
pubDate: "Jan 10 2024"
tags: ["spark", "pyspark", "bigdata"]
---

# PySpark 01 RDD basics

### 1 RDDs and partitions

**RDDs**: Resilient Distributed Datasets.

- A real or virtual file consisting of records.
- Partitioned into partitions.
- Created through deterministic transformations on "Data in persistent storage" or other RDDs.
- Do not need to be materialized.

Users can control the **persistence** and the **partitioning**(e,g, key of the record) of RDDs.

Programers specified number of partitions for an RDD (Default value used if not specified). More partitions means better parallelism as well as more overhead.

### 2 Lineage graph

![spark01_linear_graph](F:\Coursework Files\HKUST\MSBD5003x_Big_Data_Computing_with_Spark\pics\spark01_linear_graph.png)

```scala
lines = spark.textFile(“hdfs://…”)
errors = lines.filter(_.startsWith(“Error”))
errors.filter(_.contains(“HDFS”))
           .map(_split(‘\t’)(3))
           .collect()
```

Execution is pipelined and parallel. No need to store intermediate results (e.g. a fragment of the intermediate RDD "errors").

**Lazy execution** allows optimization. "Lazy" means that until an action (e.g. collect) is called, spark do not material any intermediate RDDs.

**Fault Tolerance Mechanism**: RDD has enough information about how it was derived from to compute its partitions from data in stable storage. For example, if a partition of errors is lost, Spark rebuilds it by applying a filter on only the corresponding partitions of lines. Partitions can be recomputed in parallel on different nodes, without having to roll back the whole program.

### 3 Transformations and Actions

![spark02_fault_tolerance](F:\Coursework Files\HKUST\MSBD5003x_Big_Data_Computing_with_Spark\pics\spark02_fault_tolerance.png)

Transformations only build the linear graph. In some cases, spark recomputes transformations, for example:

```python
lines = sc.textFile("...",4)
comments = lines.filter(isComment)
print lines.count(),comments.count()
```

when executing `print comments.count()`, spark recompute `lines` from the very beginning.

RDDs can be cached:

```python
lines = sc.textFile("...",4)
lines.cache()
comments = lines.filter(isComment)
print lines.count(),comments.count()
```

In this case, Spark materialize `lines`.

**RDD Persistentce**

- Make an RDD persist using persist() or cache()
- Different *storage levels,* default is MEMORY_ONLY
- Allows faster reuse and fault recovery
- Spark also automatically persists some intermediate data in shuffle operations
- Spark automatically drops out old data partitions using LRU policy. You can also unpersist() an RDD manually.

RDD actions and transformations can be used for more complex computations. If we want to find the line with the most words:

```python
textFile.map(lambda line: len(line.split())).reduce(lambda a, b: a if (a > b) else b)
```

The above code uses Python anonymous functions (lambda), we can also pass any top-level function we want, for example:

```python
def max(a, b):
	if a > b:
		return a
	else:
		return b

textFile.map(lambda line: len(line.split())).reduce(max)
```

### 4 Where code runs

Most Python code runs in **driver**, except for code passed to transformations. Transformations run at **executors**, actions run at **executors** and **driver**.

<img src="F:\Coursework Files\HKUST\MSBD5003x_Big_Data_Computing_with_Spark\pics\spark03.png" alt="spark03" style="zoom:80%;" />

> Note: SparkContext(sc) can connect to several types of cluster managers (either Spark's own standalone cluster manager, Mesos or YARN).

Example: combine two RDDs, a naive method would be:

```python
a = RDDa.collect()
b = RDDb.collect()
RDDc = sc.parallelize(a+b)
```

In this case, all distributed data is sent to driver. The correct way is:

```python
RDDc = RDDa.union(RDDb)
```

This runs completely at executors.

### 5 RDD operations

#### Transformations

**map()**

```python
# map
fruitsReversed = fruits.map(lambda fruit: fruit[::-1])
```

**cache()**

For an RDD that has been cache before (e.g. fruitsReversed). To change it, unpersist() need to be called.

```python
fruitsReversed.cache()
```

**filter()**

```python
k = 5
shortFruits = fruits.filter(lambda fruit: len(fruit) <= k)
```

**faltmap()**

flatmap concat all lists together to form a new list as the result.

```python
characters = fruits.flatMap(lambda fruit: list(fruit))
```

**union()**

Combine two RDDs.

```
fruitsAndYellowThings = fruits.union(yellowThings)
```

**intersection()**

Get the intersection between two RDDs.

```python
yellowFruits = fruits.intersection(yellowThings)
```

**distinct()**

Remove duplicated items from an RDD.

```python
distinctFruitsAndYellowThings = fruitsAndYellowThings.distinct()
```

#### Actions

**collect()**

Return the python list to the driver.

```python
fruitsArray = fruits.collect()
```

**count()**

```python
numFruits = fruits.count()
```

**take()**

```python
first3Fruits = fruits.take(3)
```

**sum()**

```python
sum_result = fruits.map(lambda fruit: len(fruit)).sum()
```

**reduce()**

```python
letterSet = fruits.map(lambda fruit: set(fruit)).reduce(lambda x, y: x.union(y))
```

The above code has the same effect as the following one:

```python
letterSet = fruits.flatMap(lambda fruit: list(fruit)).distinct().collect()
```

