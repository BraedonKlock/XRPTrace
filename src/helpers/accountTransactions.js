import { Client } from "xrpl";

const client = new Client("wss://s.altnet.rippletest.net:51233");

export async function getAccountTransactions(wallet) {
    await client.connect();

    const walletTransactions = { balance: 0 , transactions: [] }
    try {
        walletTransactions.balance = await client.getXrpBalance(wallet.raddress);
        
        walletTransactions.transactions = await client.request({
            "id": 2,
            "command": "account_tx",
            "account": wallet.raddress,
            "ledger_index_min": -1,
            "ledger_index_max": -1,
            "binary": false,
            "forward": false,
            "api_version": 2
        })


        return walletTransactions
    }catch(error) {
        console.log(error.message);
        throw error;
    }finally {
        await client.disconnect();
    }


}