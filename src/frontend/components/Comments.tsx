import React from "react";
import axios, { AxiosRequestConfig } from "axios";
import {googleLogout, useGoogleLogin} from "@react-oauth/google";
import {useCookies} from "react-cookie";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignOut} from "@fortawesome/free-solid-svg-icons";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import {faCircleCheck} from "@fortawesome/free-solid-svg-icons";

import "../css/OAuth.css";
import CommentForm from "./CommentForm.tsx";

export interface GoogleAccountData {
    id: string;
    email: string;
    avatar: string;
    first_name: string;
    last_name: string;
    created_at: string;
}

const fetchComments = async () => {
    try {
        const response = await axios.get("https://oauth2.benpetrillo.dev/api/comments/all");
        return response.data;
    } catch (error) {
        console.error('Error getting comments:', error);
        return [];
    }
}

const getUser = async (uid: string) => {
    try {
        const response = await axios.get(`https://oauth2.benpetrillo.dev/api/user/${encodeURIComponent(uid)}`);
        return response.data.user;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
}

const doesUserExist = async (uid: string): Promise<boolean> => {
    try {
        await axios.get(`https://oauth2.benpetrillo.dev/api/user/${uid}`);
        return true;
    } catch (error) {
        console.error('Error checking if user exists:', error);
        return false;
    }
};

const parsedate = (date: string) => {

    const dateTime = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    // Format time with AM/PM
    const formattedTime = dateTime.toLocaleTimeString('en-US', {...options, hour12: true});
    // Combine date and time
    return `${formattedTime}`;
}

const Comments: React.FC = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['accessToken', 'refreshToken', 'uid']);
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [user, setUser] = React.useState<GoogleAccountData | null>(null);
    const [comments, setComments] = React.useState<object[]>([]);
    const [googlemsg, setGooglemsg] = React.useState<string>("It appears you are not logged in.");

    React.useEffect(() => {
        const fetchUser = async () => {
            if (cookies.uid && cookies.refreshToken) {
                console.log("UID cookie set in useEffect:", cookies.uid);
                setLoggedIn(true);
                const userData = await getUser(cookies.uid);
                if (userData) {
                    setUser(userData);
                }
            }
        };

        const fetchCommentsData = async () => {
            const commentsData = await fetchComments();
            setComments(commentsData.reverse());
        };

        fetchUser();
        fetchCommentsData();
    }, [cookies]);

    const refreshAccessToken = async () => {
        try {
            const refreshToken = cookies.refreshToken;

            const response = await axios.post('https://oauth2.benpetrillo.dev/api/refresh-token', {
                refresh_token: refreshToken
            });

            const newAccessToken = response.data.access_token;

            setCookie("accessToken", newAccessToken, {
                path: '/',
                sameSite: 'strict',
                secure: true,
                maxAge: 3600, // 1 hour
            });

            return newAccessToken;
        } catch (error) {
            console.error('Error refreshing access token:', error);
            // refresh token expired
            handleLogout();
            return null;
        }
    };

    const makeAuthenticatedRequest = async (url: any, options: AxiosRequestConfig<any>) => {
        let accessToken = cookies.accessToken;

        // check access token expiry and validity
        const res = await axios.get("https://oauth2.googleapis.com/tokeninfo", {
            params: {
                access_token: accessToken,
            },
        });
        const tokenExpired = res.data.exp < Date.now() / 1000;

        if (tokenExpired) {
            accessToken = await refreshAccessToken();
            if (!accessToken) {
                // logout, as refresh token is expired
                handleLogout();
                return;
            }
        }

        try {
            const response = await axios({
                url: url,
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            return response;
        } catch (error) {
            console.error('Error making authenticated request:', error);
            return null;
        }
    };


    const handleLoginSuccess = async (codeResponse: any) => {
        try {
            const response = await axios.post('https://oauth2.benpetrillo.dev/api/google-login', { code: codeResponse.code });
            const { access_token, refresh_token, id } = response.data;

            console.clear();
            console.log(response.data);

            // TODO: encrypt all values stored in cookies
            setCookie("accessToken", access_token, {
                path: '/',
                sameSite: 'strict',
                secure: true,
                maxAge: 3600,
            });

            setCookie("refreshToken", refresh_token, {
                path: '/',
                sameSite: 'strict',
                secure: true,
                maxAge: 30 * 24 * 60 * 60,
            });

            console.log("setting uid cookie", id)

            setCookie("uid", id, {
                path: '/',
                sameSite: 'strict',
                secure: true,
                maxAge: 30 * 24 * 60 * 60,
            });

            setLoggedIn(true);

            const exists = await doesUserExist(id)
            console.log("User exists:", exists, id)
            if (!exists) {
                await axios.post("https://oauth2.benpetrillo.dev/api/create-user", {
                    id: response.data.id,
                    first_name: response.data.first_name,
                    last_name: response.data.last_name || "N/A",
                    email: response.data.email,
                    avatar: response.data.avatar,
                    refresh_token: refresh_token,
                });
                console.log("New user created successfully");
            }

            const u = await getUser(id);
            setUser(u);
            console.log("user set")
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
        scope: "openid profile email",

    });

    const handleLogout = () => {
        removeCookie('accessToken');
        removeCookie('refreshToken');
        removeCookie('uid');
        setLoggedIn(false);
        setUser(null);
        googleLogout();
        console.log('Logout Successful');
    };

    const refreshComments = async () => {
        const commentsData = await fetchComments();
        setComments(commentsData.reverse());
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
                                <p><b>Name:</b> {user.first_name} {user.last_name}</p>
                                <p><b>ID:</b> {user.id}</p>
                                <p><b>Email:</b> {user.email}</p>
                                <p><b>Created at:</b> {user.created_at}</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="oauth-button">
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
                <div className="text-wrapper component-fade-in">
                    {loggedIn && user ? (
                        <CommentForm name={user.first_name + " " + user.last_name} onCommentSubmit={refreshComments}/>
                    ) : (
                        <p>You're not logged in.</p>
                    )}
                </div>
                {comments.map((comm: any, index: number) => (
                    <div className="text text-wrapper component-fade-in" key={index}>
                        <p className={"experience-info"}>{comm.description}</p>
                        <div className="author-info">
                            <p className={"experience-info pt-10"}>By {comm.author}</p>
                            <FontAwesomeIcon icon={faCircleCheck} className={"check-icon"}/>
                        </div>
                        <p className={"experience-info"}>{parsedate(comm.date)} EST</p>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Comments;
