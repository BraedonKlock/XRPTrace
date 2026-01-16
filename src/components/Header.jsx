import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header>
      <div className="header-inner">
        <Link to="/" className="brand">
          <span className="brand-mark" />
          <p className="brand-title">XRPTrace</p>
        </Link>
      </div>
    </header>
  );
}
