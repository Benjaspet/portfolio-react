import React from "react";

import "../css/About.css";
import Navbar from "./Navbar.tsx";

import "../css/Boilerplate.css";

import config from "../../config/config.json";
import {PageSpecificMetadata, PageSpecificTitle} from "../elements/PageSpecificMetadata.tsx";

const ProjectLicense: React.FC = () => {
    const {license} = config.metadata;
    return (
        <>
            <PageSpecificTitle title={license.title}/>
            <PageSpecificMetadata
                title={license.title}
                description={license.description}
                author={license.author}
                properties={{
                    og_title: license.properties.og_title,
                    og_description: license.properties.og_description,
                    og_site_name: license.properties.og_site_name,
                    og_image: license.properties.og_image,
                    og_image_type: license.properties.og_image_type,
                    og_image_alt: license.properties.og_image_alt,
                    og_image_secure_url: license.properties.og_image_secure_url,
                    og_type: license.properties.og_type,
                    og_url: license.properties.og_url,
                    og_locale: license.properties.og_locale,
                    og_updated_time: new Date().toISOString()
                }}
                name={{
                    theme_color: license.name.theme_color,
                    twitter_site: license.name.twitter_site,
                    twitter_creator: license.name.twitter_creator,
                    twitter_title: license.name.twitter_title,
                    twitter_description: license.name.twitter_description,
                }}
                charset={license.charset}
                viewport={license.viewport}
            />
            <Navbar/>
            <div className={"text-wrapper component-fade-in"}>
                <div className={"text"}>
                    <div className={"info"}>
                        <h2 style={{textDecoration: "underline", textUnderlineOffset: 4}}>MIT License</h2>
                        <p>
                            Copyright © {new Date().getFullYear()} Ben Petrillo
                        </p>
                        <p>
                            Permission is hereby granted, free of charge, to any person obtaining
                            a copy of this software and associated documentation files
                            (the “Software”), to deal in the Software without restriction,
                            including without limitation the rights to use, copy, modify, merge,
                            publish, distribute, sublicense, and/or sell copies of the Software,
                            and to permit persons to whom the Software is furnished to do so,
                            subject to the following conditions:
                        </p>
                        <p>
                            The above copyright notice and this permission notice shall be
                            included in all copies or substantial portions of the Software.
                        </p>
                        <p>
                            THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND,
                            EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
                            OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
                            NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
                            BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
                            ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
                            CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProjectLicense;