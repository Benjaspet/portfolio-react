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

import axios from "axios";
import {jwtDecode} from "jwt-decode";
import {GoogleAccountData} from "../Types.ts";
import logger from "../API.ts";
import {Router} from "express";

const router: Router = Router();

router.post("/google-login", async (req, res) => {
    try {
        const { code } = req.body;
        const response = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: 'postmessage',
            grant_type: 'authorization_code',
        });

        logger.debug("POST /api/auth/google-login:", code)

        const parsed = jwtDecode(response.data.id_token) as any;

        console.log(parsed)

        const data: GoogleAccountData = {
            id: parsed.sub,
            email: parsed.email,
            avatar: parsed.picture,
            first_name: parsed.given_name,
            last_name: parsed.family_name,
            refresh_token: response.data.refresh_token,
            access_token: response.data.access_token
        }

        // {
        //     iss: 'https://accounts.google.com',
        //         azp: '619419554649-0mupmhijo1d1ua2n09krlnaodgvd4a8c.apps.googleusercontent.com',
        //     aud: '619419554649-0mupmhijo1d1ua2n09krlnaodgvd4a8c.apps.googleusercontent.com',
        //     sub: '113552387186800928295',
        //     email: 'bpsgservers@gmail.com',
        //     email_verified: true,
        //     at_hash: 'MzzmsrEGs0yG_hvPabUSmA',
        //     name: 'CoolCollectibles',
        //     picture: 'https://lh3.googleusercontent.com/a/ACg8ocKNEZ5D3lRZj-27Lxneeeav2JB-wVbA1QrIZG2TlCTb9Dpgm-8H=s96-c',
        //     given_name: 'CoolCollectibles',
        //     iat: 1720836969,
        //     exp: 1720840569
        // }

        res.cookie("accessToken", response.data.access_token, {
            sameSite: "none",
            secure: true,
            maxAge: 3600000, // expires in 1 hour
            httpOnly: true,
        })

        logger.info(response.data)

        return res.status(200)
            .header("Content-Type", "application/json")
            .json(data);

    } catch (error) {
        logger.error("Error exchanging refresh token for access token:", error);
        res.status(500)
            .header("Content-Type", "application/json")
            .header("Access-Control-Allow-Origin", process.env.ORIGIN)
            .json({
                message: "Error exchanging refresh token for access token.",
                error: error
            });
    }
});

router.post("/refresh-token", async (req, res) => {
    try {
        const refreshToken = decodeURIComponent(req.body.refreshToken);
        const response = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
        });

        logger.debug("POST /api/auth/refresh-token: ", refreshToken);

        const newAccessToken = response.data.access_token;

        res.cookie("accessToken", newAccessToken, {
            sameSite: 'none',
            secure: true,
            maxAge: 3600000, // expires in 1 hour
            httpOnly: true,
        })

        res.status(200)
            .header("Content-Type", "application/json")
            .header("Access-Control-Allow-Origin", process.env.ORIGIN)
            .json({ message: "Successfully refreshed access token." });
    } catch (error) {
        logger.error("Error refreshing access token.");
        res.status(500)
            .header("Content-Type", "application/json")
            .header("Access-Control-Allow-Origin", process.env.ORIGIN)
            .send({
                message: "Error refreshing access token.",
                error: error
            });
    }
});

export default router;