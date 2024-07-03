import React from "react";

import Navbar from "./components/Navbar.tsx";
import About from "./components/About.tsx";
import Skills from "./components/Skills.tsx";
import Footer from "./components/Footer.tsx";
import GridComponent from "./components/GridComponent.tsx";
import Experience from "./components/Experience.tsx";

import 'react-tooltip/dist/react-tooltip.css'

const App: React.FC = () => {
    return (
        <header>
            <Navbar/>
            <About/>
            <Experience/>
            <GridComponent/>
            <Skills/>
            <Footer/>
        </header>
    );
};

export default App;