// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Tracking {
    enum ShipmentStatus { PENDING, IN_TRANSIT, DELIVERED }
    struct Shipment {
        address sender;
        address receiver;
        uint256 pickupTime;
        uint256 deliveryTime;
        uint256 distance;
        uint256 price;
        ShipmentStatus status;
        bool isPaid;
        int16 temperature; // in Celsius
        uint16 humidity;    // in percentage
        string location;    // location details for tracking

    }

    mapping (address => Shipment[]) public shipments;
    uint256 public shipmentCount;

    struct TypeShipment {
        address sender;
        address receiver;
        uint256 pickupTime;
        uint256 deliveryTime;
        uint256 distance;
        uint256 price;
        ShipmentStatus status;
        bool isPaid;
        int16 temperature; // in Celsius
        uint16 humidity;    // in percentage
        string location;    // location details for tracking
    }

    TypeShipment[] public typeShipments;


    event ShipmentCreated( address indexed sender, address indexed receiver, uint256 pickupTime, uint256 distance, uint256 price);
    event ShipmentInTransit(address indexed sender, address indexed receiver, uint256 pickupTime);
    event ShipmentDelivered(address indexed sender,  address indexed receiver, uint256 deliveryTime);
    event ShipmentPaid(address indexed sender, address indexed receiver, uint256 amount);
    event DataRecorded(uint256 indexed dataId, int16 temperature, uint16 humidity, string location);
    event Alert(string message, uint256 indexed dataId, int16 temperature, uint16 humidity);

    constructor() {
        shipmentCount = 0;
    }

    function createShipment(address _receiver, uint256 _pickupTime, uint256 _distance, uint256 _price) public payable {
        require(msg.value == _price, "Payment amount must match the price.");

        Shipment memory shipment = Shipment(
            msg.sender, 
            _receiver, 
            _pickupTime, 
            0, 
            _distance, 
            _price, 
            ShipmentStatus.PENDING, 
            false,
            0, // initial temperature
            0, // initial humidity
            "" // initial location
        );

        shipments[msg.sender].push(shipment);
        shipmentCount++;

        typeShipments.push(
            TypeShipment(
                msg.sender,
                _receiver,
                _pickupTime,
                0,
                _distance,
                _price,
                ShipmentStatus.PENDING,
                false,
                0, // initial temperature
                0, // initial humidity
                "" // initial location
            )
        );

        emit ShipmentCreated(msg.sender, _receiver, _pickupTime, _distance, _price);
    }

    // Function to record IoT data during shipment
    function recordData(uint256 _shipmentIndex, int16 _temperature, uint16 _humidity, string memory _location) public {
        Shipment storage shipment = shipments[msg.sender][_shipmentIndex];
        TypeShipment storage typeShipment = typeShipments[_shipmentIndex];

        shipment.temperature = _temperature;
        shipment.humidity = _humidity;
        shipment.location = _location;
        typeShipment.temperature = _temperature;
        typeShipment.humidity = _humidity;
        typeShipment.location = _location;

        emit DataRecorded(_shipmentIndex, _temperature, _humidity, _location);

        // Check for threshold violations (example: temperature for RBC should be 4°C)
        if (_temperature < 2 || _temperature > 6) {
            emit Alert("Temperature out of range!", _shipmentIndex, _temperature, _humidity);
        }

        if (_humidity < 30 || _humidity > 60) { // Example humidity range
            emit Alert("Humidity out of range!", _shipmentIndex, _temperature, _humidity);
        }
    }
    
    function startShipment(address _sender, address _receiver, uint256 _index) public {
        Shipment storage shipment = shipments[_sender][_index];
        TypeShipment storage typeShipment = typeShipments[_index];

        require(shipment.receiver == _receiver, "Invalid receiver.");
        require(shipment.status == ShipmentStatus.PENDING, "Shipment already in transit.");

        shipment.status = ShipmentStatus.IN_TRANSIT;
        typeShipment.status = ShipmentStatus.IN_TRANSIT;

        emit ShipmentInTransit(_sender, _receiver, shipment.pickupTime);
    }

    function completeShipment(address _sender,address _receiver, uint256 _index) public {
        Shipment storage shipment = shipments[_sender][_index];
        TypeShipment storage typeShipment = typeShipments[_index];

        require(shipment.receiver == _receiver, "Invalid receiver.");
        require(shipment.status == ShipmentStatus.IN_TRANSIT, "Shipment not in transit.");
        require(!shipment.isPaid, "Shipment already paid.");

        shipment.status = ShipmentStatus.DELIVERED;
         typeShipment.status = ShipmentStatus.DELIVERED;
         typeShipment.deliveryTime = block.timestamp;
        shipment.deliveryTime = block.timestamp;

        uint256 amount = shipment.price;

        payable(shipment.sender).transfer(amount);

        shipment.isPaid = true;
        typeShipment.isPaid = true;

        emit ShipmentDelivered(_sender, _receiver, shipment.deliveryTime);
        emit ShipmentPaid(_sender, _receiver, amount);
    }

    function getShipment(address _sender, uint256 _index) public view returns (address, address, uint256, uint256, uint256, uint256, ShipmentStatus, bool){
        Shipment memory shipment = shipments[_sender][_index];
        return (shipment.sender, shipment.receiver, shipment.pickupTime, shipment.deliveryTime, shipment.distance, shipment.price, shipment.status, shipment.isPaid);

    }

    function getShipmentsCount(address _sender) public view returns (uint256){
        return shipments[_sender].length;
    }

    function getAllTransactions() public view returns (TypeShipment[] memory) {
        return typeShipments;
    }
}