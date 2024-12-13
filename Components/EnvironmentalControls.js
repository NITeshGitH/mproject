import React, { useState, useContext, useEffect } from 'react';
import { PharmaContext } from '../Context/PharmaContext';

const EnvironmentalControls = ({ batchNumber }) => {
    const { setEnvironmentalLimits, updateEnvironmentalData, getEnvironmentalLog, getLogTimestamps } = useContext(PharmaContext);
    
    const [limits, setLimits] = useState({
        batchNumber: batchNumber || '',
        maxTemp: '',
        minTemp: '',
        maxHumid: ''
    });

    const [currentData, setCurrentData] = useState({
        batchNumber: batchNumber || '',
        temperature: '',
        humidity: ''
    });

    const [logs, setLogs] = useState([]);

    useEffect(() => {
        if (batchNumber) {
            fetchLogs();
        }
    }, [batchNumber]);


    const fetchLogs = async () => {
        try {
            const timestamps = await getLogTimestamps(batchNumber);
            const logPromises = timestamps.map(async (ts) => {
                const log = await getEnvironmentalLog(batchNumber, ts);
                return {
                    temperature: log[0],
                    humidity: log[1],
                    timestamp: ts
                };
            });
            const logData = await Promise.all(logPromises);
            const updatedLogData = logData.map(log => ({
                ...log,
                status: checkEnvironmentalStatus(log.temperature, log.humidity) ? 'Safe' : 'Unsafe'
            }));
            setLogs(updatedLogData);
        } catch (error) {
            console.error("Error fetching logs:", error);
        }
    };

    const handleSetLimits = async (e) => {
        e.preventDefault();
        try {
            validateEnvironmentalData({
                temperature: (parseFloat(limits.maxTemp) + parseFloat(limits.minTemp)) / 2,
                humidity: limits.maxHumid
            });
            await setEnvironmentalLimits(limits);
        } catch (error) {
            console.error("Error setting limits:", error);
            alert("Failed to set limits. Please check the console for details.");
        }
    };

    const handleUpdateData = async (e) => {
        e.preventDefault();
        try {
            await updateEnvironmentalData(currentData);
            await fetchLogs(); // Refresh logs after update
            alert("Environmental data updated successfully!");
        } catch (error) {
            console.error("Error updating data:", error);
            alert("Failed to update data. Please check the console for details.");
        }
    };

    const validateEnvironmentalData = (data) => {
        const { temperature, humidity } = data;
        if (isNaN(temperature) || temperature < -50 || temperature > 100) {
            throw new Error("Invalid temperature range (-50°C to 100°C)");
        }
        if (isNaN(humidity) || humidity < 0 || humidity > 100) {
            throw new Error("Invalid humidity range (0% to 100%)");
        }
        return true;
    };

    const checkEnvironmentalStatus = (temperature, humidity) => {
        const isTempSafe = temperature <= limits.minTemp || temperature >= limits.maxTemp;
        const isHumiditySafe = humidity <= 0 || humidity >= limits.maxHumid;
        return isTempSafe || isHumiditySafe;
    };

    return (
        <div className="max-w-lg mx-auto mt-8">
            {/* Set Limits Form */}
            <form onSubmit={handleSetLimits} className="space-y-4 mb-8">
                <h3 className="text-xl font-semibold">Set Environmental Limits</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Maximum Temperature (°C)</label>
                    <input
                        type="number"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm"
                        value={limits.maxTemp}
                        onChange={(e) => setLimits({...limits, maxTemp: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Minimum Temperature (°C)</label>
                    <input
                        type="number"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm"
                        value={limits.minTemp}
                        onChange={(e) => setLimits({...limits, minTemp: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Maximum Humidity (%)</label>
                    <input
                        type="number"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm"
                        value={limits.maxHumid}
                        onChange={(e) => setLimits({...limits, maxHumid: e.target.value})}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                >
                    Set Limits
                </button>
            </form>

            {/* Update Current Data Form */}
            <form onSubmit={handleUpdateData} className="space-y-4 mb-8">
                <h3 className="text-xl font-semibold">Update Current Data</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Current Temperature (°C)</label>
                    <input
                        type="number"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm"
                        value={currentData.temperature}
                        onChange={(e) => setCurrentData({...currentData, temperature: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Current Humidity (%)</label>
                    <input
                        type="number"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm"
                        value={currentData.humidity}
                        onChange={(e) => setCurrentData({...currentData, humidity: e.target.value})}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                >
                    Update Data
                </button>
            </form>

            {/* Environmental Logs */}
            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Environmental Logs</h3>
                <div className="overflow-y-auto max-h-60 border rounded-lg shadow-sm">
                    <table className="min-w-full table-auto text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Temperature
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Humidity
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Timestamp
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {logs.map((log, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">{log.temperature.toString()}°C</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{log.humidity.toString()}%</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(log.timestamp * 1000).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {log.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EnvironmentalControls; 