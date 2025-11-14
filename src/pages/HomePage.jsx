import { useState } from "react";
import "../pages/HomePage.css";
import {getAccountTransactions} from "../helpers/accountTransactions";
import TransactionCard from "../components/TransactionCard";

export default function HomePage() {
    const [raddress, setRaddress] = useState("");
    const [balance, setBalance] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    function handleChange(e) {
        setRaddress(e.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if(!raddress.trim()) return;
        try {
            const wallet = await getAccountTransactions({raddress});
            setError("");
            setBalance("");
            setTransactions([]);
            setMessage("");

            setBalance(wallet.balance);
        const txArray = wallet.transactions?.result?.transactions || [];

            if (txArray.length < 1) {
                setMessage("No transactions found");
            }
            
            setTransactions(txArray);
        }catch(error) {
            if(error.data.error_code === 19) {
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
        }



    }
    return (
        <main>
            <h4>Do NOT enter your seed, private or public keys!<br></br>ONLY enter your raddress/classic address/public address.</h4>
            <form id="raddress-form" onSubmit={handleSubmit}>
                <input value={raddress} onChange={handleChange} id="raddress-input" placeholder="Enter the raddress of the account"></input>
                <button type="submit">Submit</button>
            </form>

            {error? (
                <h1 id="error">{error}</h1>
            ) : (
                <h1></h1>
            )}
            <h1>XRP: {balance}</h1>
            {transactions.length > 0 ? (
                transactions.map((transaction) => (
                    <h1>{transaction.hash}</h1>
                    <TransactionCard key={transaction.raddress} transaction={transaction}/>

                ))

            ) : (
                <h1>{message}</h1>
            )}
        </main>
    )
}