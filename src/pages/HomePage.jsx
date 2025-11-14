import { useState } from "react";
import "../pages/HomePage.css";
import {getAccountTransactions} from "../helpers/accountTransactions";
import TransactionCard from "../components/TransactionCard";
import { dropsToXrp } from "xrpl";

export default function HomePage() {
    const [raddress, setRaddress] = useState("");
    const [balance, setBalance] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        const raddress = e.target.value.trim();
        setRaddress(raddress);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if(!raddress.trim()) return;

        setLoading(true); // start spinner

        try {
            const wallet = await getAccountTransactions({raddress});
            setError("");
            setBalance("");
            setTransactions([]);
            setMessage("");

            setBalance(wallet.balance);
            
            const txArray = wallet.transactions?.result?.transactions || [];
            const simplifiedTxArray = [];

            if (txArray.length < 1) {
                setMessage("No transactions found");
            } else {
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

                if (simplifiedTxArray.length < 1) {
                    setMessage("No outgoing XRP payments found");
                }
            }

            setTransactions(simplifiedTxArray);

        }catch(error) {
            if(error?.data?.error_code === 19) {
                setError(`${error.message} **Account MIGHT need to be funded with the minimum XRP required**`);
                setBalance("");
                setTransactions([]);
                setMessage("");
            }
            else {
                setError(error.message);
                setBalance("");
                setTransactions([]);
                setMessage("");
            }
        } finally {
            setLoading(false); // stop spinner
        }
    }
    return (
        <main>
            <section id="warnings">
                <h4>Do NOT enter your seed, private or public keys!</h4>
                <h4>ONLY enter your raddress / classic address / public address.</h4>
                <h4>Your public address will always start with an "r"</h4>
            </section>

            <form id="raddress-form" onSubmit={handleSubmit}>
                <input value={raddress} onChange={handleChange} id="raddress-input" placeholder="Enter the raddress of the account"></input>
                <button type="submit">Submit</button>
            </form>

            <h4 id="raddress">{raddress}</h4>

            {loading && (
                <div className="spinner-container">
                    <div className="spinner" />
                </div>
            )}
            
            {error && (
                <h1 id="error">{error}</h1>
            )}

            {balance && (
                <h3 id="balance-display">Wallet balance: {balance} XRP</h3>
            )}

            <section id="transaction-card-container">
                {transactions.length > 0 ? (
                    transactions.map(([hash, destination, amount, date], index) => (
                        <TransactionCard key={`${destination}-${date}-${index}`} hash={hash}destination={destination} amount={amount} date={date} />
                    ))
                ) : (
                    <h1 id="message">{message}</h1>
                )}
            </section>
        </main>
    )
}