import React from "react";
import {Link, useLocation} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCode} from "@fortawesome/free-solid-svg-icons";

import "../css/Navbar.css";

const Navbar: React.FC = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname == path;
    return (
        <nav>
            <div className={"logo"}>
                <Link to={"/"}>
                    <FontAwesomeIcon icon={faCode} size={"2x"} className={"nav-icon"}/>
                </Link>
            </div>
            <div className={"links"}>
                <Link to="/" className={isActive("/") ? "active" : ""}>Home</Link>
                <Link to="/projects" className={isActive("/projects") ? "active" : ""}>Projects</Link>
                <Link to="/contact" className={isActive("/contact") ? "active" : ""}>Contact</Link>
            </div>
        </nav>
    );
}

export default Navbar;