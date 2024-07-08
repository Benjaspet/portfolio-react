import {PageSpecificTitle} from "../elements/PageSpecificMetadata.tsx";
import SplashComponent from "../components/SplashComponent.tsx";
import Experience from "../components/Experience.tsx";
import React from "react";
import GridComponent from "../components/GridComponent.tsx";
import Skills from "../components/Skills.tsx";
import FadeInHOC from "../components/higher-order/FadeInHOC.tsx";
import AboutMe from "../components/AboutMe.tsx";

import config from "../../config/config.json";

const Homepage: React.FC = () => {
    return (
        <div>
            <PageSpecificTitle title={config.metadata.home.title}/>
            <FadeInHOC>
                <SplashComponent/>
            </FadeInHOC>
            <FadeInHOC>
                <AboutMe/>
            </FadeInHOC>
            <FadeInHOC>
                <Experience/>
            </FadeInHOC>
            <FadeInHOC>
                <GridComponent/>
            </FadeInHOC>
            <FadeInHOC>
                <Skills/>
            </FadeInHOC>
        </div>
    );
}

export default Homepage;