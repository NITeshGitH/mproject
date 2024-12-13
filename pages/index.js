import React, { useState, useEffect, useContext } from 'react'
// INTERNAL IMPORT
import {
  Table,
  Form,
  Services,
  Profile,
  CompleteShipment,
  GetShipment,
  StartShipment,
  SendMessage,
} from '../Components';
import ShipCount from '../Components/ShipCount';

import { TrackingContext } from '@/Conetxt/Tracking';

const index = () => {
  const {
    currentUser,
    createShipment,
    getAllShipment,
    completeShipment,
    getShipment,
    startShipment,
    getShipmentsCount,
  } = useContext(TrackingContext);

  // STATE VARIABLE
  const [createShipmentModel, setCreateShipmentModel] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [startModel, setStartModel] = useState(false);
  const [completeModel, setCompleteModel] = useState(false);
  const [getModel, setGetModel] = useState(false);
  const [openSendMessage, setOpenSendMessage] = useState(false);
  //DATA STATE VARIABLE
  const [allShipmentsdata, setallShipmentsdata] = useState();
  const [shipCount, setShipCount] = useState(false);

  useEffect(() => {
    const getCampaignsData = getAllShipment();
    return async () => {
      const allData = await getCampaignsData;
      setallShipmentsdata(allData);
    };
  }, []);
  return (
    <>
      <Services
        setOpenProfile={setOpenProfile}
        setCompleteModel={setCompleteModel}
        setGetModel={setGetModel}
        setStartModel={setStartModel}
        setShipCount={setShipCount}
        setOpenSendMessage={setOpenSendMessage}
      />
      <Table
        setCreateShipmentModel={setCreateShipmentModel}
        allShipmentsdata={allShipmentsdata}
      />
      <Form
        createShipmentModel={createShipmentModel}
        createShipment={createShipment}
        setCreateShipmentModel={setCreateShipmentModel}
      />
      <Profile
        openProfile={openProfile}
        setOpenProfile={setOpenProfile}
        currentUser={currentUser}
        getShipmentsCount={getShipmentsCount}
      />
      <CompleteShipment
        completeModel={completeModel}
        setCompleteModel={setCompleteModel}
        completeShipment={completeShipment}
      />
      <GetShipment
        getModel={getModel}
        setGetModel={setGetModel}
        getShipment={getShipment}
      />
      <StartShipment
        startModel={startModel}
        setStartModel={setStartModel}
        startShipment={startShipment}
      />
      <ShipCount
        shipCount={shipCount}
        setShipCount={setShipCount}
        getShipmentsCount={getShipmentsCount}
      />
      {openSendMessage && (
        <SendMessage
          openSendMessage={openSendMessage}
          setOpenSendMessage={setOpenSendMessage}
        />
      )}
    </>
  );
};

export default index;
