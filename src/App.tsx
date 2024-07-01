import React from "react";

import Navbar from "./components/Navbar.tsx";
import About from "./components/About.tsx";
import Skills from "./components/Skills.tsx";
import Footer from "./components/Footer.tsx";
import GridComponent from "./components/GridComponent.tsx";
import Experience from "./components/Experience.tsx";

const App: React.FC = () => {
    return (
        <div>
            <header>
                <Navbar/>
                <About/>
                <Experience/>
                <Skills/>
                <GridComponent/>
                <Footer/>
            </header>
        </div>
    );
};

export default App;
