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
import logger from "./API.ts";

export const isValidAccessToken = async (token: string, uid: string) => {
    try {
        const enc = encodeURIComponent(token);
        const url: string = `https://oauth2.googleapis.com/tokeninfo?access_token=${enc}`;
        const res = await axios.get(url);
        if (res.status === 200) {
            return res.data.expires_in > 0 && res.data.sub === uid
        } else return false;
    } catch (error: any) {
        logger.error(error.message);
        return false;
    }
}

export default {
    isValidAccessToken
};