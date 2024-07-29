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

import config from "../../../config/config.json";

import "../css/Skills.css";

const Skills: React.FC = () => {
    const languages: string[] = config.skills.languages;
    const technologies: string[] = config.skills.technologies;
    const technical: string[] = config.skills.technical;
    return (
        <div className={"experiences-container"}>
            <div className={"grid-container"}>
                <div className={"grid-item"}>
                    <h3 style={{paddingTop: 10, textDecoration: "underline"}}>
                        Programming Languages
                    </h3>
                    <h3>
                        {languages.map((language, index) => (
                            <React.Fragment key={language}>
                                <a className="link cursor-cross">
                                    <span>
                                        <strong>{language}</strong>
                                    </span>
                                </a>
                                {index < languages.length - 1 && ' ⁃ '}
                            </React.Fragment>
                        ))}
                    </h3>
                </div>
                <div className={"grid-item"}>
                    <h3 style={{paddingTop: 10, textDecoration: "underline"}}>
                        Technologies
                    </h3>
                    <h3>
                        {technologies.map((tech, index) => (
                            <React.Fragment key={tech}>
                                <a className="link cursor-cross">
                                    <span>
                                        <strong>{tech}</strong>
                                    </span>
                                </a>
                                {index < technologies.length - 1 && ' ⁃ '}
                            </React.Fragment>
                        ))}
                    </h3>
                </div>
                <div className={"grid-item"}>
                    <h3 style={{paddingTop: 10, textDecoration: "underline"}}>
                        Technical Skills
                    </h3>
                    <h3>
                        {technical.map((tech, index) => (
                            <React.Fragment key={tech}>
                                <a className="link cursor-cross">
                                    <span>
                                        <strong>{tech}</strong>
                                    </span>
                                </a>
                                {index < technical.length - 1 && ' ⁃ '}
                            </React.Fragment>
                        ))}
                    </h3>
                </div>
            </div>
        </div>
    );
}

export default Skills;