import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import "../css/Boilerplate.css"
import "../css/CommentForm.css";
import "../css/General.css";
import "../css/OAuth.css";
import axios from "axios";

export interface CommentFormProps {
    name: string;
    onCommentSubmit: () => void;
}

const CommentForm: React.FC<CommentFormProps> = (props: CommentFormProps) => {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");

    // TODO: use http-only site cookies
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
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        console.log("FORM SUBMIT UID:", getCookie("uid"));

        const req = await axios.post("https://oauth2.benpetrillo.dev/api/comment/create", {
            title: title,
            description: description,
            author: props.name,
            uid: getCookie("uid"),
            date: new Date().toISOString()
        }, {
            headers: {
                "Authorization": "Bearer " + getCookie("accessToken")
            }
        });

        if (req.status !== 200) {
            console.error("Error creating comment:", req.data);
        } else {
            setTitle("");
            setDescription("");
            props.onCommentSubmit();
            console.log("Title:", title);
            console.log("Description:", description);
            console.log("UID:", getCookie("uid"));
            console.log("comment created successfully");
        }
    };

    return (
        <div className={"text"}>
            <p className={"pb-20"}>
                Below, you can add a comment to my portfolio. I appreciate any feedback you have
                to offer. Please keep it constructive and respectful. For other inquiries,
                please <a href={"mailto:me@benpetrillo.dev"}>send me an email</a> instead.
            </p>
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
