import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

//INTERNAL IMPORT 
import PharmaSupplyChain from "./PharmaSupplyChain.json";
const ContractABI = PharmaSupplyChain.abi;
const ContractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const fetchContract = (signerOrProvider) => {
    if (!ContractABI || !Array.isArray(ContractABI)) {
        throw new Error("Contract ABI is not properly loaded");
    }
    return new ethers.Contract(ContractAddress, ContractABI, signerOrProvider);
};

export const PharmaContext = React.createContext();

export const PharmaProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [chainId, setChainId] = useState(null);

    const addDrug = async (drugData) => {
        if (isLoading) return;
        setIsLoading(true);
        setError(null);
        try {
            const { batchNumber, name, manufacturer, manufacturingDate, expiryDate } = drugData;
            
            // Validate inputs
            if (!manufacturingDate || !expiryDate) {
                throw new Error("Manufacturing date and expiry date are required");
            }

            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            // Convert dates to BigNumber
            const manuDate = ethers.BigNumber.from(manufacturingDate);
            const expDate = ethers.BigNumber.from(expiryDate);

            const transaction = await contract.addDrugBase(
                batchNumber,
                name,
                manufacturer,
                manuDate,
                expDate
            );

            await transaction.wait();
            return transaction;
        } catch (error) {
            setError(error.message || "Error adding drug");
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const updateEnvironmentalData = async (envData) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const { batchNumber, temperature, humidity } = envData;
            
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            const transaction = await contract.updateEnvironmentalData(
                batchNumber,
                temperature,
                humidity
            );

            await transaction.wait();
            return transaction;
        } catch (error) {
            console.log("Error updating environmental data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getDrugDetails = async (batchNumber) => {
        try {
            const provider = new ethers.providers.JsonRpcProvider();
            const contract = fetchContract(provider);
            const baseDetails = await contract.getDrugBase(batchNumber);
            const details = await contract.getDrugDetails(batchNumber);
            const status = await contract.getDrugStatus(batchNumber);
            const environmental = await contract.getDrugEnvironmental(batchNumber);

            return {
                base: baseDetails,
                details: details,
                status: status,
                environmental: environmental
            };
        } catch (error) {
            console.log("Error getting drug details:", error);
            return null; // Return null or handle the error appropriately
        }
    };

    const addDrugDetails = async (drugDetailsData) => {
        try {
            const { batchNumber, dosageForm, strength, storageConditions, serialNumber, price } = drugDetailsData;
            
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            const transaction = await contract.addDrugDetails(
                batchNumber,
                dosageForm,
                ethers.BigNumber.from(strength),
                storageConditions,
                serialNumber,
                ethers.utils.parseEther(price.toString())
            );

            await transaction.wait();
            return transaction;
        } catch (error) {
            console.log("Error adding drug details:", error);
            throw error;
        }
    };

    const setEnvironmentalLimits = async (envLimits) => {
        try {
            const { batchNumber, maxTemp, minTemp, maxHumid } = envLimits;
            
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            const transaction = await contract.setEnvironmentalLimits(
                batchNumber,
                ethers.BigNumber.from(maxTemp),
                ethers.BigNumber.from(minTemp),
                ethers.BigNumber.from(maxHumid)
            );

            await transaction.wait();
            return transaction;
        } catch (error) {
            console.log("Error setting environmental limits:", error);
            throw error;
        }
    };

    const transferOwnership = async (batchNumber, newOwner) => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            const transaction = await contract.transferOwnership(batchNumber, newOwner);
            await transaction.wait();
            return transaction;
        } catch (error) {
            console.log("Error transferring ownership:", error);
            throw error;
        }
    };

    const verifyDrug = async (batchNumber) => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            const transaction = await contract.verifyDrug(batchNumber);
            await transaction.wait();
            return transaction;
        } catch (error) {
            console.log("Error verifying drug:", error);
            throw error;
        }
    };

    const updateStatus = async (batchNumber, newStatus) => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            const transaction = await contract.updateStatus(batchNumber, newStatus);
            await transaction.wait();
            return transaction;
        } catch (error) {
            console.log("Error updating status:", error);
            throw error;
        }
    };

    const updatePrice = async (batchNumber, newPrice) => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            const transaction = await contract.updatePrice(
                batchNumber, 
                ethers.utils.parseEther(newPrice.toString())
            );
            await transaction.wait();
            return transaction;
        } catch (error) {
            console.log("Error updating price:", error);
            throw error;
        }
    };

    const recallDrug = async (batchNumber, reason) => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            const transaction = await contract.recallDrug(batchNumber, reason);
            await transaction.wait();
            return transaction;
        } catch (error) {
            console.log("Error recalling drug:", error);
            throw error;
        }
    };

    const getEnvironmentalLog = async (batchNumber, timestamp) => {
        try {
            const provider = new ethers.providers.JsonRpcProvider();
            const contract = fetchContract(provider);
            
            const log = await contract.getEnvironmentalLog(batchNumber, timestamp);
            return log;
        } catch (error) {
            console.log("Error getting environmental log:", error);
            throw error;
        }
    };

    const getLogTimestamps = async (batchNumber) => {
        try {
            const provider = new ethers.providers.JsonRpcProvider();
            const contract = fetchContract(provider);
            
            const timestamps = await contract.getLogTimestamps(batchNumber);
            return timestamps;
        } catch (error) {
            console.log("Error getting log timestamps:", error);
            throw error;
        }
    };

    const checkNetwork = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const chainId = await ethereum.request({ method: 'eth_chainId' });
                setChainId(chainId);
                
                // Listen for network changes
                ethereum.on('chainChanged', (newChainId) => {
                    setChainId(newChainId);
                });
            }
        } catch (error) {
            console.error("Error checking network:", error);
        }
    };

    useEffect(() => {
        checkNetwork();
        const checkWallet = async () => {
            try {
                if (!window.ethereum) return "Install MetaMask";
                const accounts = await window.ethereum.request({
                    method: "eth_accounts",
                });
                if (accounts.length) {
                    setCurrentUser(accounts[0]);
                }
            } catch (error) {
                console.log("Wallet connection error:", error);
            }
        };
        checkWallet();

        // Cleanup listeners
        return () => {
            const { ethereum } = window;
            if (ethereum) {
                ethereum.removeListener('chainChanged', checkNetwork);
            }
        };
    }, []);

    return (
        <PharmaContext.Provider
            value={{
                currentUser,
                isLoading,
                error,
                addDrug,
                addDrugDetails,
                updateEnvironmentalData,
                setEnvironmentalLimits,
                getDrugDetails,
                transferOwnership,
                verifyDrug,
                updateStatus,
                updatePrice,
                recallDrug,
                getEnvironmentalLog,
                getLogTimestamps
            }}
        >
            {children}
        </PharmaContext.Provider>
    );
}; 