import { useLocation } from "react-router-dom";
import { useState } from "react";
import "../pages/TransactionGraphPage.css";
import TreeNode from "../components/TreeNode";
import { graph } from "../helpers/graph";

export default function TransactionGraphPage() {
    const location = useLocation();
    const { hash, destination, amount, date } = location.state || {};

    const hasTx = !!destination;
    const [zoom, setZoom] = useState(1); // 1 = 100%

    function handleZoomIn() {
        setZoom((z) => Math.min(z + 0.25, 2.5));
    }

    function handleZoomOut() {
        setZoom((z) => Math.max(z - 0.25, 0.5));
    }

    function handleResetZoom() {
        setZoom(1);
    }
    const demoTree = graph(destination, amount);


    return (
        <main>
        {!hasTx ? (
            <h2>No transaction selected</h2>
        ) : (
            <>
            <div className="tx-details">
                <h5><span className="labels">TRANSACTION HASH:</span><br />{hash}</h5>
                <h5><span className="labels">Destination:</span> {destination}</h5>
                <h5><span className="labels">Amount:</span> {amount} XRP</h5>
                <h5><span className="labels">Date:</span> {date}</h5>
            </div>

            {/* Zoom controls + scrollable tree */}
            <section className="graph-wrapper">
                <div className="graph-controls">
                    <button type="button" onClick={handleZoomOut}> −</button>
                    <span className="graph-zoom-label">{Math.round(zoom * 100)}%</span>
                    <button type="button" onClick={handleZoomIn}>+</button>
                    <button type="button" onClick={handleResetZoom}> Reset</button>
                </div>

                <div className="graph-viewport">
                    <div className="graph-tree" style={{ transform: `scale(${zoom})`, transformOrigin: "top left", }}>
                        <TreeNode node={demoTree} />
                    </div>
                </div>
            </section>
            </>
        )}
        </main>
    );
    }
