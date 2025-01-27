import { useEffect, useState } from "react";
import RangeSearchBox from "../components/RangeSearchBox";
import RecordList from "../components/RecordList";
import { fetchRecords } from "../apis/fetchRecords";
import { fetchHistorical } from "../apis/fetchHistorial";

const DatabaseSection = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all records on page load
    useEffect(() => {
        fetchAllRecords();
    }, []);
    
    // DEBUG
    useEffect(() => {
        console.log("Records state updated:", records);
    }, [records]);

    const fetchAllRecords = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchRecords();
            setRecords(response.data);
        } catch (error) {
            setError(error.message);
            console.error("Error fetching records:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (location, startTime, endTime) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchHistorical({
                location,
                startTime,
                endTime
            });
            const allRecords = await fetchRecords();
            setRecords(allRecords.data);
        } catch (error) {
            setError(error.message);
            console.error("Error searching records:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="container mt-4 p-4">
            <h2>Database</h2>
            <RangeSearchBox onSearch={handleSearch}/>
            {error && (
                <div className="text-red-500 mt-4">
                    Error: {error}
                </div>
            )}
            {loading ? (
                <div className="text-center mt-4">Loading...</div>
            ) : (
                <RecordList recordList={records}/>
            )}
        </section>
    );
};

export default DatabaseSection;

