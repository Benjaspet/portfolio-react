import config from "../../config/config.json";
import "../css/Boilerplate.css";
import React from "react";
import IWorkExperience from "../types/IWorkExperience.ts";

const Experience: React.FC = () => {

    const experiences: IWorkExperience[] = config.experiences;

    return (
        <div className="text-wrapper">
            {experiences.map((experience, index) => (
                <div className={"text"} key={index}>
                    <div key={index} className="info">
                        <h3>Technical Experience</h3>
                        <h4>{experience.title}</h4>
                        <h5>{experience.company} • {experience.location}</h5>
                        <h5 style={{marginTop: -26}}>{experience.duration}</h5>
                        <p className="skills">{experience.skills.join(', ')}</p>
                        <p className={"experience-info"}>{experience.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Experience;