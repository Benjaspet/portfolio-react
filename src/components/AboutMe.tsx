import React, {ReactElement} from "react";

import "../css/About.css";

import "../css/Boilerplate.css";
import ElapsedTime from "./ElapsedTime.tsx";

import config from "../../config/config.json";

interface ALinkProps {
    name: string;
    url: string;
}

const AboutMe: React.FC = () => {
    const newTabAttributes = {target: "_blank", rel: "noopener noreferrer"};
    const a_link = (props: ALinkProps): ReactElement => {
        return <a className={"link"} href={props.url} {...newTabAttributes}>{props.name}</a>;
    }

    const covidLink: ReactElement = a_link({
        name: "COVID-19 pandemic",
        url: "https://www.who.int/health-topics/coronavirus#tab=tab_1"
    });

    const {
        name,
        location,
        major,
        degree,
        graduation,
        concentration,
        url
    } = config.university;

    const neuLink: ReactElement = a_link({
        name: name,
        url: url,
    })


    return (
        <div className={"text-wrapper"}>
            <div className={"text"}>
                <div className={"info"}>
                    <p>
                        During the peak of the {covidLink}, as a high school student quarantined
                        indoors, the widespread use of technology profoundly influenced my
                        perspective. Witnessing its role in maintaining connectivity and
                        productivity highlighted its significance in daily life. This experience
                        sparked my interest in programming, driven by its ability to bridge gaps
                        and solve problems with inspiration to bring about positive innovations
                        to our world.

                        I have since developed interests in software engineering, full-stack
                        development, and algorithms. I am an individual who is propelled by
                        collaboration and teamwork, and look forward to improving my software
                        development skills with a team focused on impact.
                    </p>
                    <p>
                        I am a third-year student at {neuLink} in {location} pursuing
                        a {degree} in {major} with a concentration in {concentration} (expected: {graduation}).
                    </p>
                    <ElapsedTime/>
                </div>
            </div>
        </div>
    );
}

export default AboutMe;