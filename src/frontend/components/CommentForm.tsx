import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import "../css/Boilerplate.css"
import "../css/CommentForm.css";
import "../css/General.css";
import "../css/OAuth.css";

const CommentForm: React.FC = () => {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        // clear input on submit TODO: only if successful
        setTitle("");
        setDescription("");

        event.preventDefault();
        console.log("Title:", title);
        console.log("Description:", description);
    };

    return (
        <div className={"text"}>
            <p className={"pb-20"}>
                Below, you can add a comment to my portfolio. I appreciate any feedback you have to offer.
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
                    <FontAwesomeIcon icon={faPaperPlane}/>
                    <span>Submit</span>
                </button>
            </form>
        </div>
    );
};

export default CommentForm;
