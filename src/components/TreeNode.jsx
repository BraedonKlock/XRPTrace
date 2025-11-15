export default function TreeNode({ node, onSelect }) {
    function handleClick() {
        if (onSelect) {
            onSelect(node);
        }
    }

    return (
        <div className="tree-node">
            <div className="tree-node-card" onClick={handleClick}>
                <div className="tree-address">{node.address}</div>
                <div className="tree-meta"><span>Received: {node.amount} XRP</span></div>
            </div>

            {node.children && node.children.length > 0 && (
                <ul className="tree-children">
                    {node.children.map((child, index) => (
                        <li key={`${child.hash || child.address}-${index}`} className="tree-branch">
                        <TreeNode node={child} onSelect={onSelect} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
