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

import config from "../../../config/config.json";
import SplashComponent from "../components/SplashComponent.tsx";
import Experience from "../components/Experience.tsx";
import GridComponent from "../components/GridComponent.tsx";
import Skills from "../components/Skills.tsx";
import FadeIn from "../components/FadeIn.tsx";
import AboutMe from "../components/AboutMe.tsx";
import { PageSpecificTitle } from "../elements/PageSpecificMetadata.tsx";

const Homepage: React.FC = () => {
    return (
        <div>
            <PageSpecificTitle title={config.metadata.home.title}/>
            <FadeIn>
                <SplashComponent/>
            </FadeIn>
            <FadeIn>
                <AboutMe/>
            </FadeIn>
            <FadeIn>
                <Experience/>
            </FadeIn>
            <FadeIn>
                <Skills/>
            </FadeIn>
            <FadeIn>
                <GridComponent/>
            </FadeIn>
        </div>
    );
}

export default Homepage;