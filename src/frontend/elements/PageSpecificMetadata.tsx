/*
 * Copyright © 2024 Ben Petrillo. All rights reserved.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * All portions of this software are available for public use,
 * provided that credit is given to the original author(s).
 */

import { Helmet } from "react-helmet";
import React from "react";

export interface TitleProps {
    title: string;
}

export interface MetadataProps {
    title: string;
    description: string;
    author: string;
    properties: {
        og_title: string;
        og_description: string;
        og_site_name: string;
        og_image: string;
        og_image_type: string;
        og_image_alt: string;
        og_image_secure_url: string;
        og_type: string;
        og_url: string;
        og_locale: string;
        og_updated_time: string;
    },
    name: {
        theme_color: string;
        twitter_site: string;
        twitter_creator: string;
        twitter_title: string;
        twitter_description: string;
    }
    charset: string;
    viewport: string;
}

const PageSpecificTitle: React.FC<TitleProps> = (props: TitleProps) => {
    return (
        <div>
            <Helmet>
                <title>{props.title}</title>
            </Helmet>
        </div>
    );
}

const PageSpecificMetadata: React.FC<MetadataProps> = (props: MetadataProps) => {
    return (
        <div>
            <Helmet>
                <meta charSet={props.charset}/>
                <meta name={"viewport"} content={props.viewport}/>
                <meta name={"description"} content={props.description}/>
                <meta name={"author"} content={props.author}/>
                <meta name={"theme-color"} content={props.name.theme_color}/>
                <meta property={"og:title"} content={props.properties.og_title}/>
                <meta property={"og:description"} content={props.properties.og_description}/>
                <meta property={"og:site_name"} content={props.properties.og_site_name}/>
                <meta property={"og:image"} content={props.properties.og_image}/>
                <meta property={"og:image:type"} content={props.properties.og_image_type}/>
                <meta property={"og:image:alt"} content={props.properties.og_image_alt}/>
                <meta property={"og:image:secure_url"} content={props.properties.og_image_secure_url}/>
                <meta property={"og:type"} content={props.properties.og_type}/>
                <meta property={"og:url"} content={props.properties.og_url}/>
                <meta property={"og:locale"} content={props.properties.og_locale}/>
                <meta property={"og:updated_time"} content={props.properties.og_updated_time}/>
                <meta name={"twitter:site"} content={props.name.twitter_site}/>
                <meta name={"twitter:creator"} content={props.name.twitter_creator}/>
                <meta name={"twitter:title"} content={props.name.twitter_title}/>
                <meta name={"twitter:description"} content={props.name.twitter_description}/>
            </Helmet>
        </div>
    );
}

export { PageSpecificTitle, PageSpecificMetadata };