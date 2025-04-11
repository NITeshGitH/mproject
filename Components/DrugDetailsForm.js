import React, { useState, useContext } from 'react';
import { PharmaContext } from '../Context/PharmaContext';

const DrugDetailsForm = ({ batchNumber }) => {
    const { addDrugDetails } = useContext(PharmaContext);
    const [details, setDetails] = useState({
        batchNumber: batchNumber || '',
        dosageForm: '',
        strength: '',
        storageConditions: '',
        serialNumber: '',
        price: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDrugDetails(details);
            // Clear form
            setDetails({
                ...details,
                dosageForm: '',
                strength: '',
                storageConditions: '',
                serialNumber: '',
                price: ''
            });
            alert("Drug details added successfully!");
        } catch (error) {
            console.error("Error adding drug details:", error);
            alert("Failed to add drug details. Please check the console for details.");
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-8">
            <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-semibold">Add Medicine Details</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Dosage Form</label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm"
                        value={details.dosageForm}
                        onChange={(e) => setDetails({...details, dosageForm: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Strength (mg)</label>
                    <input
                        type="number"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm"
                        value={details.strength}
                        onChange={(e) => setDetails({...details, strength: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Storage Conditions</label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm"
                        value={details.storageConditions}
                        onChange={(e) => setDetails({...details, storageConditions: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Serial Number</label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm"
                        value={details.serialNumber}
                        onChange={(e) => setDetails({...details, serialNumber: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Price (ETH)</label>
                    <input
                        type="number"
                        step="0.001"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm"
                        value={details.price}
                        onChange={(e) => setDetails({...details, price: e.target.value})}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                >
                    Add Details
                </button>
            </form>
        </div>
    );
};

export default DrugDetailsForm; 