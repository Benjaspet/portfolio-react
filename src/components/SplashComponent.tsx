import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {faCopy} from "@fortawesome/free-solid-svg-icons";

import "../css/About.css";

const SplashComponent: React.FC = () => {

    const [buttonText, setButtonText] = useState("Copy Email");

    function copyEmail() {
        navigator.clipboard.writeText("petrillo.b@northeastern.edu")
            .then(() => {
                console.log("Email copied to clipboard.");
                setButtonText("Email copied!");
            });
    }

    return (
        <>
        <div className={"about"}>
            <div className={"left"}>
                <div className={"info"}>
                    <h2>Ben Petrillo</h2>
                    <p>Northeastern University CS '26</p>
                    <div className={"buttons"}>
                        <button className={"hire-me"}>
                            <FontAwesomeIcon icon={faPlus}/>
                            <span>Hire Me</span>
                        </button>
                        <button className={"email"} onClick={copyEmail}>
                            <FontAwesomeIcon icon={faCopy}/>
                            <span>{buttonText}</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className={"right"}>
                <img src={"/portrait.png"} alt={""}/>
            </div>
        </div>
        </>
    );
}

export default SplashComponent;