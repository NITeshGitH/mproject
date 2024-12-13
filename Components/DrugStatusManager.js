import React, { useState, useContext } from 'react';
import { PharmaContext } from '../Context/PharmaContext';

const DrugStatusManager = ({ batchNumber, onUpdate }) => {
    const { updateStatus, verifyDrug, recallDrug, transferOwnership, updatePrice } = useContext(PharmaContext);
    
    const [newStatus, setNewStatus] = useState('');
    const [recallReason, setRecallReason] = useState('');
    const [newOwner, setNewOwner] = useState('');
    const [newPrice, setNewPrice] = useState('');

    const statusOptions = [
        'Manufactured',
        'InTransit',
        'Distributed',
        'Dispensed',
        'Expired',
        'Recalled'
    ];

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        try {
            await updateStatus(batchNumber, statusOptions.indexOf(newStatus));
            alert("Status updated successfully!");
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status. Please check the console for details.");
        }
    };

    const handleVerify = async () => {
        try {
            await verifyDrug(batchNumber);
            alert("Drug verified successfully!");
        } catch (error) {
            console.error("Error verifying drug:", error);
            alert("Failed to verify drug. Please check the console for details.");
        }
    };

    const handleRecall = async (e) => {
        e.preventDefault();
        try {
            await recallDrug(batchNumber, recallReason);
            alert("Drug recalled successfully!");
        } catch (error) {
            console.error("Error recalling drug:", error);
            alert("Failed to recall drug. Please check the console for details.");
        }
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        try {
            await transferOwnership(batchNumber, newOwner);
            alert("Ownership transferred successfully!");
        } catch (error) {
            console.error("Error transferring ownership:", error);
            alert("Failed to transfer ownership. Please check the console for details.");
        }
    };

    const handleUpdatePrice = async (e) => {
        e.preventDefault();
        try {
            await updatePrice(batchNumber, newPrice);
            alert("Price updated successfully!");
        } catch (error) {
            console.error("Error updating price:", error);
            alert("Failed to update price. Please check the console for details.");
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-8">
            {/* Update Status */}
            <form onSubmit={handleUpdateStatus} className="space-y-4 mb-8">
                <h3 className="text-xl font-semibold">Update Status</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700">New Status</label>
                    <select
                        className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                    >
                        <option value="">Select Status</option>
                        {statusOptions.map((status) => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                >
                    Update Status
                </button>
            </form>

            {/* Verify Drug */}
            <div className="mb-8">
                <button
                    onClick={handleVerify}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                >
                    Verify Drug
                </button>
            </div>

            {/* Recall Drug */}
            <form onSubmit={handleRecall} className="space-y-4 mb-8">
                <h3 className="text-xl font-semibold">Recall Drug</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Recall Reason</label>
                    <textarea
                        className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm"
                        value={recallReason}
                        onChange={(e) => setRecallReason(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                >
                    Recall Drug
                </button>
            </form>

            {/* Transfer Ownership */}
            <form onSubmit={handleTransfer} className="space-y-4 mb-8">
                <h3 className="text-xl font-semibold">Transfer Ownership</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700">New Owner Address</label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm"
                        value={newOwner}
                        onChange={(e) => setNewOwner(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                >
                    Transfer Ownership
                </button>
            </form>

            {/* Update Price */}
            <form onSubmit={handleUpdatePrice} className="space-y-4">
                <h3 className="text-xl font-semibold">Update Price</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700">New Price (ETH)</label>
                    <input
                        type="number"
                        step="0.001"
                        className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                >
                    Update Price
                </button>
            </form>
        </div>
    );
};

export default DrugStatusManager; 