# XRPTrace

XRPTrace is a React-based visual explorer for tracing XRP flows across the XRPL – with a focus on following **stolen or suspicious funds** through attacker mixing paths.

✅ React-based web app that lets users enter an XRP address, fetch its on-chain history, and inspect outgoing payments using XRPL APIs.

✅ Implemented a breadth-first traversal over XRPL account_tx data to follow funds across a max of 4 hops and build a tree of all downstream addresses involved in potential mixing.

✅ Designed an interactive, graph-style UI so investigators can visually trace stolen XRP as it moves through related wallets over time.

⚠️ Right now there are **temporary depth / node limits** in place to avoid hammering public XRPL nodes and crashing the browser.

## 🎥 Watch Demo

[▶️ To view the video: Click here! then download the RAW file!](XRPTraceDemo.mp4)
