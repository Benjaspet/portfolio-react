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

import { Request, Response } from "express";

export default class APIUtil {

    static handleMissingParams(req: Request, res: Response): Response|void {
        if (!req.params) {
            return res.status(400)
                .json({ message: "Missing required parameters." });
        }
    }

    static handleMissingBodyComponents(req: Request, res: Response, ...comps: any[]): Response|void {
        if (!req.body) {
            return res.status(400)
                .json({ message: "Missing required body." });
        }
        if (comps.some(comp => !req.body[comp])) {
            return res.status(400)
                .json({ message: `Missing required body components: ${comps.join(", ")}.` });
        }
    }
}