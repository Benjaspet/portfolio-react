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

import React from "react";
import "react-tooltip/dist/react-tooltip.css";

import Navbar from "./components/Navbar.tsx";
import Homepage from "./pages/Homepage.tsx";
import Footer from "./components/Footer.tsx";
import FadeIn from "./components/FadeIn.tsx";

const App: React.FC = () => {
    return (
        <React.StrictMode>
            <div>
                <Navbar/>
                <Homepage/>
                <FadeIn>
                    <Footer/>
                </FadeIn>
            </div>
        </React.StrictMode>
    );
};

export default App;