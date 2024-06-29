import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {faCopy} from "@fortawesome/free-solid-svg-icons";

import "../css/About.css";

const About: React.FC = () => {
    return (
        <div className={"about"}>
            <div className={"left"}>
                <h3>UI/UX Designer</h3>
                <div className={"info"}>
                    <h2>I'm Ben Petrillo</h2>
                    <p>Software Engineering Intern @ Connectbase</p>
                    <div className={"buttons"}>
                        <button className={"hire-me"}>
                            <FontAwesomeIcon icon={faPlus}/>
                            <span>Hire Me</span>
                        </button>
                        <button className={"email"}>
                            <FontAwesomeIcon icon={faCopy}/>
                            <span>Email Me</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className={"right"}>
                <img src={"/portrait.png"} alt={""}/>
            </div>
        </div>
    );
}

export default About;