// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract PharmaSupplyChain {
    struct DrugBase {
        string name;
        string manufacturer;
        uint256 manufacturingDate;
        uint256 expiryDate;
        string batchNumber;
        address currentOwner;
        bool isVerified;
    }

    struct DrugDetails {
        string dosageForm;
        uint256 strength;
        string storageConditions;
        string serialNumber;
        uint256 price;
    }

    struct DrugEnvironmental {
        uint256 currentTemperature;
        uint256 currentHumidity;
        uint256 maxTemperature;
        uint256 minTemperature;
        uint256 maxHumidity;
        bool temperatureBreached;
    }

    struct DrugStatus {
        Status status;
        address[] ownershipHistory;
        uint256[] logTimestamps;
    }

    struct EnvironmentalLog {
        uint256 temperature;
        uint256 humidity;
        uint256 timestamp;
        address reporter;
    }

    enum Status { 
        Manufactured,
        InTransit,
        Distributed,
        Dispensed,
        Expired,
        Recalled
    }

    // Events
    event DrugAdded(string batchNumber, string name, address indexed manufacturer);
    event OwnershipTransferred(string batchNumber, address indexed previousOwner, address indexed newOwner);
    event DrugVerified(string batchNumber, address indexed verifier);
    event DrugStatusChanged(string batchNumber, Status newStatus);
    event PriceUpdated(string batchNumber, uint256 newPrice);
    event DrugRecalled(string batchNumber, string reason);
    event EnvironmentalUpdate(string batchNumber, uint256 temperature, uint256 humidity, bool breached);

    // Mappings
    mapping(string => DrugBase) private drugsBase;
    mapping(string => DrugDetails) private drugsDetails;
    mapping(string => DrugEnvironmental) private drugsEnvironmental;
    mapping(string => DrugStatus) private drugsStatus;
    mapping(string => mapping(uint256 => EnvironmentalLog)) private environmentalLogs;
    mapping(string => string) private recallReasons;

    modifier onlyCurrentOwner(string memory batchNumber) {
        require(drugsBase[batchNumber].currentOwner == msg.sender, "Not owner");
        _;
    }

    modifier drugExists(string memory batchNumber) {
        require(bytes(drugsBase[batchNumber].name).length > 0, "Drug not found");
        _;
    }

    function addDrugBase(
        string memory batchNumber,
        string memory name,
        string memory manufacturer,
        uint256 manufacturingDate,
        uint256 expiryDate
    ) public {
        require(bytes(drugsBase[batchNumber].name).length == 0, "Drug exists");
        
        DrugBase storage newDrug = drugsBase[batchNumber];
        newDrug.name = name;
        newDrug.manufacturer = manufacturer;
        newDrug.manufacturingDate = manufacturingDate;
        newDrug.expiryDate = expiryDate;
        newDrug.batchNumber = batchNumber;
        newDrug.currentOwner = msg.sender;
        newDrug.isVerified = false;

        // Initialize status
        address[] memory ownerHistory = new address[](1);
        ownerHistory[0] = msg.sender;
        drugsStatus[batchNumber].ownershipHistory = ownerHistory;
        drugsStatus[batchNumber].status = Status.Manufactured;
    }

    function addDrugDetails(
        string memory batchNumber,
        string memory dosageForm,
        uint256 strength,
        string memory storageConditions,
        string memory serialNumber,
        uint256 price
    ) public onlyCurrentOwner(batchNumber) {
        DrugDetails storage details = drugsDetails[batchNumber];
        details.dosageForm = dosageForm;
        details.strength = strength;
        details.storageConditions = storageConditions;
        details.serialNumber = serialNumber;
        details.price = price;
    }

    function setEnvironmentalLimits(
        string memory batchNumber,
        uint256 maxTemp,
        uint256 minTemp,
        uint256 maxHumid
    ) public onlyCurrentOwner(batchNumber) {
        DrugEnvironmental storage env = drugsEnvironmental[batchNumber];
        env.maxTemperature = maxTemp;
        env.minTemperature = minTemp;
        env.maxHumidity = maxHumid;
    }

    function updateEnvironmentalData(
        string memory batchNumber,
        uint256 temperature,
        uint256 humidity
    ) public drugExists(batchNumber) {
        DrugEnvironmental storage env = drugsEnvironmental[batchNumber];
        env.currentTemperature = temperature;
        env.currentHumidity = humidity;
        
        bool breached = (temperature > env.maxTemperature || 
                        temperature < env.minTemperature ||
                        humidity > env.maxHumidity);
        
        if (breached) {
            env.temperatureBreached = true;
            drugsStatus[batchNumber].status = Status.Recalled;
        }

        uint256 timestamp = block.timestamp;
        environmentalLogs[batchNumber][timestamp] = EnvironmentalLog({
            temperature: temperature,
            humidity: humidity,
            timestamp: timestamp,
            reporter: msg.sender
        });
        drugsStatus[batchNumber].logTimestamps.push(timestamp);

        emit EnvironmentalUpdate(batchNumber, temperature, humidity, breached);
    }

    function getEnvironmentalLog(string memory batchNumber, uint256 timestamp) 
        public 
        view 
        returns (uint256 temperature, uint256 humidity, address reporter) 
    {
        EnvironmentalLog memory log = environmentalLogs[batchNumber][timestamp];
        return (log.temperature, log.humidity, log.reporter);
    }

    function getLogTimestamps(string memory batchNumber) 
        public 
        view 
        returns (uint256[] memory) 
    {
        return drugsStatus[batchNumber].logTimestamps;
    }

    function transferOwnership(string memory batchNumber, address newOwner)
        public
        onlyCurrentOwner(batchNumber)
    {
        address previousOwner = drugsBase[batchNumber].currentOwner;
        drugsBase[batchNumber].currentOwner = newOwner;
        drugsStatus[batchNumber].ownershipHistory.push(newOwner);
        emit OwnershipTransferred(batchNumber, previousOwner, newOwner);
    }

    function verifyDrug(string memory batchNumber) 
        public 
        drugExists(batchNumber) 
    {
        drugsBase[batchNumber].isVerified = true;
        emit DrugVerified(batchNumber, msg.sender);
    }

    function updateStatus(string memory batchNumber, Status newStatus) 
        public 
        onlyCurrentOwner(batchNumber) 
    {
        drugsStatus[batchNumber].status = newStatus;
        emit DrugStatusChanged(batchNumber, newStatus);
    }

    function updatePrice(string memory batchNumber, uint256 newPrice) 
        public 
        onlyCurrentOwner(batchNumber) 
    {
        drugsDetails[batchNumber].price = newPrice;
        emit PriceUpdated(batchNumber, newPrice);
    }

    function recallDrug(string memory batchNumber, string memory reason) 
        public 
        drugExists(batchNumber) 
    {
        drugsStatus[batchNumber].status = Status.Recalled;
        recallReasons[batchNumber] = reason;
        emit DrugRecalled(batchNumber, reason);
    }

    function getDrugBase(string memory batchNumber)
        public
        view
        returns (
            string memory name,
            string memory manufacturer,
            uint256 manufacturingDate,
            uint256 expiryDate,
            address currentOwner,
            bool isVerified
        )
    {
        DrugBase storage drug = drugsBase[batchNumber];
        return (
            drug.name,
            drug.manufacturer,
            drug.manufacturingDate,
            drug.expiryDate,
            drug.currentOwner,
            drug.isVerified
        );
    }

    function getDrugDetails(string memory batchNumber)
        public
        view
        returns (
            string memory dosageForm,
            uint256 strength,
            string memory storageConditions,
            string memory serialNumber,
            uint256 price
        )
    {
        DrugDetails storage details = drugsDetails[batchNumber];
        return (
            details.dosageForm,
            details.strength,
            details.storageConditions,
            details.serialNumber,
            details.price
        );
    }

    function getDrugStatus(string memory batchNumber)
        public
        view
        returns (
            Status status,
            address[] memory ownershipHistory
        )
    {
        DrugStatus storage drugStatus = drugsStatus[batchNumber];
        return (
            drugStatus.status,
            drugStatus.ownershipHistory
        );
    }

    function getDrugEnvironmental(string memory batchNumber)
        public
        view
        returns (
            uint256 currentTemp,
            uint256 currentHumid,
            uint256 maxTemp,
            uint256 minTemp,
            uint256 maxHumid,
            bool tempBreached
        )
    {
        DrugEnvironmental storage env = drugsEnvironmental[batchNumber];
        return (
            env.currentTemperature,
            env.currentHumidity,
            env.maxTemperature,
            env.minTemperature,
            env.maxHumidity,
            env.temperatureBreached
        );
    }
}