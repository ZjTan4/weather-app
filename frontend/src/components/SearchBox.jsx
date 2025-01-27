import React, { useState } from "react";
import Input from "./Input";
import Button from "./Button";

const SearchBox = ({ onSearch }) => {
    const [location, setLocation] = useState("");

    const handleSearch = () => {
        if (location.trim()) {
            onSearch(location);
        } else {
            alert("Please enter a location");
        }
    };

    return (
        <div className="flex items-center space-x-4">
            <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
            />
            <Button onClick={handleSearch}>Search</Button>
        </div>
    );
};

export default SearchBox;
