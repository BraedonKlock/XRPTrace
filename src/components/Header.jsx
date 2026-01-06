import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header>
      <div className="header-inner">
        <div className="brand">
          <span className="brand-mark" />
          <p className="brand-title">XRPTrace</p>
        </div>
        <Link to="/" id="image-link" aria-label="Return to search">
          <img id="header-image" src="./images/home.png" alt="Home" />
        </Link>
      </div>
    </header>
  );
}
