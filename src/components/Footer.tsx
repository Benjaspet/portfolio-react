import React, {ReactElement} from "react";

import "../css/Footer.css";
import "../css/Boilerplate.css";

import config from "../../config/config.json";
import {Link} from "react-router-dom";

interface ALinkProps {
    name: string;
    url: string;
}

const Skills: React.FC = () => {

    const currentYear: number = new Date().getFullYear();

    const githubProps: ALinkProps = {
        name: "Ben Petrillo",
        url: config.links.github
    }

    const linkedinProps: ALinkProps = {
        name: "LinkedIn",
        url: config.links.linkedin
    }

    const links = config.links;
    const newTabAttributes = {target: "_blank", rel: "noopener noreferrer"};

    const a_link = (props: ALinkProps): ReactElement => {
        return <a href={props.url} {...newTabAttributes}>{props.name}</a>;
    }

    const resume: ReactElement = <a href={links.resume} {...newTabAttributes}>Resume</a>;
    const react: ReactElement = <a href={links.general.react}>React</a>;
    const separator: ReactElement = <a className={"separator"}>•</a>;

    return (
        <footer>
            <div className={"socials"}>
                {a_link(githubProps)} {separator} {a_link(linkedinProps)} {separator} {resume}
            </div>
            <p style={{color: "whitesmoke", paddingTop: 10}}><Link to={"/project-license"}>Copyright</Link> © {currentYear} {a_link(linkedinProps)}</p>
            <p style={{color: "whitesmoke"}}>Made with ❤️ and {react}</p>
        </footer>
    );
}

export default Skills;