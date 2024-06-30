import React from "react";

import Navbar from "./components/Navbar.tsx";
import About from "./components/About.tsx";
import Skills from "./components/Skills.tsx";
import Footer from "./components/Footer.tsx";

const App: React.FC = () => {
    return (
        <div>
            <header>
                <Navbar/>
                <About/>
                <Skills/>
                <Footer/>
            </header>
        </div>
    );
};

export default App;
