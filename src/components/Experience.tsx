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

import config from "../../config/config.json";
import "../css/Boilerplate.css";
import "../css/General.css";
import React from "react";
import IWorkExperience from "../types/IWorkExperience.ts";

const Experience: React.FC = () => {

    const experiences: IWorkExperience[] = config.experiences;

    return (
        <div className="text-wrapper">
            <div className={"info text"}>
                <h3>Technical Experience</h3>
            </div>
            {experiences.map((experience, index) => (
                <div className={"text"} key={index}>
                    <div key={index} className="info">
                        <h4 className={"pt-20"}>{experience.title}</h4>
                        <h5>{experience.company} • {experience.location}</h5>
                        <h5 style={{marginTop: -25}}>{experience.duration}</h5>
                        <p className={"experience-info"}>{experience.description}</p>
                        <div className={"buttons-skills buttons"}>
                            {experience.skills.map((skill: string) => (
                                <button className={"skill-button"}>
                                    <span>{skill}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Experience;