    // 🔹 Recursive tree node
    export default function TreeNode({ node }) {
    return (
        <div className="tree-node">
            <div className="tree-node-card">
                <div className="tree-address">{node.address}</div>
                <div className="tree-meta"><span>{node.amount} XRP</span></div>
            </div>

            {node.children && node.children.length > 0 && (
                <ul className="tree-children">
                    {node.children.map((child) => (
                        <li key={child.address} className="tree-branch">
                        <TreeNode node={child} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}