import React, { useState, useContext, useEffect } from 'react';
import { PharmaContext } from '../Context/PharmaContext';

const GetDrugDetails = ({ batchNumber }) => {
    const { getDrugDetails } = useContext(PharmaContext);
    const [drugDetails, setDrugDetails] = useState(null);
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
                const details = await getDrugDetails(batchNumber);
                setDrugDetails(details);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDrugDetails();
    }, [batchNumber, getDrugDetails]);

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
            <h2 className="text-2xl font-bold mb-4">Drug Details</h2>
            {drugDetails ? (
                <div>
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Base Information</h3>
                        <div className="space-y-2">
                            <p><strong>Name:</strong> {drugDetails.base[0]}</p>
                            <p><strong>Manufacturer:</strong> {drugDetails.base[1]}</p>
                            <p><strong>Manufacturing Date:</strong> {formatDate(drugDetails.base[2])}</p>
                            <p><strong>Expiry Date:</strong> {formatDate(drugDetails.base[3])}</p>
                            <p><strong>Current Owner:</strong> {drugDetails.base[4]}</p>
                            <p><strong>Is Verified:</strong> {drugDetails.base[5] ? 'Yes' : 'No'}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Details</h3>
                        <div className="space-y-2">
                            <p><strong>Dosage Form:</strong> {drugDetails.details[0]}</p>
                            <p><strong>Strength:</strong> {drugDetails.details[1].toString()} mg</p>
                            <p><strong>Storage Conditions:</strong> {drugDetails.details[2]}</p>
                            <p><strong>Serial Number:</strong> {drugDetails.details[3]}</p>
                            <p><strong>Price:</strong> {(drugDetails.details[4] / 1e18).toString()} ETH</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Status</h3>
                        <div className="space-y-2">
                            <p><strong>Status:</strong> {statusOptions[drugDetails.status[0]]}</p>
                            <p><strong>Ownership History:</strong> {drugDetails.status[1].join(', ')}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Environmental Data</h3>
                        <div className="space-y-2">
                            <p><strong>Current Temperature:</strong> {drugDetails.environmental[0].toString()} °C</p>
                            <p><strong>Current Humidity:</strong> {drugDetails.environmental[1].toString()} %</p>
                            <p><strong>Max Temperature:</strong> {drugDetails.environmental[2].toString()} °C</p>
                            <p><strong>Min Temperature:</strong> {drugDetails.environmental[3].toString()} °C</p>
                            <p><strong>Max Humidity:</strong> {drugDetails.environmental[4].toString()} %</p>

                            {/* Alert for Exceeding Thresholds */}
                            <p className={`mt-4 font-bold text-center ${isOutsideThreshold(drugDetails.environmental[0], drugDetails.environmental[3], drugDetails.environmental[2]) ||
                                    isOutsideThreshold(drugDetails.environmental[1], 0, drugDetails.environmental[4])
                                    ? 'text-red-500'
                                    : 'text-green-500'
                                }`}>
                                {
                                    isOutsideThreshold(drugDetails.environmental[0], drugDetails.environmental[3], drugDetails.environmental[2]) ||
                                        isOutsideThreshold(drugDetails.environmental[1], 0, drugDetails.environmental[4])
                                        ? 'Alert: Environmental conditions are outside safe thresholds. The drug may not be safe to use.'
                                        : 'Environmental conditions are within safe thresholds. The drug is okay to use.'
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
