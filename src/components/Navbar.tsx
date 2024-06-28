import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCode} from "@fortawesome/free-solid-svg-icons";

import "../css/Navbar.css";

const Navbar: React.FC = () => {
    return (
        <nav>
            <div className={"logo"}>
                <FontAwesomeIcon icon={faCode} size={"2x"} className={"nav-icon"}/>
            </div>
            <div className={"links"}>
                <a href={"#about"} className={"active"}>About</a>
                <a href={"#projects"}>Projects</a>
                <a href={"#contact"}>Contact</a>
            </div>
        </nav>
    );
}

export default Navbar;