---

title: "Android Development Notes: RecyclerView Summary"

description: "A summary of RecyclerView, a powerful component of Android Jetpack for efficiently displaying large datasets."

pubDate: "Jun 07 2023"

tags: ["Java", "Android"]

---

## Overview of RecyclerView

**RecyclerView** is a powerful component of Android Jetpack designed to display large datasets efficiently. It serves as a modern successor to the traditional `ListView`, offering greater flexibility for displaying items and handling user interactions.

As the name implies, RecyclerView **recycles** elements. When an item scrolls off the screen, its view is reused for new items coming into view. This process significantly:

- **Enhances performance** by minimizing view creation.
- **Reduces power consumption**.
- **Improves UI responsiveness** (scrolling smoothness).

------

## Implementation Steps

### 1. Add the Dependency

Add the RecyclerView library to your project's `build.gradle` file.

> **Note:** Ensure you check for the most recent version in the [Google Repository](https://developer.android.com/jetpack/androidx/releases/recyclerview).

```gradle
dependencies {
    implementation 'androidx.recyclerview:recyclerview:1.2.1'
}
```

### 2. Add RecyclerView to your Layout

Place the `RecyclerView` widget within your XML layout file.

```xml
<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="0dp"
    android:layout_weight="1"
    android:paddingHorizontal="10dp"
    android:orientation="vertical">

    <androidx.recyclerview.widget.RecyclerView
        android:id="@+id/recycle_view"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</LinearLayout>
```

### 3. Define the Item Layout

Create a layout file (e.g., `list_item.xml`) for a single row.

```xml
<TextView
    android:id="@+id/item_title"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content" />
```

### 4. Implement the Adapter

The Adapter connects your data to the ViewHolders.

#### **Java Implementation**

```java
private class MyAdapter extends RecyclerView.Adapter<MyAdapter.ViewHolder> {
    private List<String> list;

    public MyAdapter(List<String> ls) {
        this.list = ls;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.list_item, parent, false);
        ViewHolder viewHolder = new ViewHolder(v);
        viewHolder.itemView.setOnClickListener(view -> {
            // Handle item click here
        });
        return viewHolder;
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        holder.mTextView.setText(list.get(position));
    }

    @Override
    public int getItemCount() {
        return list == null ? 0 : list.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView mTextView;
        public ViewHolder(View itemView) {
            super(itemView);
            mTextView = itemView.findViewById(R.id.item_title);
        }
    }
}
```

#### **Kotlin Implementation**

```kotlin
class MyAdapter(private val list: List<String>) : RecyclerView.Adapter<MyAdapter.ViewHolder>() {

    inner class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val mTextView: TextView = view.findViewById(R.id.item_title)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.list_item, parent, false)
        val viewHolder = ViewHolder(view)
        viewHolder.itemView.setOnClickListener {
            // Handle item click here
        }
        return viewHolder
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.mTextView.text = list[position]
    }

    override fun getItemCount() = list.size
}
```

### 5. Initialize in Activity or Fragment

Finally, bind the Adapter and a LayoutManager to your RecyclerView.

#### **Java**

```java
private void initRecycler() {
    RecyclerView recyclerView = findViewById(R.id.recycle_view);
    recyclerView.setLayoutManager(new LinearLayoutManager(this));
    recyclerView.setAdapter(new MyAdapter(dataList));
}
```

#### **Kotlin**

```kotlin
private fun initRecycler() {
    val layoutManager = StaggeredGridLayoutManager(3, StaggeredGridLayoutManager.VERTICAL)
    val recyclerView = findViewById<RecyclerView>(R.id.recycle_view)
    recyclerView.layoutManager = layoutManager
    recyclerView.adapter = MyAdapter(dataList)
}
```
