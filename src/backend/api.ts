import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import {Database} from "sqlite3";

import sqlite3 from 'sqlite3';
import { rateLimit } from "express-rate-limit";
import { jwtDecode } from "jwt-decode";
import ShortUniqueId from "short-unique-id";

import cookieParser from "cookie-parser";

import { Logger } from "tslog";

const logger = new Logger({
    name: "Portfolio API",
    type: "pretty",
    stylePrettyLogs: true,
    prettyLogTemplate: "[{{yyyy}}-{{mm}}-{{dd}} {{hh}}:{{MM}}:{{ss}}] [{{logLevelName}}] [{{filePathWithLine}}] ➞ ",
    prettyLogTimeZone: "local",
    prettyLogStyles: {
        logLevelName: {
            INFO: ['bold', 'blue'],
            DEBUG: ['bold', 'green'],
            WARN: ['bold', 'yellow'],
            ERROR: ['bold', 'red'],
        },
        yyyy: 'magenta', mm: 'magenta', dd: 'magenta', hh: 'magenta', MM: 'magenta', ss: 'magenta',
        filePathWithLine: 'magenta',
    },
})

export interface GoogleAccountData {
    id: string;
    email: string;
    avatar: string;
    first_name: string;
    last_name: string;
    refresh_token: string;
    access_token: string;
}

const app = express();
const PORT = 8001;

app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.ORIGIN || "http://localhost:8000"
}))

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
})

// Apply the rate limiting middleware to all requests.
app.use(limiter)

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('trust proxy', '127.0.0.1');

const validGoogleAccessToken = async (tok: string, uid: string) => {
    try {
        const res = await axios.get("https://oauth2.googleapis.com/tokeninfo?access_token=" + tok);
        if (res.status === 200) {
            if (res.data.expires_in > 0 && res.data.sub === uid) {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.log('Error validating Google access token:', error);
        return false;
    }
}

app.delete("/api/comment/delete/:id", async (req, res) => {

    const id = parseInt(req.params.id);
    const uid = req.body.uid;
    console.log("DELETE COMMENT: ", id)
    try {
        if (!req.headers.authorization || !await validGoogleAccessToken(req.headers.authorization.split(" ")[1], uid)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const db = await openDatabase();
        db.run("DELETE FROM comments WHERE id = ? AND uid = ?", [id, uid]);
        db.close();
        return res.status(200).json({ message: 'Comment deleted' });
    } catch (error) {
        console.log('Error deleting comment:', error);
        return res.status(500).json({ message: 'Error deleting comment', error: error });
    }
});

app.post('/api/create-user', async (req, res) => {
    const { id, email, avatar, first_name, last_name, refresh_token } = req.body;
    console.log("CREATE USER: ", id, email, avatar, first_name, last_name, refresh_token)
    try {
        await createUser(id, email, avatar, first_name, last_name, refresh_token);
        const now: string = new Date().toISOString();
        res.status(200).json(
            {
                message: 'User created',
                user: { id, email, avatar, first_name, last_name, refresh_token, created_at: now, updated_at: now }
            });
    } catch (error) {
        console.log('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user', error: error });
    }
});

app.get("/api/user/:id", async (req, res) => {

    const id = decodeURIComponent(req.params.id);

    logger.debug("GET USER / ", id)

    try {
        const user = await getUser(id);
        return res.status(200).json({ message: 'User found', user: user });
    } catch (error) {
        console.log('Error getting user:', error);
        return res.status(500).json({ message: 'Error getting user', error: error });
    }
});

app.get("/api/comment/:id", async (req, res) => {
    const id: number = parseInt(req.params.id);
    try {
        const comment = await getComment(id);
        console.log("GET COMMENT: ", id)
        return res.json(comment);
    } catch (error) {
        console.log('Error getting comment:', error);
        return res.status(500).json({ message: 'Error getting comment', error: error });
    }
});

app.get("/api/comments/all", async (_req, res) => {
    const db = await openDatabase();
    db.all("SELECT * FROM comments", (err, rows) => {
        console.log("GET COMMENTS / ALL")
        if (err) {
            console.log('Error getting comments:', err);
            return res.status(500)
                .header("Content-Type", "application/json")
                .header("Access-Control-Allow-Origin", process.env.ORIGIN)
                .json({message: 'Error getting comments', error: err});
        }
        return res.status(200)
            .header("Content-Type", "application/json")
            .header("Access-Control-Allow-Origin", process.env.ORIGIN)
            .json(rows);
    });
});

app.post("/api/comment/create", async (req, res) => {
    const { title, description, author, date, uid} = req.body;
    const cid = new ShortUniqueId({ length: 10 }).rnd();
    console.log("CREATE COMMENT: ", title, description, author, uid)
    console.log("SERVER SIDED COOKIES: ", req.cookies);
    try {
        console.log(req.cookies);
        //console.log(await validGoogleAccessToken(req.headers.authorization.split(" ")[1], uid));
        if (!req.headers.authorization || !await validGoogleAccessToken(req.cookies.accessToken, uid)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        await createComment(title, description, author, uid, cid);
        res.json({ message: 'Comment created', comment: { title, description, author, uid, date }});
    } catch (error) {
        console.log('Error creating comment:', error);
        res.status(500).json({ message: 'Error creating comment', error: error });
    }
});

app.post('/api/google-login', async (req, res) => {
    const { code } = req.body;
    console.log("POST /api/google-login: ", code)

    try {
        const response = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: 'postmessage',
            grant_type: 'authorization_code',
        });

        const parsed = jwtDecode(response.data.id_token) as any;

        const data: GoogleAccountData = {
            id: parsed.sub,
            email: parsed.email,
            avatar: parsed.picture,
            first_name: parsed.given_name,
            last_name: parsed.family_name,
            refresh_token: response.data.refresh_token,
            access_token: response.data.access_token
        }

        res.cookie("accessToken", response.data.access_token, {
            sameSite: 'none',
            secure: true,
            maxAge: 3600000, // 1 hour
            httpOnly: true,
        })

        return res.status(200).json(data)

    } catch (error) {
        console.log("client_id: " + process.env.GOOGLE_CLIENT_ID)
        console.log("client_secret: " + process.env.GOOGLE_CLIENT_SECRET)
        console.log('Error exchanging code for token:', error);
        res.status(500).json({ message: 'Error exchanging code for token', error: error });
    }
});

app.post('/api/refresh-token', async (req, res) => {
    const refreshToken = req.body.refresh_token;

    try {
        const response = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
        });

        const newAccessToken = response.data.access_token;
        res.status(200).json({ access_token: newAccessToken });
    } catch (error) {
        console.error("ERROR REFRESHING ACCESS TOKEN");
        res.status(500).send('Error refreshing access token');
    }
});

app.listen(PORT, () => {

    logger.info(`Now running on https://localhost:${PORT}.`);

    (async () => {
        await createUsersTable();
        await createCommentsTable();
    })();
});

export async function openDatabase(): Promise<Database> {
    return new sqlite3.Database('src/backend/database.db')
}

export async function createCommentsTable() {
    const db = await openDatabase();
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS comments (
                    id VARCHAR(64) PRIMARY KEY NOT NULL,
                    title VARCHAR(255) NOT NULL,
                    description TEXT NOT NULL,
                    author VARCHAR(64) NOT NULL,
                    uid VARCHAR(255) NOT NULL,
                    date DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    })
    db.close();
}

export async function createUsersTable() {
    const db = await openDatabase();
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
                    id INTEGER NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    avatar TEXT NOT NULL,
                    first_name VARCHAR(64) NOT NULL,
                    last_name VARCHAR(64) NOT NULL,
                    refresh_token TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TRIGGER IF NOT EXISTS update_users_updated_at
                    AFTER UPDATE ON users
                    FOR EACH ROW
                    BEGIN
                        UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
                    END`);

    })

    db.close();
}


export async function createComment(title: string, description: string, author: string, uid: string, cid: string) {
    const db = await openDatabase();
    const date = new Date().toISOString();
    db.run("INSERT INTO comments (id, title, description, author, uid, date) VALUES (?, ?, ?, ?, ?, ?)", [cid, title, description, author, uid, date]);
    db.close();
}

export async function createUser(id: string, email: string, avatar: string, first_name: string, last_name: string, refresh_token: string) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
            if (err || row) {
                reject({message: 'User already exists'});
            } else {
                db.run("INSERT INTO users (id, email, avatar, first_name, last_name, refresh_token) VALUES (?, ?, ?, ?, ?, ?)", [id, email, avatar, first_name, last_name, refresh_token]);
                db.close();
                resolve({message: 'User created'})
            }
        });
    });
}

export async function updateUser(email: string, avatar: string, first_name: string, last_name: string) {
    const db = await openDatabase();
    db.run("UPDATE users SET avatar = ?, first_name = ?, last_name = ? WHERE email = ?", [avatar, first_name, last_name, email]);
    db.close();
}

export async function getUser(id: string) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
            if (err || !row) {
                reject({message: 'User not found'});
            } else {
                resolve(row);
            }
        });
    });
}

export async function getComment(id: number) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM comments WHERE id = ?", [id], (err, row) => {
            if (err || !row) {
                reject({message: 'Comment not found'});
            } else {
                resolve(row);
            }
        });
    });
}