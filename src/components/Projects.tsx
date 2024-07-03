import React from "react";

import "../css/About.css";
import Navbar from "./Navbar.tsx";

import "../css/Boilerplate.css";

const Projects: React.FC = () => {
    return (
        <>
            <Navbar/>
            <div className={"text-wrapper component-fade-in"}>
                <div className={"text"}>
                    <div className={"info"}>
                        <p>
                            Placeholder page.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Projects;