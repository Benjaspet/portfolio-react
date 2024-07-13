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

import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Express } from "express";
import { rateLimit } from "express-rate-limit";
import { ILogObj, Logger } from "tslog";

import authRoute from "./routes/AuthRoute.ts";
import userRoute from "./routes/UserRoute.ts";
import commentRoute from "./routes/CommentRoute.ts";
import DatabaseManager from "./DatabaseManager.ts";

const logger: Logger<ILogObj> = new Logger({
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
    }
});

const app: Express = express();

app.set("trust proxy", "127.0.0.1");

app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.ORIGIN || "http://localhost:8000"
}))

app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // 100 requests per window
    standardHeaders: "draft-7",
    legacyHeaders: false, // disable the `X-RateLimit-*` headers
}))

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/auth", authRoute)
app.use("/api/user", userRoute);
app.use("/api/comments", commentRoute);

app.listen(process.env.PORT, () => {
    logger.info(`Now running on https://localhost:${process.env.PORT}.`);
    (async () => {
        await DatabaseManager.createUsersTable();
        await DatabaseManager.createCommentsTable();
    })();
});

export default logger;