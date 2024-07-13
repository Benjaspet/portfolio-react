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

import { Router } from "express";

import { createUser, getUser } from "../DatabaseManager.ts";
import logger from "../API.ts";

const router: Router = Router();

router.post("/create", async (req, res) => {
    const { id, email, avatar, first_name, last_name } = req.body;
    logger.debug("POST /api/user/create:", id);
    try {
        await createUser(id, email, avatar, first_name, last_name);
        const now: string = new Date().toISOString();
        res.status(200)
            .header("Content-Type", "application/json")
            .header("Access-Control-Allow-Origin", process.env.ORIGIN)
            .json({
                message: "User created successfully.",
                user: {
                    id, email, avatar, first_name, last_name,
                    created_at: now, updated_at: now
                }
            });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: error });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id: string = decodeURIComponent(req.params.id);
        logger.debug("GET /api/user/:id:", id);
        const user = await getUser(id);
        return res.status(200)
            .header("Content-Type", "application/json")
            .header("Access-Control-Allow-Origin", process.env.ORIGIN)
            .json({ message: "User found successfully.", user: user });
    } catch (error: any) {
        logger.error(error.message, decodeURIComponent(req.params.id));
        return res.status(404).json({ message: "Error getting user.", error: error.message });
    }
});

export default router;