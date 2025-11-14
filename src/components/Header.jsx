import { Link } from "react-router-dom"
import "./Header.css"
export default function Header() {
    return (
        <header>
            <Link to="/XRPTrace/" id="image-link">
                <img id="header-image" src="./images/home.png"></img>
            </Link>
        </header>
    )
}