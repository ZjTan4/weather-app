import React, { useState } from "react";
import InfoSection from "./InfoSection";

const Header = () => {
    const [showInfo, setShowInfo] = useState(false);

    return (
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Zijie's Weather App</h1>
            <button
                onClick={() => setShowInfo(true)}
                className="bg-white text-blue-600 px-4 py-2 rounded-md"
            >
                Info
            </button>
            {showInfo && <InfoSection onClose={() => setShowInfo(false)} />}
        </header>
    );
};

export default Header;
