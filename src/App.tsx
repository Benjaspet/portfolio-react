import React from "react";

import Navbar from "./components/Navbar.tsx";
import Homepage from "./pages/Homepage.tsx";
import Footer from "./components/Footer.tsx";

import 'react-tooltip/dist/react-tooltip.css'
import FadeInHOC from "./components/higher-order/FadeInHOC.tsx";

const App: React.FC = () => {
    return (
        <div>
            <Navbar/>
            <Homepage/>
            <FadeInHOC>
                <Footer/>
            </FadeInHOC>
        </div>
    );
};

export default App;