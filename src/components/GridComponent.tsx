import React from 'react';
import config from "../../config/config.json";
import '../css/GridComponent.css';
import "../css/SkillIcon.css";

import { Tooltip } from "react-tooltip";

const projects = config.projects;

const GridComponent: React.FC = () => {
    return (
        <div className="experiences-container">
            <div className="grid-container">
                {projects.map((proj, index) => (
                    <div key={index} className="grid-item">
                        <h3>{proj.name}</h3>
                        <p>{proj.description}</p>
                        <p>{proj.duration}</p>
                        <p style={{ color: "#4c8df5" }}>{proj.skills.join(", ")}</p>
                        <div className={"tool-icons-container"}>
                            {proj.skills.map((skill, index) => (
                                <div
                                    key={index}
                                    className="tooltipped example-container"
                                    data-tooltip-id={"my-tooltip-diff"}
                                    data-tooltip-content={skill}
                                >
                                    <img data-tooltip-id="my-tooltip-diff" className="tool-icon" src={`../../icons/${skill.toLowerCase()}.svg`} alt={skill} />
                                </div>
                            ))}
                        </div>
                        <Tooltip anchorSelect={".tooltipped"} place="top" id="my-tooltip-diff" className="example-diff-arrow" classNameArrow="example-arrow" border="1px solid #4c8df5"/>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GridComponent;
