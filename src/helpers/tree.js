import { getWallet, getWalletTransactions } from "./walletDetails";

/**
 * Node shape:
 * {
 *   address,
 *   amount,
 *   hash,
 *   date,
 *   children: [ ...same shape... ]
 * }
 */
export async function treeBuilder({ hash, destination, amount, date }) {
    console.log("treeBuilder called with:", { hash, destination, amount, date });

    const rootNode = {
        address: destination || "rROOT...",
        amount: amount || 0,
        hash: hash || "ROOT_HASH",
        date: date || "ROOT_DATE",
        children: [],
    };

    // ---- limits ----
    const MAX_DEPTH = 4;      // how many hops from the root
    const MAX_NODES = 300;    // total nodes in the tree
    let nodeCount = 1;        // root counts as 1

    const visitedTx = new Set();      // tx hashes we've already used
    const txCache = new Map();        // raddress -> simplifiedTxArray
    const failedAddresses = new Set(); // addresses that already failed connect

    async function expandNode(node, depth = 0) {
        const address = node.address;
        if (!address) return;

        if (depth >= MAX_DEPTH) {
        console.warn("Max depth reached at", address);
        return;
        }

        if (nodeCount >= MAX_NODES) {
        console.warn("Max node limit reached, stopping expansion");
        return;
        }

        if (failedAddresses.has(address)) {
        console.warn("Skipping address with previous failures:", address);
        return;
        }

        console.log("expandNode start for address:", address, "depth:", depth);

        const parentDate = node.date;
        const parentTime =
        parentDate && parentDate !== "ROOT_DATE"
            ? new Date(parentDate).getTime()
            : 0;

        let simplifiedTxArray;

        if (txCache.has(address)) {
        simplifiedTxArray = txCache.get(address);
        console.log(
            "Using cached tx list for",
            address,
            "len=",
            simplifiedTxArray.length
        );
        } else {
        let wallet;
        try {
            wallet = await getWallet({ raddress: address });
        } catch (err) {
            failedAddresses.add(address);
            console.warn("expandNode: could not load wallet for", address, err);
            return;
        }

        simplifiedTxArray = getWalletTransactions(wallet, address);
        console.log(
            "Fetched tx list for",
            address,
            "len=",
            simplifiedTxArray.length
        );
        txCache.set(address, simplifiedTxArray);
        }

        for (let i = 0; i < simplifiedTxArray.length; i++) {
        if (nodeCount >= MAX_NODES) {
            console.warn("Max node limit reached inside loop, breaking");
            break;
        }

        const [txHash, childDestination, childAmount, childDate] =
            simplifiedTxArray[i];

        if (!txHash || !childDestination) continue;
        if (visitedTx.has(txHash)) continue;

        const childTime = new Date(childDate).getTime();

        // Only follow children whose date is >= parent date
        if (parentDate !== "ROOT_DATE" && childTime < parentTime) {
            continue;
        }

        visitedTx.add(txHash);

        const childNode = {
            address: childDestination,
            amount: childAmount,
            hash: txHash,
            date: childDate,
            children: [],
        };

        node.children.push(childNode);
        nodeCount++;

        console.log(
            "Added child node:",
            childDestination,
            "amount=",
            childAmount,
            "hash=",
            txHash,
            "depth=",
            depth + 1
        );

        await expandNode(childNode, depth + 1);
        }

        console.log("expandNode finished for address:", address, "depth:", depth);
    }

    try {
        await expandNode(rootNode, 0);
        console.log("treeBuilder finished. Root node:", rootNode);
    } catch (err) {
        console.error("treeBuilder top-level error:", err);
        throw err;
    }

    return rootNode;
}
