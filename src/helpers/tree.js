import { getWallet, getWalletTransactions } from "./walletDetails";

/**
 * Node shape:
 * {
 *   address,
 *   amount,
 *   hash,
 *   date,      // from tx.close_time_iso
 *   isExchange?: boolean,
 *   children: [ ...same shape... ]
 * }
 */

export const EXCHANGE_ADDRESSES = new Set([
    // === Uphold ===
    "rMdG3ju8pgyVh29ELPWaDuA74CpWW6Fxns",
    "rBEc94rUFfLfTDwwGN7rQGBHc883c2QHhx",

    // === Binance (global) ===
    "rDAE53VfMvftPB4ogpWGWvzkQxfht6JPxr",
    "rNU4eAowPuixS5ZCWaRL72UUeKgxcKExpK",
    "rarG6FaeYhnzSKSS5EEPofo4gFsPn2bZKk",
    "rBtttd61FExHC68vsZ8dqmS3DfjFEceA1A",

    // === Binance.US ===
    "rEeEWeP88cpKUddKk37B2EZeiHBGiBXY3",
    "rDAE53VfMvftPB4ogpWGWvzkQxfht6JPxr",

    // === Kraken ===
    "rLHzPsX6oXkzU2qL12kHCH8G8cnZv1rBJh",
    "rUeDDFNp2q7Ymvyv75hFGC8DAcygVyJbNF",

    // === Bitstamp ===
    "rGFuMiw48HdbnrUbkRYuitXTmfrDBNTCnX",
    "rUobSiUpYH2S97Mgb4E7b7HuzQj2uzZ3aD",
    "rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv",

    // === Bithumb ===
    "rrsSUzrT2mYAMiL46pm7cwn6MmMmxVkEWM",
    "rsG1sNifXJxGS2nDQ9zHyoe1S5APrtwpjV",

    // === Upbit ===
    "rBszWJzYpNoqoY4xKuGUpN23b6EBT41ocF",
    "rDxJNbV23mu9xsWoQHoBqZQvc77YcbJXwb",
    "rMNUAfSz2spLEbaBwPnGtxTzZCajJifnzH",
    "rHHQeqjz2QyNj1DVoAbcvfaKLv7RxpHMNE",
    "raQwCVAJVqjrVm1Nj5SFRcX8i22BhdC9WA",

    // === Bitbank ===
    "rLbKbPyuvs4wc1h13BEPHgbFGsRXMeFGL6",

    // === GOPAX ===
    "rwSdwXsQVCjYXUyempsGxk1Sgws6perYZL",

    // === Coinbase ===
    "rUjfTQpvBr6wsGGxMw6sRmRQGG76nvp8Ln",
    "rw2ciyaNshpHe7bCHo4bRWq6pqqynnWKQg",
    "rwnYLUsoBQX3ECa1A5bSKLdbPoHKnqf63J",
]);

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
    const MAX_DEPTH = 4;
    const MAX_NODES = 1000;
    let nodeCount = 1;

    const visitedTx = new Set();        // avoid reusing the same transaction hash
    const txCache = new Map();          // raddress -> simplifiedTxArray
    const failedAddresses = new Set();  // addresses that already failed connect

    // BFS queue holds { node, depth }
    const queue = [{ node: rootNode, depth: 0 }];

    while (queue.length > 0) {
        const { node, depth } = queue.shift();
        const address = node.address;

        if (!address) continue;

        if (depth >= MAX_DEPTH) {
        console.warn("Max depth reached at", address);
        continue;
        }

        if (nodeCount >= MAX_NODES) {
        console.warn("Max node limit reached, stopping expansion");
        break;
        }

        if (failedAddresses.has(address)) {
        console.warn("Skipping address with previous failures:", address);
        continue;
        }

        // Exchange / service address: show it but don't expand further
        if (EXCHANGE_ADDRESSES.has(address)) {
        console.log("Reached exchange address, treating as leaf node:", address);
        node.isExchange = true;
        continue;
        }

        console.log("BFS expand for address:", address, "depth:", depth);

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
            console.warn("treeBuilder: could not load wallet for", address, err);
            continue;
        }

        simplifiedTxArray = getWalletTransactions(wallet, address);

        // sort by amount DESC so larger transfers enqueue first
        // Each entry: [txHash, childDestination, childAmount, childDate]
        simplifiedTxArray.sort((a, b) => {
            const amountA = Number(a[2]) || 0;
            const amountB = Number(b[2]) || 0;
            return amountB - amountA; // biggest amounts first
        });

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
        if (visitedTx.has(txHash)) continue;  // don’t reuse the same tx on multiple branches

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
            "BFS added child:",
            childDestination,
            "amount=",
            childAmount,
            "hash=",
            txHash,
            "depth=",
            depth + 1
        );

        // BFS: enqueue children with depth + 1
        queue.push({ node: childNode, depth: depth + 1 });
        }
    }

    console.log("treeBuilder finished. Root node:", rootNode);
    return rootNode;
}
