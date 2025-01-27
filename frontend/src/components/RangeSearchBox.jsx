import { useState } from "react";
import Button from "./Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Input from "./Input";

const RangeSearchBox = ( { onSearch } ) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [location, setLocation] = useState("");

    const handleSearch = () => {
        if (!location.trim() || !startDate || !endDate) {
            alert("Please enter location, start date, and end date");
            return;
        }
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0] ;
        
        onSearch(location, formattedStartDate, formattedEndDate);
    };

    return (
        <div className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Location Input */}
            <div className="relative z-0 md:col-span-1">
                <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter location"
                    className="w-full box-border"
                />
            </div>
            {/* Start Date Picker */}
            <div className="relative z-10 md:col-start-2">
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Start Date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxDate={endDate || new Date()}
                    isClearable
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={10}
                />
            </div>
            {/* End Date Picker */}
            <div className="relative z-10 md:col-start-3">
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="End Date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    minDate={startDate}
                    maxDate={new Date()}
                    isClearable
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={10}
                />
            </div>

            {/* Search Button */}
            <div className="relative z-0 md:col-start-4">
                <Button 
                    onClick={handleSearch}
                    className="w-full px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Search
                </Button>
            </div>
        </div>
    );
};

export default RangeSearchBox;
