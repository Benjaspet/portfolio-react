import React, {ReactElement} from "react";

import "../css/Footer.css";
import "../css/Boilerplate.css";

const Skills: React.FC = () => {

    const links = {
        github: "https://github.com/benjaspet",
        linkedin: "https://linkedin.com/in/ben-petrillo",
        resume: "../benjamin_petrillo_resume.pdf",
        react: "https://reactjs.org/"
    }

    const newTabAttributes = {target: "_blank", rel: "noopener noreferrer"};

    const github: any = (name: string) => {
        return <a href={links.github} {...newTabAttributes}>{name}</a>;
    }

    const linkedin: any = (name: string) => {
        return <a href={links.linkedin} {...newTabAttributes}>{name}</a>;
    }

    const resume: ReactElement = <a href={links.resume} {...newTabAttributes}>Resume</a>;
    const react: ReactElement = <a href={links.react}>React</a>;
    const separator: ReactElement = <a className={"separator"}>•</a>;

    return (
        <footer className={"component-fade-in"}>
            <div className={"socials"}>
                {github("GitHub")} {separator} {linkedin("LinkedIn")} {separator} {resume}
            </div>
            <p style={{color: "whitesmoke", paddingTop: 10}}>Copyright © 2024 {linkedin("Ben Petrillo")}</p>
            <p style={{color: "whitesmoke"}}>Made with ❤️ and {react}</p>
        </footer>
    );
}

export default Skills;