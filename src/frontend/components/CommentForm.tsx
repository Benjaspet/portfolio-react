import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import "../css/Boilerplate.css";
import "../css/CommentForm.css";
import "../css/General.css";
import "../css/OAuth.css";
import axios from "axios";

import config from "../../../config/config.json";

export interface CommentFormProps {
    name: string;
    onCommentSubmit: () => void;
}

const CommentForm: React.FC<CommentFormProps> = (props: CommentFormProps) => {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [statusMessage, setStatusMessage] = React.useState("");

    const getCookie = (name: string): string | null => {
        const cookieName = `${name}=`;
        const cookies = document.cookie.split(';');

        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.startsWith(cookieName)) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }
        return null;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatusMessage(""); // Reset the status message

        try {
            await axios.post(`${config.oauth_api_url}/comments/create`, {
                title: title,
                description: description,
                author: props.name,
                uid: getCookie("uid"),
                date: new Date().toISOString()
            });

        } catch (error) {
            console.error("Error creating comment:", error);
            setStatusMessage("Error creating comment");
        }

        setTitle("");
        setDescription("");
        props.onCommentSubmit();
        setStatusMessage("Comment posted successfully!");
        console.log("Comment created successfully.");
    };

    return (
        <div className={"text"}>
            <p className={"pb-10"}>
                Below, you can add a comment to my portfolio. I appreciate any feedback you have
                to offer. Please keep it constructive and respectful. For other inquiries,
                please <a href={"mailto:me@benpetrillo.dev"}>send me an email</a> instead. Thank
                you for your interest in my work!
            </p>
            {statusMessage && <p className={"text pb-15 t-success"}>{statusMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Comment Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Comment Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="oauth-button">
                    <FontAwesomeIcon icon={faPaperPlane} />
                    <span>Submit</span>
                </button>
            </form>
        </div>
    );
};

export default CommentForm;
