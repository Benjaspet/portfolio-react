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
    const os: string[] = config.skills.os;
    const interests: string[] = config.skills.interests;
    return (
        <div className={"skills"}>
            <div className={"buttons-skills-wrapper"}>
                <h3 style={{color: "white", paddingTop: 10}}>Programming Languages</h3>
                <div className={"buttons-skills"}>
                    {languages.map((language: string) => (
                        <button className={"hire-me"}>
                            <span>{language}</span>
                        </button>
                    ))}
                </div>
                <h3 style={{color: "white", paddingTop: 10}}>Technologies</h3>
                <div className={"buttons-skills"}>
                    {technologies.map((tech: string) => (
                        <button className={"hire-me"}>
                            <span>{tech}</span>
                        </button>
                    ))}
                </div>
                <h3 style={{color: "white", paddingTop: 10}}>Technical Skills</h3>
                <div className={"buttons-skills"}>
                    {technical.map((technic: string) => (
                        <button className={"hire-me"}>
                            <span>{technic}</span>
                        </button>
                    ))}
                </div>
                <h3 style={{color: "white", paddingTop: 10}}>Operating Systems</h3>
                <div className={"buttons-skills"}>
                    {os.map((system: string) => (
                        <button className={"hire-me"}>
                            <span>{system}</span>
                        </button>
                    ))}
                </div>
                <h3 style={{color: "white", paddingTop: 10}}>Interests</h3>
                <div className={"buttons-skills"}>
                    {interests.map((interest: string) => (
                        <button className={"hire-me"}>
                            <span>{interest}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Skills;