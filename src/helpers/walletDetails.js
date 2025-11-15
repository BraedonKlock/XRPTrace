import { Client } from "xrpl";
import { dropsToXrp } from "xrpl";

const client = new Client("wss://s1.ripple.com");

export async function getWallet(wallet) {
    await client.connect();

    const walletDetails = { balance: 0 , transactions: [] }
    try {
        walletDetails.balance = await client.getXrpBalance(wallet.raddress);
        
        walletDetails.transactions = await client.request({
            "id": 2,
            "command": "account_tx",
            "account": wallet.raddress,
            "ledger_index_min": -1,
            "ledger_index_max": -1,
            "binary": false,
            "forward": false,
            "api_version": 2
        })

        return walletDetails
    }catch(error) {
        console.log(error.message);
        throw error;
    }finally {
        await client.disconnect();
    }
}

export function getWalletTransactions(wallet, raddress) {
    const txArray = wallet.transactions?.result?.transactions || [];
    const simplifiedTxArray = [];
    for (let i = 0; i < txArray.length; i++) {
        const tx = txArray[i];

        const txJson = tx.tx_json || {};
        const meta = tx.meta || {};

        // Only care about Payment transactions
        if (txJson.TransactionType !== "Payment") continue;

            const destination = txJson.Destination;

        // Skip if no destination
        if (!destination) continue;

        // Skip inbound (to this same address)
        if (destination === raddress) continue;

        let drops = null;

        if (typeof meta.delivered_amount === "string") {
            // Normal XRP payment with delivered_amount in drops
            drops = meta.delivered_amount;
        } else if (typeof txJson.Amount === "string") {
            // Fallback: Amount is plain XRP in drops
            drops = txJson.Amount;
        } else {
            continue;
        }

        // Make sure drops looks like a valid integer string
        if (!/^-?[0-9]+$/.test(drops)) {
            console.warn("Skipping non-XRP or invalid amount:", drops);
            continue;
        }

        let amount;
        try {
            amount = dropsToXrp(drops);
        } catch (e) {
            console.error("dropsToXrp failed for drops =", drops, e);
            continue; // skip this tx instead of breaking everything
        }

        const date = tx.close_time_iso;
        const hash = tx.hash;

        simplifiedTxArray.push([hash, destination, amount, date]);
    }
    return simplifiedTxArray;
}