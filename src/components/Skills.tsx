import React from "react";

import "../css/Skills.css";

const Skills: React.FC = () => {
    return (
        <div className={"skills"}>
            <div className={"text-wrapper"}>
                <div className={"text"}>
                    <div className={"info"}>
                        <h3>Technical Experience</h3>
                        <h4>Lead Teaching Assistant</h4>
                        <h5>Northeastern University • Boston, MA</h5>
                        <h5 style={{marginTop: -26}}>May 2024 — July 2024</h5>
                        <p className={"skills"}>Java, JUnit, Curriculum Development, Leadership</p>
                        <p>
                            As a Lead Teaching Assistant for CS3500, I led and instructed two weekly labs.
                        </p>
                    </div>
                </div>
            </div>
            <div className={"buttons-skills-wrapper"}>
                <h3 style={{color: "white", paddingTop: 10}}>Programming Languages</h3>
                <div className={"buttons-skills"}>
                    <button className={"hire-me"}>
                        <span>Java</span>
                    </button>
                    <button className={"hire-me"}>
                        <span>TypeScript/JavaScript</span>
                    </button>
                    <button className={"hire-me"}>
                        <span>Python</span>
                    </button>
                </div>
                <h3 style={{color: "white", paddingTop: 10}}>More Languages</h3>
                <div className={"buttons-skills"}>
                    <button className={"hire-me"}>
                        <span>HTML</span>
                    </button>
                    <button className={"hire-me"}>
                        <span>CSS</span>
                    </button>
                    <button className={"hire-me"}>
                        <span>PHP</span>
                    </button>
                    <button className={"hire-me"}>
                        <span>Racket/Lisp</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Skills;