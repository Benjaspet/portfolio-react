import React from 'react';
import config from "../../config/config.json";
import '../css/GridComponent.css';
import "../css/SkillIcon.css";
import "../css/General.css";

import { Tooltip } from "react-tooltip";
import {useNavigate} from "react-router-dom";

const projects = config.projects;

const GridComponent: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="experiences-container">
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
                                <button className={"skill-button"}>
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
