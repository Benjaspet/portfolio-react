import React from "react";
import {Helmet} from "react-helmet";

interface MetadataProps {
    title: string;
    description: string;
    image: string;
    url: string;
    keywords?: string;
    author?: string;
}

const Metadata: React.FC<MetadataProps> = ({title, description, image, url, keywords, author}) => {
    return <Helmet>
        <title>{title}</title>
        <meta name="description" content={description}/>
        <meta property="og:title" content={title}/>
        <meta property="og:description" content={description}/>
        <meta property="og:image" content={image}/>
        <meta property="og:url" content={url}/>
        <meta property="og:type" content="website"/>
        <meta name="twitter:card" content="summary"/>
        <meta name="twitter:creator" content={author}/>
        <meta name="twitter:title" content={title}/>
        <meta name="twitter:description" content={description}/>
        <meta name="twitter:image" content={image}/>
        {keywords && <meta name="keywords" content={keywords}/>}
        {author && <meta name="author" content={author}/>}
    </Helmet>;
}

export default Metadata;