import Helmet from "react-helmet";
import React from "react";

interface MetadataProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
}

const Metadata: React.FC = (props: MetadataProps) => {

    const {
        title = "Ben Petrillo • Portfolio",
        description = "This is my portfolio.",
        image = "./portfolio.png",
        url = "https://example.com",
    } = props;

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />
        </Helmet>
    );
}

export default Metadata;