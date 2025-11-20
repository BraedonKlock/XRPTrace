# XRPTrace

XRPTrace is a React-based visual explorer for tracing XRP flows across the XRPL – with a focus on following **stolen or suspicious funds** through attacker mixing paths.

✅ React-based web app that lets users enter an XRP address, fetch its on-chain history, and inspect outgoing payments using XRPL APIs.

✅ Implements a **breadth-first search (BFS)** over `account_tx` data to follow funds across a limited number of hops and build a tree of all downstream addresses involved in potential mixing.

✅ Within each “layer” of the BFS, transactions are **sorted by amount (largest first)** so the algorithm always explores the most valuable flows first. This way, if a node or depth limit is reached, the tree still covers the most financially significant paths.

✅ Designed an interactive, graph-style UI so investigators can visually trace stolen XRP as it moves through related wallets over time, click nodes to focus on a branch, and inspect transaction details.

⚠️ Right now there are **temporary depth / node limits** in place to avoid hammering public XRPL nodes and crashing the browser.

## 🎥 Watch Demo

[▶️ To view the video: Click here! then download the RAW file!](XRPTraceDemo.mp4)
