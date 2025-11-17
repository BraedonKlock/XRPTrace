import { getWallet, getWalletTransactions } from "./walletDetails";

/**
 * Node shape:
 * {
 *   address,
 *   amount,
 *   hash,
 *   date,      // from tx.close_time_iso
 *   children: [ ...same shape... ]
 * }
 */


function getDateOnly(isoString) {
    if (!isoString || isoString === "ROOT_DATE") return null;
    return isoString.split("T")[0];  // e.g. "2019-06-13"
}

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
    const MAX_DEPTH = 10;
    const MAX_NODES = 3000;
    let nodeCount = 1;

    const visitedTx = new Set();          // tx hashes we've already used
    const visitedAddresses = new Set();   // raddresses we've already expanded
    const txCache = new Map();            // raddress -> simplifiedTxArray
    const failedAddresses = new Set();    // addresses that already failed connect

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

        // Only visit each r-address ONCE (no duplicate expansions)
        if (visitedAddresses.has(address)) {
            console.warn("Address already expanded, skipping:", address);
            return;
        }
        visitedAddresses.add(address);

        console.log("expandNode start for address:", address, "depth:", depth);

        const parentDateOnly = getDateOnly(node.date);

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

            const childDateOnly = getDateOnly(childDate);

            // only follow children where child's DATE >= parent DATE
            if (parentDateOnly && childDateOnly && childDateOnly < parentDateOnly) {
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
