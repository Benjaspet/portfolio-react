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

import { Router } from "express";

import { createComment, getComment, deleteComment, getAllComments } from "../DatabaseManager.ts";
import { isValidAccessToken } from "../GoogleOAuth2API.ts";
import logger from "../API.ts";

const router: Router = Router();

router.post("/create", async (req, res) => {
    try {
        const { title, description, author, date, uid } = req.body;
        if (!await isValidAccessToken(req.cookies.accessToken, uid)) {
            return res.status(401)
                .header("Content-Type", "application/json")
                .header("Access-Control-Allow-Origin", process.env.ORIGIN)
                .json({ message: "Unauthorized." });
        }
        await createComment(title, description, author, uid);
        return res.status(200)
            .header("Content-Type", "application/json")
            .header("Access-Control-Allow-Origin", process.env.ORIGIN)
            .json({
                message: "Comment created successfully.",
                comment: { title, description, author, uid, date }});
    } catch (error) {
        logger.error("Could not create comment:", error);
        return res.status(500).json({ message: 'Error creating comment', error: error });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const uid = req.body.uid;
        if (!await isValidAccessToken(req.cookies.accessToken, uid)) {
            return res.status(401)
                .header("Content-Type", "application/json")
                .header("Access-Control-Allow-Origin", process.env.ORIGIN)
                .json({ message: "Invalid access token or unauthorized." });
        }
        const comment = await getComment(id);
        console.log(comment)
        if (comment.uid !== uid) {
            return res.status(401)
                .header("Content-Type", "application/json")
                .header("Access-Control-Allow-Origin", process.env.ORIGIN)
                .json({ message: "Unauthorized." });
        }
        await deleteComment(id);
        logger.debug("DELETE /comments/delete/:id:", id);
        return res.status(200)
            .header("Content-Type", "application/json")
            .header("Access-Control-Allow-Origin", process.env.ORIGIN)
            .json({ message: "Comment deleted successfully." });
    } catch (error) {
        logger.error("Could not delete comment:", error);
        return res.status(500)
            .header("Content-Type", "application/json")
            .header("Access-Control-Allow-Origin", process.env.ORIGIN)
            .json({ message: "Could not delete comment.", error: error });
    }
});

router.get("/get/:id", async (req, res) => {
    try {
        const id: string = req.params.id;
        logger.debug("GET /comments/:id:", id);
        const comment = await getComment(id);
        return res.status(200)
            .header("Content-Type", "application/json")
            .header("Access-Control-Allow-Origin", process.env.ORIGIN)
            .json(comment);
    } catch (error) {
        logger.error("Error getting comment:", error);
        return res.status(500).json({ message: "Error getting comment.", error: error });
    }
});

router.get("/all", async (_req, res) => {
    try {
        logger.debug("GET /comments/all");
        const comments = await getAllComments();
        return res.status(200)
            .header("Content-Type", "application/json")
            .header("Access-Control-Allow-Origin", process.env.ORIGIN)
            .json(comments);
    } catch (error) {
        logger.error("Error getting comments:", error);
        return res.status(500)
            .header("Content-Type", "application/json")
            .header("Access-Control-Allow-Origin", process.env.ORIGIN)
            .json({ message: "Error getting comments.", error: error });
    }
});



export default router;