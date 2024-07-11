import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import {Database} from "sqlite3";

import sqlite3 from 'sqlite3';
import { rateLimit } from "express-rate-limit";
import { jwtDecode } from "jwt-decode";

export interface GoogleAccountData {
    id: string;
    email: string;
    avatar: string;
    first_name: string;
    last_name: string;
    refresh_token: string;
}

const app = express();
const PORT = 8001;

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
app.use(cors())

const validGoogleAccessToken = async (tok: string, email: string) => {
    try {
        const res = await axios.get("https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + tok);
        if (res.status === 200) {
            if (res.data.expires_in > 0) {
                if (res.data.email === email) {
                    return true;
                }
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
    const email = req.body.email;
    console.log("DELETE COMMENT: ", id)
    try {
        if (!req.headers.authorization || !await validGoogleAccessToken(req.headers.authorization.split(" ")[1], email)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const db = await openDatabase();
        db.run("DELETE FROM comments WHERE id = ? AND email = ?", [id, email]);
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
        const exists = await getUser(id);
        if (exists) {
            return res.status(409).json({ message: 'User already exists' });
        }
        await createUser(id, email, avatar, first_name, last_name, refresh_token);
        res.json({ message: 'User created' });
    } catch (error) {
        console.log('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user', error: error });
    }
});

app.get("/api/user/:id", async (req, res) => {
    const id = decodeURIComponent(req.params.id);
    console.log("GET USER: ", id)
    try {
        const user = await getUser(id);
        return res.status(200).json({ message: 'User found', user: user });
        //return res.status(200).json(user);
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
        console.log("GET COMMENTS/ALL")
        if (err) {
            console.log('Error getting comments:', err);
            return res.status(500).json({message: 'Error getting comments', error: err});
        }
        return res.json(rows);
    });
});

app.post("/api/comment/create", async (req, res) => {
    const { title, description, author, date, email} = req.body;
    console.log("CREATE COMMENT: ", title, description, author, email)
    try {
        if (!req.headers.authorization || !await validGoogleAccessToken(req.headers.authorization.split(" ")[1], email)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        await createComment(title, description, author, email);
        res.json({ message: 'Comment created', comment: { title, description, author, email, date }});
    } catch (error) {
        console.log('Error creating comment:', error);
        res.status(500).json({ message: 'Error creating comment', error: error });
    }
});

app.post('/api/google-login', async (req, res) => {
    const { code } = req.body;
    console.log("AUTH USER")

    try {
        const response = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: 'postmessage',
            grant_type: 'authorization_code',
        });

        console.log(response.data)

        const parsed = jwtDecode(response.data.id_token) as any;

        const data: GoogleAccountData = {
            id: parsed.sub,
            email: parsed.email,
            avatar: parsed.picture,
            first_name: parsed.given_name,
            last_name: parsed.family_name,
            refresh_token: response.data.refresh_token
        }

        console.log(data)

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
    console.log(`Server is running on http://localhost:${PORT}`);
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
                    id INTEGER PRIMARY KEY NOT NULL,
                    title VARCHAR(255) NOT NULL,
                    description TEXT NOT NULL,
                    author VARCHAR(64) NOT NULL,
                    email VARCHAR(255),
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


export async function createComment(title: string, description: string, author: string, email: string) {
    const db = await openDatabase();
    const date = new Date().toISOString();
    db.run("INSERT INTO comments (title, description, author, email, date) VALUES (?, ?, ?, ?, ?)", [title, description, author, email, date]);
    db.close();
}

export async function createUser(id: string, email: string, avatar: string, first_name: string, last_name: string, refresh_token: string) {
    const db = await openDatabase();
    db.run("INSERT INTO users (id, email, avatar, first_name, last_name, refresh_token) VALUES (?, ?, ?, ?, ?, ?)", [id, email, avatar, first_name, last_name, refresh_token]);
    db.close();
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