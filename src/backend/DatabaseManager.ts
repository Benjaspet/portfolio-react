/*
 * Copyright © 2024 Ben Petrillo. All rights reserved.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 *  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 *  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 *  WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 *  OR OTHER DEALINGS IN THE SOFTWARE.
 *
 *  All portions of this software are available for public use,
 *  provided that credit is given to the original author(s).
 */

import sqlite3, { Database } from "sqlite3";
import ShortUniqueId from "short-unique-id";

import logger from "./API.ts";

/**
 * Open a connection to the database. If no path is provided in the environment
 * variables, the default path "src/backend/database.db" will be used. If no database
 * file exists at the provided path, a new one will be created.
 *
 * @returns {Promise<Database>} a promise that resolves to a database connection.
 */
async function createDatabaseConnection(): Promise<Database> {
    return new sqlite3.Database(process.env.DATABASE_PATH || "src/backend/database.db");
}

async function createCommentsTable(): Promise<void> {
    const db: Database = await createDatabaseConnection();
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS comments (
                id VARCHAR(64) PRIMARY KEY NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                author VARCHAR(64) NOT NULL,
                uid VARCHAR(255) NOT NULL,
                date DATETIME DEFAULT CURRENT_TIMESTAMP
            )`, (err) => {
            if (err) logger.error(err.message);
        });
    });
    db.close();
}

async function createUsersTable() {
    const db: Database = await createDatabaseConnection();
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(64) NOT NULL,
                email TEXT UNIQUE NOT NULL,
                avatar TEXT NOT NULL,
                first_name VARCHAR(64) NOT NULL,
                last_name VARCHAR(64),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`, (err) => {
                if (err) logger.error(err.message);
            });
        db.run(`
            CREATE TRIGGER IF NOT EXISTS update_users_updated_at
            AFTER UPDATE ON users
            FOR EACH ROW
            BEGIN
                UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
            END`, (err) => {
                if (err) logger.error(err.message);
            });
    });
    db.close();
}

export async function createComment(
    title: string, desc: string, author: string, uid: string
): Promise<void> {
    return new Promise(async (resolve, reject) => {
        const db: Database = await createDatabaseConnection();
        const date: string = new Date().toISOString();
        const cid: string = new ShortUniqueId({ length: 10 }).rnd();
        db.run(`
            INSERT INTO comments (id, title, description, author, uid, date)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [cid, title, desc, author, uid, date], (err) => {
            if (err) {
                logger.error("Could not create comment:", err);
                reject(err);
            } else {
                resolve();
            }
        });
        db.close();
    });
}

export async function getComment(id: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        const db: Database = await createDatabaseConnection();
        db.get("SELECT * FROM comments WHERE id = ?", [id], (err, row) => {
            if (err || !row) {
                reject({ message: "Comment not found." });
            } else {
                resolve(row);
            }
        });
    });
}

export async function deleteComment(id: string) {
    return new Promise<void>(async (resolve, reject) => {
        const db: Database = await createDatabaseConnection();
        db.run("DELETE FROM comments WHERE id = ?", [id], (err) => {
            if (err) {
                logger.error("Could not delete comment:", err);
                reject(err);
            } else {
                resolve();
            }
        });
        db.close();
    });
}

export async function getAllComments() {
    return new Promise(async (resolve, reject) => {
        const db: Database = await createDatabaseConnection();
        db.all("SELECT * FROM comments", (err, rows) => {
            if (err || !rows) {
                logger.error("Could not get all comments:", err);
                reject(err);
            } else {
                resolve(rows);
            }
        });
        db.close();
    });
}

export async function createUser(
    id: string, email: string, avatar: string, first_name: string, last_name: string
) {
    return new Promise(async (resolve, reject) => {
        const db: Database = await createDatabaseConnection();
        db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
            if (err || row) {
                reject({ message: "User already exists." });
            } else {
                db.run(`
                    INSERT INTO users (id, email, avatar, first_name, last_name) 
                    VALUES (?, ?, ?, ?, ?)`, [id, email, avatar, first_name, last_name],
                    (err) => {
                        if (err) {
                            logger.error("Could not create user:", err);
                            reject(err);
                        } else {
                            db.close();
                            resolve({ message: "User created successfully." });
                        }
                    });
            }
        });
    });
}

export async function getUser(id: string) {
    return new Promise(async (resolve, reject) => {
        const db: Database = await createDatabaseConnection();
        db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
            if (err || !row) {
                reject({ message: "User not found." });
            } else {
                resolve(row);
            }
        });
    });
}

export default {
    createCommentsTable,
    createUsersTable,
}