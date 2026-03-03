---
title: "Configuring PlantUML in IntelliJ IDEA on an M1 Mac"
description: "A step-by-step guide to installing and configuring PlantUML and Graphviz in IntelliJ IDEA on an Apple Silicon (M1) Mac, including common pitfalls and solutions."
pubDate: "Nov 20 2023"
tags: ["PlantUML", "IntelliJ IDEA", "M1 Mac", "Apple Silicon", "Graphviz", "Homebrew"]
---

# Troubleshooting PlantUML Configuration in IntelliJ IDEA on an M1 Mac

**Local Environment:** macOS Monterey 12.2.1 (Apple Silicon)

## About PlantUML

**PlantUML** is an open-source tool that allows users to create diagrams from a plain text language. In addition to various UML diagrams, PlantUML supports a wide range of other software development-related formats (such as Archimate, Block Diagrams, BPMN, C4, Network Diagrams, Gantt Charts, Mind Maps, and WBS), as well as the visualization of JSON and YAML files.

PlantUML is an example of a Domain-Specific Language (DSL). Besides its own DSL, PlantUML also accepts AsciiMath, Creole, DOT, and LaTeX. It uses Graphviz to lay out its diagrams and TikZ to support LaTeX.

## Installing the PlantUML Plugin in IntelliJ IDEA

1.  Open **Preferences** from the top menu bar.

    ![p1](https://inews.gtimg.com/newsapp_ls/0/14619275160/0.png)

2.  Select the **Plugins** menu and search for "PlantUML" in the Marketplace. Click **Install**.

    ![p2](https://inews.gtimg.com/newsapp_ls/0/14619275235/0.png)

## Installing Graphviz

### Installing Homebrew

Run the following command in your terminal to install the ARM version of Homebrew:

```sh
/bin/bash -c "$(curl -fsSL https://gitee.com/ineo6/homebrew-install/raw/master/install.sh)"
```

After the installation is complete, run the following commands to set up the Homebrew environment variables (for macOS Catalina and later):

```sh
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

To verify that Homebrew was installed correctly, run:

```sh
brew help
```

### Installing Graphviz with Homebrew

In the terminal, run the following command to install Graphviz:

```sh
brew install graphviz
```

After installation, you can check if it was successful by running:

```sh
brew list
```

## Configuring the Graphviz Path for PlantUML

1.  Open the PlantUML settings in IntelliJ IDEA. You can do this by creating and opening a `.puml` file, then clicking the settings icon in the file's top bar.

    ![p3](https://inews.gtimg.com/newsapp_ls/0/14619275206/0.png)

2.  In the "Graphviz dot executable" field, click **Browse** to locate the Graphviz `dot` executable.

3.  In the file browser, press `Command + Shift + .` to show hidden files.

4.  The file is located at: `/opt/homebrew/bin/dot`

    ![p4](https://inews.gtimg.com/newsapp_ls/0/14619247025/0.png)

5.  Restart IntelliJ IDEA, and PlantUML should now work correctly.

**References:**

*   Homebrew Installation Tutorial for M1 Macs: [M1芯片Mac上Homebrew安装教程](https://zhuanlan.zhihu.com/p/341831809)
*   Official Homebrew Website: [Homebrew](https://brew.sh/)