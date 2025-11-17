# XRPTrace
- React-based web app that lets users enter an XRP address, fetch its on-chain history, and inspect outgoing payments using XRPL APIs.

- Implemented a depth-first traversal over XRPL account_tx data to follow funds across multiple hops and build a tree of all downstream addresses involved in potential mixing.

- Designed an interactive, graph-style UI so investigators can visually trace stolen XRP as it moves through related wallets over time.

Right now there is a limit of 300 nodes and a max depth of 4 to prevent the browser from crashing.

## ToDO: 
- Set up node JS backend and move xrpl requests and tree to backend to build the full tree with every transaction (no limits).

- Allow users to save and upload the tree for quick loading.

## 🎥 Watch Demo

[▶️ To view the video: Click here! then download the RAW file!  ](XRPTraceDemo.mp4)
