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
import APIUtil from "../APIUtil.ts";
import logger from "../API.ts";

const router: Router = Router();

router.post("/create", async (req, res) => {
    try {
        const { title, description, author, date, uid } = req.body;
        APIUtil.handleMissingBodyComponents(req, res, title, description, author, date, uid);
        if (!await isValidAccessToken(req.cookies.accessToken, uid)) {
            return res.status(401)
                .json({ message: "Unauthorized." });
        }
        await createComment(title, description, author, uid);
        return res.status(200)
            .json({
                message: "Comment created successfully.",
                comment: { title, description, author, uid, date }});
    } catch (error: any) {
        logger.error(error.message);
        return res.status(500).json({ message: error.message });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const uid = req.body.uid;
        APIUtil.handleMissingParams(req, res);
        APIUtil.handleMissingBodyComponents(req, res, uid);
        if (!await isValidAccessToken(req.cookies.accessToken, uid)) {
            return res.status(401)
                .json({ message: "Invalid access token or unauthorized." });
        }
        const comment = await getComment(id);
        if (comment.uid !== uid) {
            return res.status(401)
                .json({ message: "Unauthorized." });
        }
        await deleteComment(id);
        return res.status(200)
            .json({ message: "Comment deleted successfully." });
    } catch (error: any) {
        logger.error(error.message, "➞", req.params.id);
        return res.status(500)
            .json({ message: error.message });
    }
});

router.get("/get/:id", async (req, res) => {
    try {
        const id: string = req.params.id;
        APIUtil.handleMissingParams(req, res);
        const comment = await getComment(id);
        return res.status(200).json(comment);
    } catch (error: any) {
        logger.error(error.message, "➞", req.params.id);
        return res.status(500).json({ message: error.message });
    }
});

router.get("/all", async (_req, res) => {
    try {
        const comments = await getAllComments();
        return res.status(200).json(comments);
    } catch (error: any) {
        logger.error(error.message);
        return res.status(500)
            .json({ message: error.message });
    }
});

export default router;