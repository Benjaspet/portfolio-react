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

import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import App from "./App.tsx";
import LicensePage from "./pages/LicensePage.tsx";
import CommentsPage from "./pages/CommentsPage.tsx";
import PonjoPasteDetailsPage from "./pages/details/PonjoPastesDetailsPage.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <GoogleOAuthProvider clientId={"619419554649-0mupmhijo1d1ua2n09krlnaodgvd4a8c.apps.googleusercontent.com"}>
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/comments" element={<CommentsPage />} />
                <Route path="/project-license" element={<LicensePage />} />
                <Route path="/ponjo-pastes" element={<PonjoPasteDetailsPage />}/>
            </Routes>
        </Router>
    </GoogleOAuthProvider>
);