import React from 'react';

import Metadata from "./components/Metadata.tsx";
import Navbar from "./components/Navbar.tsx";
import About from "./components/About.tsx";

const App: React.FC = () => {
    return (
        <div>
            <Metadata
                title="Ben Petrillo"
                description="Computer Science Student at Northeastern University"
                image="https://benpetrillo.com/images/me.jpg"
                url="https://benpetrillo.com"
                author="Ben Petrillo"
            />
            <header>
                <Navbar/>
                <About/>
            </header>
        </div>
    );
};

export default App;
