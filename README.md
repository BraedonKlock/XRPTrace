# XRPTrace

XRPTrace is a React-based visual explorer for tracing XRP flows across the XRPL – with a focus on following **stolen or suspicious funds** through attacker mixing paths.

✅ Users enter an XRP r-address, fetch its on-chain history, and inspect outgoing payments using XRPL APIs.

✅ From a selected transaction, XRPTrace walks the destination address’s outgoing payments and recursively follows their children, building a **breadth-first transaction tree** of downstream addresses involved in the flow.

✅ The interactive, graph-style UI lets investigators visually follow the money hop-by-hop, and see which wallets receive funds next.

⚠️ Right now there are **temporary depth / node limits** in place to avoid hammering public XRPL nodes and crashing the browser.

## 🎥 Watch Demo

[▶️ To view the video: Click here! then download the RAW file!](XRPTraceDemo.mp4)
