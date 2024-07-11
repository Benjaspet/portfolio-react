/*
 * Copyright © 2024 Ben Petrillo. All rights reserved.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * All portions of this software are available for public use,
 * provided that credit is given to the original author(s).
 */

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";

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
                <Link to="/comments" className={isActive("/comments") ? "active" : ""}>Comments</Link>
            </div>
        </nav>
    );
}

export default Navbar;