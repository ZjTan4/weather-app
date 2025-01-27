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

    const handleExportCSV = () => {
        try {
            // Create CSV content
            const headers = ['Date', 'Location', 'Temperature (°C)', 'Feels Like (°C)', 'Wind Speed (m/s)', 'Precipitation (%)', 'UV Index'];
            const rows = records.map(record => [
                new Date(record.date).toLocaleDateString(),
                record.location.name,
                record.values.temperature,
                record.values.temperatureApparent,
                record.values.windSpeed,
                record.values.precipitationProbability,
                record.values.uvIndex
            ]);
            
            const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
            
            // Create and trigger download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `weather_records_${new Date().toLocaleDateString()}.csv`;
            link.click();
        } catch (error) {
            console.error("Error exporting CSV:", error);
            setError("Failed to export CSV");
        }
    };

    return (
            <section className="container mt-4 p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Database</h2>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={fetchAllRecords} 
                            className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                            title="Refresh records"
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                strokeWidth={1.5} 
                                stroke="currentColor" 
                                className="w-5 h-5"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" 
                                />
                            </svg>
                            Refresh
                        </button>
                        <button
                            onClick={handleExportCSV}
                            className="flex items-center gap-2 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
                            title="Export to CSV"
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                strokeWidth={1.5} 
                                stroke="currentColor" 
                                className="w-5 h-5"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" 
                                />
                            </svg>
                            Export to CSV
                        </button>
                    </div>
                </div>
            <RangeSearchBox onSearch={handleSearch}/>
            {error && (
                <div className="text-red-500 mt-4">
                    Error: {error}
                </div>
            )}
            {loading ? (
                <div className="text-center mt-4">Loading...</div>
            ) : (
                <RecordList recordList={records} setRecordList={setRecords}/>
            )}
        </section>
    );
};

export default DatabaseSection;

