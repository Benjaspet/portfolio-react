import {PageSpecificTitle} from "../elements/PageSpecificMetadata.tsx";
import React from "react";
import FadeInHOC from "../components/higher-order/FadeInHOC.tsx";
import config from "../../config/config.json";
import ProjectLicense from "../components/ProjectLicense.tsx";
import Footer from "../components/Footer.tsx";

const Homepage: React.FC = () => {
    const {license} = config.metadata;
    return (
        <div>
            <PageSpecificTitle title={license.title}/>
            <FadeInHOC>
                <ProjectLicense/>
            </FadeInHOC>
            <FadeInHOC>
                <Footer/>
            </FadeInHOC>
        </div>
    );
}

export default Homepage;