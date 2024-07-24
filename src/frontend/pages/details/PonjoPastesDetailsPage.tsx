import React, { useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import Navbar from "../../components/Navbar.tsx";

const PonjoPasteDetailsPage: React.FC = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            window.open("https://pastes.benpetrillo.dev", "_blank");
            navigate("/")
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const centerStyle = {
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        width: 140,
        paddingTop: 25
    }

    return (
        <div>
            <Navbar/>
            <img style={centerStyle} src="/redirect.gif" alt=""/>
        </div>

    );
}

export default PonjoPasteDetailsPage;