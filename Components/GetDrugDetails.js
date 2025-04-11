import React, { useState, useContext, useEffect } from 'react';
import { PharmaContext } from '../Context/PharmaContext';

const GetDrugDetails = ({ batchNumber }) => {
    const { getMedicineDetails } = useContext(PharmaContext);
    const [medicineDetails, setDrugDetails] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Status options from DrugStatusManager
    const statusOptions = [
        'Manufactured',
        'InTransit',
        'Distributed',
        'Dispensed',
        'Expired',
        'Recalled'
    ];

    useEffect(() => {
        const fetchDrugDetails = async () => {
            if (!batchNumber) return;
            setLoading(true);
            try {
                const details = await getMedicineDetails(batchNumber);
                setDrugDetails(details);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDrugDetails();
    }, [batchNumber, getMedicineDetails]);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp.toNumber() * 1000); // Assuming timestamp is in seconds
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const isOutsideThreshold = (value, min, max) => value <= min || value >= max;

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">Error: {error}</div>;

    return (
        <div className='max-w-2xl mx-auto p-6'>
            <h2 className="text-2xl font-bold mb-4">Medicine Details</h2>
            {medicineDetails ? (
                <div>
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Base Information</h3>
                        <div className="space-y-2">
                            <p><strong>Name:</strong> {medicineDetails.base[0]}</p>
                            <p><strong>Manufacturer:</strong> {medicineDetails.base[1]}</p>
                            <p><strong>Manufacturing Date:</strong> {formatDate(medicineDetails.base[2])}</p>
                            <p><strong>Expiry Date:</strong> {formatDate(medicineDetails.base[3])}</p>
                            <p><strong>Current Owner:</strong> {medicineDetails.base[4]}</p>
                            <p><strong>Is Verified:</strong> {medicineDetails.base[5] ? 'Yes' : 'No'}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Details</h3>
                        <div className="space-y-2">
                            <p><strong>Dosage Form:</strong> {medicineDetails.details[0]}</p>
                            <p><strong>Strength:</strong> {medicineDetails.details[1].toString()} mg</p>
                            <p><strong>Storage Conditions:</strong> {medicineDetails.details[2]}</p>
                            <p><strong>Serial Number:</strong> {medicineDetails.details[3]}</p>
                            <p><strong>Price:</strong> {(medicineDetails.details[4] / 1e18).toString()} ETH</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Status</h3>
                        <div className="space-y-2">
                            <p><strong>Status:</strong> {statusOptions[medicineDetails.status[0]]}</p>
                            <p><strong>Ownership History:</strong> {medicineDetails.status[1].join(', ')}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Environmental Data</h3>
                        <div className="space-y-2">
                            <p><strong>Current Temperature:</strong> {medicineDetails.environmental[0].toString()} °C</p>
                            <p><strong>Current Humidity:</strong> {medicineDetails.environmental[1].toString()} %</p>
                            <p><strong>Max Temperature:</strong> {medicineDetails.environmental[2].toString()} °C</p>
                            <p><strong>Min Temperature:</strong> {medicineDetails.environmental[3].toString()} °C</p>
                            <p><strong>Max Humidity:</strong> {medicineDetails.environmental[4].toString()} %</p>

                            {/* Alert for Exceeding Thresholds */}
                            <p className={`mt-4 font-bold text-center ${isOutsideThreshold(medicineDetails.environmental[0], medicineDetails.environmental[3], medicineDetails.environmental[2]) ||
                                    isOutsideThreshold(medicineDetails.environmental[1], 0, medicineDetails.environmental[4])
                                    ? 'text-red-500'
                                    : 'text-green-500'
                                }`}>
                                {
                                    isOutsideThreshold(medicineDetails.environmental[0], medicineDetails.environmental[3], medicineDetails.environmental[2]) ||
                                        isOutsideThreshold(medicineDetails.environmental[1], 0, medicineDetails.environmental[4])
                                        ? 'Alert: Environmental conditions are outside safe thresholds. The medicine may not be safe to use.'
                                        : 'Environmental conditions are within safe thresholds. The medicine is okay to use.'
                                }
                            </p>

                        </div>
                    </div>

                </div>
            ) : (
                <p className="text-center">
                    {batchNumber ? "No details available for this batch number." : "Please enter a valid batch number."}
                </p>
            )}
        </div>
    );
};

export default GetDrugDetails;
