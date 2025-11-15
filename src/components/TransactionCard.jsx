import { Link } from "react-router-dom";

export default function TransactionCard({hash, destination, amount, date}) {
    return (
        <Link className="link" to="/transaction-history"
        state={{ hash, destination, amount, date }}>
            <div className="transaction-card">
                <h5><span className="labels">TRANSACTION HASH:</span><br></br>{hash}</h5>
                <h5><span className="labels">To:</span> {destination}</h5>
                <h5><span className="labels">Amount:</span> {amount} XRP</h5>
                <h5><span className="labels">Date:</span> {date}</h5>
            </div>
        </Link>
    )
}