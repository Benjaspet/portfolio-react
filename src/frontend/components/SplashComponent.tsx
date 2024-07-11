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

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCopy } from "@fortawesome/free-solid-svg-icons";

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