import { useState } from "react";
import "../pages/HomePage.css";
import { getWallet, getWalletTransactions } from "../helpers/walletDetails";
import TransactionCard from "../components/TransactionCard";

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
            const wallet = await getWallet({raddress});
            setError("");
            setBalance("");
            setTransactions([]);
            setMessage("");

            setBalance(wallet.balance);
            
            const simplifiedTxArray = getWalletTransactions(wallet, raddress);

            if (simplifiedTxArray.length < 1) {
                setMessage("No outgoing XRP payments found");
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
                        <TransactionCard key={`${destination}-${date}-${index}`} hash={hash} destination={destination} amount={amount} date={date} />
                    ))
                ) : (
                    <h1 id="message">{message}</h1>
                )}
            </section>
        </main>
    )
}