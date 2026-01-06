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

    if (!raddress.trim()) return;

    setLoading(true); // start spinner

    try {
      const wallet = await getWallet({ raddress });
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
    } catch (error) {
      if (error?.data?.error_code === 19) {
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
    <main className="page-shell">
      <section className="hero-panel glass-card">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="title-accent">Live transparency · Zero keys stored</div>
            <h1>Track XRP transfers with clarity</h1>
            <p className="subtext">
              Inspect outgoing XRP payments, surface balances instantly, and explore a transaction tree without exposing
              sensitive keys.
            </p>
            <div className="warning-chips">
              <span className="chip danger">Do NOT enter your seed or private/public keys</span>
              <span className="chip subtle">Only enter your r-address / classic address</span>
              <span className="chip subtle">A public address always starts with an "r"</span>
            </div>
          </div>

          <div className="hero-sidecard">
            <p className="eyebrow">Confidence panel</p>
            <h3>Designed for safer lookups</h3>
            <div className="divider" />
            <div className="sidecard-grid">
              <div className="side-stat">
                <p className="labels">Non-custodial</p>
                <p className="value">Read-only balance + history requests</p>
              </div>
              <div className="side-stat">
                <p className="labels">Transparent</p>
                <p className="value">Tap any payment to visualize the flow</p>
              </div>
              <div className="side-stat">
                <p className="labels">Fast</p>
                <p className="value">Optimized for quick wallet lookups</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="card-grid">
        <form id="raddress-form" className="input-card glass-card" onSubmit={handleSubmit}>
          <div className="form-header">
            <div>
              <p className="eyebrow">Wallet lookup</p>
              <h3>Paste an address to begin</h3>
              <p className="helper-text">We only use your public r-address to retrieve balances and outgoing payments.</p>
            </div>
          </div>

          <div className="input-row">
            <input
              value={raddress}
              onChange={handleChange}
              id="raddress-input"
              placeholder="Enter the r-address of the account"
            />
            <button type="submit">Search</button>
          </div>

          {raddress && (
            <div className="stat-pill ghost">Currently selected: {raddress}</div>
          )}

          {loading && (
            <div className="spinner-container">
              <div className="spinner" />
            </div>
          )}

          {error && (
            <div className="alert error">{error}</div>
          )}

          {balance && (
            <div className="stat-pill">Wallet balance: {balance} XRP</div>
          )}
        </form>
      </section>

      <section className="transactions-panel glass-card">
        <div className="section-header">
          <div>
            <p className="eyebrow">Outgoing payments</p>
            <h3>Recent activity</h3>
            <p className="helper-text">Tap a transaction to explore the flow of funds in the tree view.</p>
          </div>
        </div>

        <div id="transaction-card-container" className="transaction-grid">
          {transactions.length > 0 ? (
            transactions.map(([hash, destination, amount, date], index) => (
              <TransactionCard
                key={`${destination}-${date}-${index}`}
                hash={hash}
                destination={destination}
                amount={amount}
                date={date}
              />
            ))
          ) : (
            <h4 id="message">{message}</h4>
          )}
        </div>
      </section>
    </main>
  );
}
