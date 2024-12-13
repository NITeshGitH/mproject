const getAllShipment = async () => {
    try {
        const provider = new ethers.providers.JsonRpcProvider();
        const contract = fetchContract(provider);

        const shipments = await contract.getAllTransactions();
        const allShipments = shipments.map((shipment, index) => ({
            id: index + 1,
            sender: shipment.sender,
            receiver: shipment.receiver,
            price: ethers.utils.formatEther(shipment.price.toString()),
            pickupTime: shipment.pickupTime.toNumber(),
            deliveryTime: shipment.deliveryTime.toNumber(),
            distance: shipment.distance.toNumber(),
            isPaid: shipment.isPaid,
            status: shipment.status
        }));

        return allShipments;
    } catch (error) {
        console.error("Error fetching all shipments:", error);
        return [];
    }
}; 