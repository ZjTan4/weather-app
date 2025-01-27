import React from "react";

const InfoSection = ({ onClose }) => (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h2 className="text-xl font-bold text-gray-800">About This App</h2>
            <p className="mt-4 text-gray-600">
                This weather app allows users to search for current weather and a
                5-day forecast. It's built with React and TailwindCSS, and uses
                APIs for live weather data.
            </p>
            <button
                onClick={onClose}
                className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4"
            >
                Close
            </button>
        </div>
    </div>
);

export default InfoSection;
