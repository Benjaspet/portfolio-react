import React from 'react';
import config from "../../config/config.json";
import '../css/GridComponent.css';

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
                        <p style={{color: "#4c8df5"}}>{proj.skills.join(", ")}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GridComponent;
