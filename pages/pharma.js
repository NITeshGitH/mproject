import React, { useState, useContext, useEffect } from 'react';
import { PharmaContext } from '../Context/PharmaContext';
import DrugDetailsForm from '../Components/DrugDetailsForm';
import EnvironmentalControls from '../Components/EnvironmentalControls';
import DrugStatusManager from '../Components/DrugStatusManager';
import GetDrugDetails from '../Components/GetDrugDetails';
import LoadingSpinner from '../Components/LoadingSpinner';

const PharmaPage = () => {
    const { addDrug, getDrugDetails, isLoading } = useContext(PharmaContext);
    const [drugData, setDrugData] = useState({
        batchNumber: '',
        name: '',
        manufacturer: '',
        manufacturingDate: '',
        expiryDate: ''
    });

    const [selectedBatchNumber, setSelectedBatchNumber] = useState('');
    const [drugDetails, setDrugDetails] = useState(null);
    const [activeTab, setActiveTab] = useState('addDrug'); // ['addDrug', 'details', 'environmental', 'status', 'getDetails']

    useEffect(() => {
        if (selectedBatchNumber) {
            fetchDrugDetails();
        }
        return () => {
            setDrugDetails(null);
        };
    }, [selectedBatchNumber]);

    const handleAddDrug = (e) => {
        e.preventDefault();
        if (!/^[A-Za-z0-9]+$/.test(drugData.batchNumber)) {
            alert("Invalid batch number format. Only alphanumeric characters are allowed.");
            return;
        }
        if (isLoading) return; // Prevent multiple submissions
        try {
            const manuDate = Math.floor(new Date(drugData.manufacturingDate).getTime() / 1000);
            const expDate = Math.floor(new Date(drugData.expiryDate).getTime() / 1000);

            const drugDataWithTimestamps = {
                ...drugData,
                manufacturingDate: manuDate,
                expiryDate: expDate
            };

            addDrug(drugDataWithTimestamps);
            setSelectedBatchNumber(drugData.batchNumber);
            setActiveTab('drugDetails');
            setDrugData({
                batchNumber: '',
                name: '',
                manufacturer: '',
                manufacturingDate: '',
                expiryDate: ''
            });
            alert("Drug added successfully!");
        } catch (error) {
            console.error("Error adding drug:", error);
            alert("Failed to add drug. Please check the console for details.");
        }
    };

    const fetchDrugDetails = async () => {
        if (!selectedBatchNumber) return;
        try {
            const details = await getDrugDetails(selectedBatchNumber);
            setDrugDetails(details);
        } catch (error) {
            console.error("Error fetching drug details:", error);
            alert("Failed to fetch drug details.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            {isLoading && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <LoadingSpinner />
                </div>
            )}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Pharmaceutical Supply Chain Management</h2>
                
                {/* Batch Number Search */}
                <div className="mt-4 flex items-start justify-between md:flex-row space-x-4">
                    <input
                        type="text"
                        placeholder="Enter Batch Number"
                        className="flex-1 p-2 border rounded-md"
                        value={selectedBatchNumber}
                        onChange={(e) => setSelectedBatchNumber(e.target.value)}
                    />
                    <button
                        onClick={fetchDrugDetails}
                        className="px-4 py-2 text-white duration-150 font-medium bg-gray-800 hover:bg-gray-700 active:bg-gray-900 rounded-md md:inline-flex"
                    >
                        Search
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-gray-200 mb-8">
                    <nav className="flex flex-wrap space-x-4">
                        {['addDrug', 'drugDetails', 'environmentalControls', 'statusManagement', 'getDrugDetails'].map((tab) => (
                            <button
                                key={tab}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium ${activeTab === tab ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
                    {activeTab === 'addDrug' && (
                        <form onSubmit={handleAddDrug} className="space-y-4">
                            <h3 className="text-xl font-semibold">Add New Drug</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Batch Number</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm"
                                    value={drugData.batchNumber}
                                    onChange={(e) => setDrugData({ ...drugData, batchNumber: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm"
                                    value={drugData.name}
                                    onChange={(e) => setDrugData({ ...drugData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Manufacturer</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm"
                                    value={drugData.manufacturer}
                                    onChange={(e) => setDrugData({ ...drugData, manufacturer: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Manufacturing Date</label>
                                <input
                                    type="date"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm"
                                    value={drugData.manufacturingDate}
                                    onChange={(e) => setDrugData({ ...drugData, manufacturingDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                                <input
                                    type="date"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm"
                                    value={drugData.expiryDate}
                                    onChange={(e) => setDrugData({ ...drugData, expiryDate: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                            >
                                Add Drug
                            </button>
                        </form>
                    )}

                    {activeTab === 'drugDetails' && selectedBatchNumber && (
                        <DrugDetailsForm batchNumber={selectedBatchNumber} />
                    )}

                    {activeTab === 'environmentalControls' && selectedBatchNumber && (
                        <EnvironmentalControls batchNumber={selectedBatchNumber} />
                    )}

                    {activeTab === 'statusManagement' && selectedBatchNumber && (
                        <DrugStatusManager batchNumber={selectedBatchNumber} />
                    )}

                    {activeTab === 'getDrugDetails' && selectedBatchNumber && (
                        <GetDrugDetails batchNumber={selectedBatchNumber} />
                    )}

                    {!selectedBatchNumber && activeTab !== 'addDrug' && (
                        <div className="text-center text-gray-500">
                            Please enter a batch number to manage drug details
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PharmaPage; 