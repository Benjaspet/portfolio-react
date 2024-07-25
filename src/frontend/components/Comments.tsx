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

import React from "react";
import axios from "axios";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { useCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut, faCircleCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Tooltip } from "react-tooltip";

import "../css/OAuth.css";
import CommentForm from "./CommentForm.tsx";

import config from "../../../config/config.json";

export interface GoogleAccountData {
    id: string;
    email: string;
    avatar: string;
    first_name: string;
    last_name: string|null;
    created_at: string;
}

export interface PortfolioUser {
    id: string;
    email: string;
    avatar: string;
    first_name: string;
    last_name: string;
    created_at: string;
    updated_at: string;
}

axios.interceptors.request.use(
    (config) => {
        config.withCredentials = true
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

const fetchComments = async (): Promise<any> => {
    try {
        const response = await axios.get(`${config.oauth_api_url}/comments/all`);
        return response.data;
    } catch (error) {
        console.error('Error getting comments:', error);
        return [];
    }
}

const getUser = async (uid: string): Promise<PortfolioUser|null> => {
    try {
        const encoded: string = encodeURIComponent(uid);
        const response = await axios.get(`${config.oauth_api_url}/user/${encoded}`);
        console.log("User data:", response.data)
        return response.data.user;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
}

const doesUserExist = async (uid: string): Promise<boolean> => {
    const encoded: string = encodeURIComponent(uid);
    return await axios.get(`${config.oauth_api_url}/user/${encoded}`)
        .then(response => {
            return response.status === 200;
        })
        .catch(() => {
            return false;
        });
}

const formatDate = (date: string) => {
    const dateTime: Date = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
        timeZone: "America/New_York",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour12: true,
    };
    return dateTime.toLocaleTimeString("en-US", options);
}

const getCookie = (name: string): string | null => {
    const cookieName = `${name}=`;
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith(cookieName)) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return "";
};

const Comments: React.FC = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['refreshToken', 'uid']);
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [user, setUser] = React.useState<GoogleAccountData | null>(null);
    const [comments, setComments] = React.useState<object[]>([]);
    const [googlemsg, setGooglemsg] = React.useState<string>("It appears you are not logged in.");

    const fetchCommentsData = async () => {
        const commentsData = await fetchComments();
        if (Array.isArray(commentsData)) {
            console.log("Comments data:", commentsData);
            console.log(cookies);
            setComments(commentsData.reverse());
        } else {
            console.error('Expected an array, but got:', commentsData);
        }
    };

    const deleteComment = (id: string) => {
        return async () => {
            try {
                await axios.delete(`${config.oauth_api_url}/comments/delete/${id}`, {
                    data: {
                        uid: getCookie("uid")
                    }
                });
                console.log("Comment deleted successfully.");
                await fetchCommentsData();
            } catch (error) {
                console.error('Error deleting comment:', error);
            }
        }
    }

    React.useEffect(() => {

        const uid = getCookie("uid");
        const refreshToken = getCookie("refreshToken");

        if (uid && refreshToken) {
            console.log("User is logged in.", uid)
            setLoggedIn(true);
            getUser(uid).then((userData) => {
                if (userData) {
                    setUser(userData);
                }
            });
        }
        fetchCommentsData().then(() => console.log("Comments fetched."));
    }, []);

    const handleLoginSuccess = async (codeResponse: any) => {
        try {
            const code: any = codeResponse.code;
            console.log("Code:", code)
            const response = await axios.post(`${config.oauth_api_url}/auth/google-login`, { code });
            const { refresh_token, id } = response.data;

            console.log(response.data)

            /**
             * TODO: when sending requests that require authorization,
             * attempt to refresh the access token (which is stored in
             * an http-only cookie) after the 1 hour period has expired
             */

            setCookie("refreshToken", refresh_token, {
                path: '/',
                sameSite: 'strict',
                secure: true,
                maxAge: 3600000, // force logout in 1 hour
                httpOnly: false,
            });

            if (!await doesUserExist(id)) {
                await axios.post(`${config.oauth_api_url}/user/create`, {
                    id: id,
                    first_name: response.data.first_name,
                    last_name: response.data.last_name,
                    email: response.data.email,
                    avatar: response.data.avatar
                });
                console.log("New user created successfully.");
                console.log(id)
            }

            const user: PortfolioUser = {
                id: id,
                first_name: response.data.first_name,
                last_name: response.data.last_name,
                email: response.data.email,
                avatar: response.data.avatar,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }

            setCookie("uid", id, {
                path: '/',
                sameSite: 'strict',
                secure: true,
                maxAge: 3600000, // force logout in 1 hour
                httpOnly: false,
            });

            setLoggedIn(true);
            setUser(user);
        } catch (error) {
            console.error('Error exchanging code for token:', error);
        }
    };

    const handleLoginFailure = () => {
        console.error('Login Failed');
        setLoggedIn(false);
        setUser(null);
        setGooglemsg("Login failed. Please try again.");
    };

    const loggie = useGoogleLogin({
        onSuccess: handleLoginSuccess,
        onError: handleLoginFailure,
        flow: "auth-code",
        ux_mode: "popup",
    });

    const logOut = () => {
        removeCookie("refreshToken");
        removeCookie("uid");
        setLoggedIn(false);
        setUser(null);
        googleLogout();
        console.log("User logged out successfully.");
    };

    const AccountData: React.FC = () => {
        if (loggedIn && user) {
            return (
                <div className="text">
                    <div className="profile">
                        <h3 className="welcome-heading">
                            Welcome, {user.first_name}
                            <img src={user.avatar} className="circular-icon" alt="profile"/>
                        </h3>
                        <div className="profile-details">
                            <div className="profile-text">
                                <p><b>Name:</b> {user.first_name + (user.last_name ? " " + user.last_name : "")}</p>
                                <p><b>ID:</b> {user.id}</p>
                                <p><b>Email:</b> {user.email}</p>
                                <p><b>Created at:</b> {user.created_at}</p>
                            </div>
                        </div>
                        <button onClick={logOut} className="oauth-button">
                            <FontAwesomeIcon icon={faSignOut} />
                            <span>Log Out</span>
                        </button>
                    </div>
                </div>
            );
        }
        return (
            <div className="text">
                <div className="info">
                    <p>{googlemsg}</p>
                    <button onClick={() => loggie()} className="oauth-button">
                        <FontAwesomeIcon icon={faGoogle} />
                        <span>Login with Google</span>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <>
            <div>
                <div className="text-wrapper component-fade-in">
                    <AccountData />
                </div>
                {loggedIn && user && (
                    <div className="text-wrapper component-fade-in">
                        <CommentForm name={user.first_name + (user.last_name ? " " + user.last_name : "")} onCommentSubmit={fetchCommentsData}/>
                    </div>
                )}
                {comments.map((comm: any, index: number) => (
                    <div className="text text-wrapper component-fade-in comment-container" key={index}>
                        {loggedIn && user && user.id == config.developer_uuid && (
                            <FontAwesomeIcon icon={faTrash} className="trash-icon" onClick={deleteComment(comm.id)}/>
                        )}
                        <p className={"experience-info pb-10"}
                           style={{fontWeight: 650, textDecoration: "underline"}}>{comm.title}</p>
                        <p className={"experience-info"}>{comm.description}</p>
                        <div className="author-info">
                            <p className={"experience-info pt-10"}>By {comm.author}</p>
                            <Tooltip anchorSelect={".tooltipped"} place="top" id="my-tooltip-diff"
                                     className="example-diff-arrow" classNameArrow="example-arrow"
                                     border="1px solid #4c8df5"/>
                            <div
                                className="tooltipped"
                                data-tooltip-id={"my-tooltip-diff"}
                                data-tooltip-content={"Developer"}
                            >
                                {comm.uid == config.developer_uuid && (
                                    <FontAwesomeIcon data-tooltip-id="my-tooltip-diff"
                                                     icon={faCircleCheck}
                                                     className={"check-icon"}/>
                                )}
                            </div>

                        </div>
                        <p className={"experience-info pb-10"}>{formatDate(comm.date)} EST</p>
                        <p className={"experience-info"} style={{fontSize: 12, fontWeight: 650}}>Comment ID: {comm.id}</p>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Comments;
