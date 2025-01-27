import React, { useState } from 'react';
import { getWeatherCondition, getWeatherIcon } from './WeatherCard';

const RecordEntry = ({ 
    record = {
        date: new Date(),
        values: {},
        location: { name: 'Unknown Location' }
    },
    onEdit,
    onDelete
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedValues, setEditedValues] = useState({});
    const values = record?.values || {};
    const {
        temperature = 'N/A',
        weatherCode = 1000,
        windSpeed = 'N/A',
        precipitationProbability = 'N/A',
        uvIndex = 'N/A',
        temperatureApparent = 'N/A'
    } = values;

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setEditedValues({
            temperature,
            temperatureApparent,
            windSpeed,
            precipitationProbability,
            uvIndex
        });
    };
    const handleConfirm = () => {
        if (onEdit) {
            const updatedRecord = {
                ...record,
                values: {
                    ...record.values,
                    ...editedValues
                }
            };
            onEdit(updatedRecord);
        }
        setIsEditing(false);
    };
    const handleCancel = () => {
        setIsEditing(false);
        setEditedValues({});
    };
    const handleInputChange = (field, value) => {
        setEditedValues(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const renderValue = (label, value, field) => {
        if (isEditing) {
            return (
                <div className="flex flex-col">
                    <span className="text-gray-500 text-sm">{label}</span>
                    <input
                        type="number"
                        value={editedValues[field] === 'N/A' ? '' : editedValues[field]}
                        onChange={(e) => handleInputChange(field, e.target.value || 'N/A')}
                        className="font-medium border rounded px-2 py-1 w-full"
                        placeholder="N/A"
                    />
                </div>
            );
        }

        return (
            <div className="flex flex-col">
                <span className="text-gray-500 text-sm">{label}</span>
                <span className="font-medium">
                    {value !== 'N/A' ? 
                        label === 'Temperature' || label === 'Feels Like' ? `${value}°C` :
                        label === 'Wind Speed' ? `${value} m/s` :
                        label === 'Precipitation' ? `${value}%` :
                        value
                        : 'N/A'}
                </span>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow relative">
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2 z-10">
                {isEditing ? (
                    <>
                        <button 
                            onClick={handleConfirm}
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-full transition-colors"
                            title="Confirm changes"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        </button>
                        <button 
                            onClick={handleCancel}
                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-full transition-colors"
                            title="Cancel editing"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </>
                ) : (
                    <>
                        <button 
                            onClick={handleEditClick}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                            title="Edit record"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                        </button>
                        <button 
                            onClick={() => onDelete && window.confirm('Are you sure you want to delete this record?') && onDelete(record)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete record"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                    </>
                )}
            </div>

            {/* Date Header */}
            <div className="text-lg font-semibold text-gray-800 mb-3">
                {formatDate(record?.date)}
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                {/* Weather Icon and Condition */}
                <div className="flex flex-col items-center md:w-1/4">
                    <div className="text-4xl mb-2">
                        {getWeatherIcon(weatherCode)}
                    </div>
                    <span className="text-gray-600 text-sm">
                        {getWeatherCondition(weatherCode)}
                    </span>
                </div>

                {/* Weather Details */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-grow">
                    {renderValue('Temperature', temperature, 'temperature')}
                    {renderValue('Feels Like', temperatureApparent, 'temperatureApparent')}
                    {renderValue('Wind Speed', windSpeed, 'windSpeed')}
                    {renderValue('Precipitation', precipitationProbability, 'precipitationProbability')}
                    {renderValue('UV Index', uvIndex, 'uvIndex')}
                </div>
            </div>

            {/* Location */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="text-gray-500 text-sm mr-2">Location:</span>
                <span className="text-gray-700">{record?.location?.name || 'Unknown Location'}</span>
            </div>
        </div>
    );
};

export default RecordEntry;
