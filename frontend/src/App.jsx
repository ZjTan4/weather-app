import React, { useState } from "react";
import Header from "./sections/Header";
import Footer from "./sections/Footer";
import MainSection from "./sections/MainSection";

const App = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />
            <main className="flex-grow p-4">
                <MainSection />
            </main>
            <Footer />
        </div>
    );
};

export default App;