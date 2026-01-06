import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "../pages/TransactionTreePage.css";
import TreeNode from "../components/TreeNode";
import { treeBuilder } from "../helpers/tree";

export default function TransactionGraphPage() {
  const location = useLocation();
  const { hash, destination, amount, date } = location.state || {};
  const [loading, setLoading] = useState(false);

  const hasTx = !!destination;

  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState(null);

  // this holds the BFS-built tree
  const [tree, setTree] = useState(null);
  const [loadingTree, setLoadingTree] = useState(false);
  const [treeError, setTreeError] = useState("");

  function handleZoomIn() {
    setZoom((z) => Math.min(z + 0.25, 2.5));
  }

  function handleZoomOut() {
    setZoom((z) => Math.max(z - 0.25, 0.25));
  }

  function handleResetZoom() {
    setZoom(1);
  }

  useEffect(() => {
    if (!hasTx) {
      setTree(null);
      setSelectedNode(null);
      return;
    }

    setLoading(true);
    let cancelled = false;

    async function build() {
      setLoadingTree(true);
      setTreeError("");
      setTree(null);
      setSelectedNode(null);

      const rootTx = { hash, destination, amount, date };
      console.log("Starting DFS tree build for:", rootTx);

      try {
        const builtTree = await treeBuilder(rootTx);

        if (!cancelled) {
          console.log("BUILT TREE:", builtTree);
          setTree(builtTree);
        }
      } catch (err) {
        console.error("Error building tree:", err);
        if (!cancelled) {
          setTreeError(err.message || "Failed to build transaction graph.");
        }
      } finally {
        if (!cancelled) {
          setLoadingTree(false);
          setLoading(false);
        }
      }
    }

    build();

    return () => {
      cancelled = true;
    };
  }, [hasTx, hash, destination, amount, date]);

  // What to show in the info panel:
  const displayNode =
    selectedNode ??
    tree ??
    (hasTx
      ? { hash, address: destination, amount, date }
      : null);

  return (
    <main className="page-shell tree-page">
      {!hasTx ? (
        <div className="empty-card glass-card">
          <h2>No transaction selected</h2>
          <p className="helper-text">Return to the search page and choose a transaction to visualize its flow.</p>
        </div>
      ) : (
        <>
          {/* Top details card */}
          <div className="tx-details glass-card">
            <p className="eyebrow">Transaction overview</p>
            <h3>{displayNode?.address}</h3>
            <div className="tx-grid">
              <div>
                <p className="labels">Transaction hash</p>
                <p className="value hash">{displayNode?.hash}</p>
              </div>
              <div>
                <p className="labels">Address</p>
                <p className="value">{displayNode?.address}</p>
              </div>
              <div>
                <p className="labels">Received</p>
                <p className="value accent">{displayNode?.amount} XRP</p>
              </div>
              <div>
                <p className="labels">Date</p>
                <p className="value">{displayNode?.date}</p>
              </div>
            </div>
          </div>

          {/* Zoom controls + scrollable tree */}
          <section className="graph-wrapper glass-card">
            <div className="graph-controls">
              <div className="control-group">
                <button type="button" onClick={handleZoomOut}>−</button>
                <span className="graph-zoom-label">{Math.round(zoom * 100)}%</span>
                <button type="button" onClick={handleZoomIn}>+</button>
                <button type="button" onClick={handleResetZoom} className="ghost-button">Reset</button>
              </div>
              {treeError && <p className="alert error inline">{treeError}</p>}
              {loadingTree && <p className="helper-text">Building transaction graph…</p>}
            </div>

            <div className="graph-viewport">
              {loading && (
                <div className="spinner-container">
                  <div className="spinner" />
                </div>
              )}
              <div className="graph-tree" style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}>
                {tree && <TreeNode node={tree} onSelect={setSelectedNode} />}
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
