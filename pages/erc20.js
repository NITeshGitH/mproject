import React, { useState, useContext } from 'react';
import { TrackingContext } from '../Conetxt/Tracking';

const Erc20 = () => {
  const { currentUser } = useContext(TrackingContext);
  const [tokenAmount, setTokenAmount] = useState('');

  const handleTransfer = (e) => {
    e.preventDefault();
    // Add your token transfer logic here
    console.log(`Transferring ${tokenAmount} tokens`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">ERC20 Token Management</h2>
        {currentUser ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="mb-4">Connected Wallet: {currentUser.slice(0, 25)}...</p>
            <form onSubmit={handleTransfer}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Token Amount</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(e.target.value)}
                />
              </div>
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Transfer Tokens
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600">Please connect your wallet to manage tokens</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Erc20;