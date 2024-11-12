import React, { useState, useEffect, useContext} from 'react'
// INTERNAL IMPORT
import { 
  Table,
  Form,
  Services,
  Profile,
  CompleteShipment,
  GetShipment,
  StartShipment,
} from '@/Components';

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
  const [openProfile, setOpenprofile] = useState(false);
  const [startModel, setStartModel] = useState(false);
  const [completeModal, setCompleteModal] = useState(false);
  const [getModel, setGetModel] = useState(false);
  //DATA STATE VARIABLE
  const [allShipmentsdata, setallShipmentsdata] = useState();

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
        setOpenprofile = {setOpenprofile}
        setCompleteModal = {setCompleteModal}
        setGetModel={setGetModel}
        setStartModel={setStartModel}
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
          setOpenprofile={setOpenprofile}
          currentUser={currentUser}
          getShipmentsCount={getShipmentsCount}
        />
        <CompleteShipment
          completeModal={completeModal}
          setCompleteModal={setCompleteModal}
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
          StartShipment={startShipment}
        />
    </>
  );
};

export default index;