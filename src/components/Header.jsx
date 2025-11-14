import { Link } from "react-router-dom"
import "./Header.css"
export default function Header() {
    return (
        <header>
            <Link to="/" id="image-link">
                <img id="header-image" src="./images/home.png"></img>
            </Link>
            <div id="header-text">
                <h1>XRP Trace</h1>
            </div>
        </header>
    )
}