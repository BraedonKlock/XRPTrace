import { Link } from "react-router-dom";

export default function TransactionCard({ hash, destination, amount, date }) {
  return (
    <Link className="link" to="/transaction-history" state={{ hash, destination, amount, date }}>
      <div className="transaction-card">
        <div className="card-top">
          <p className="eyebrow">Outgoing payment</p>
          <span className="amount-chip">{amount} XRP</span>
        </div>
        <div className="card-title">
          <p className="labels">TRANSACTION HASH</p>
          <h5 className="hash">{hash}</h5>
        </div>
        <div className="card-meta">
          <div>
            <p className="labels">To</p>
            <p className="value">{destination}</p>
          </div>
          <div>
            <p className="labels">Amount</p>
            <p className="value accent">{amount} XRP</p>
          </div>
          <div>
            <p className="labels">Date</p>
            <p className="value">{date}</p>
          </div>
        </div>
        <div className="card-footer">
          <span className="subtle-link">Inspect transaction tree →</span>
          <span className="pill">View details</span>
        </div>
      </div>
    </Link>
  );
}
