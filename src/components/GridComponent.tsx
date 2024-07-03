import React from 'react';
import config from "../../config/config.json";
import { Tooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";

import '../css/GridComponent.css';
import "../css/SkillIcon.css";
import "../css/General.css";

const GridComponent: React.FC = () => {
    const projects = config.projects;
    const navigate = useNavigate();
    const openUrl = (url: string) => {
        const win: Window|null = window.open(url, "_blank", "noreferrer");
        win ? win.focus() : console.log("Failed to open new window.");
    }
    return (
        <div className="experiences-container component-fade-in">
            <div className="grid-container">
                {projects.map((proj, index) => (
                    <div key={index} className="grid-item">
                        <h3>{proj.name}</h3>
                        <p>{proj.description}</p>
                        <p>{proj.duration}</p>
                        <div className={"tool-icons-container"}>
                            {proj.skills.map((skill, index) => (
                                <div
                                    key={index}
                                    className="tooltipped example-container"
                                    data-tooltip-id={"my-tooltip-diff"}
                                    data-tooltip-content={skill}
                                >
                                    <img data-tooltip-id="my-tooltip-diff" className="tool-icon" src={`../../icons/${skill.toLowerCase()}.svg`} alt={"skill"} />
                                </div>
                            ))}
                        </div>
                        <Tooltip anchorSelect={".tooltipped"} place="top" id="my-tooltip-diff" className="example-diff-arrow" classNameArrow="example-arrow" border="1px solid #4c8df5"/>
                        <p className={"text"}>
                            <div className={"buttons-skills buttons"}>
                                <button className={"skill-button"} onClick={() => openUrl(proj.source)}>
                                    <span>Source Code</span>
                                </button>
                                <button className={"skill-button"} onClick={() => navigate(proj.detailRoute)}>
                                    <span>More Details</span>
                                </button>
                            </div>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GridComponent;
