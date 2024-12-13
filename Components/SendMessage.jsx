import { useState, useContext } from "react";
import { TrackingContext } from "../Conetxt/Tracking";

export default ({ openSendMessage, setOpenSendMessage }) => {
  const { currentUser } = useContext(TrackingContext);
  const [message, setMessage] = useState({
    receiverAddress: "",
    shipmentId: "",
    message: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Message Details:", {
        sender: currentUser,
        ...message
      });
      alert("Message sent successfully!");
      setOpenSendMessage(false);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message");
    }
  };

  return openSendMessage ? (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div
        className="fixed inset-0 w-full h-full bg-black opacity-40"
        onClick={() => setOpenSendMessage(false)}
      ></div>
      <div className="flex items-center min-h-screen px-4 py-8">
        <div className="relative w-full max-w-lg mx-auto bg-white rounded-md shadow-lg">
          <div className="flex justify-end">
            <button
              className="p-2 text-gray-400 rounded-md hover:bg-gray-100"
              onClick={() => setOpenSendMessage(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 mx-auto"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div className="max-w-sm mx-auto py-3 space-y-3 text-center">
            <h4 className="text-lg font-medium text-gray-800">
              Send Message
            </h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Receiver Address"
                  className="w-full pl-5 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                  onChange={(e) =>
                    setMessage({
                      ...message,
                      receiverAddress: e.target.value,
                    })
                  }
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Shipment ID"
                  className="w-full pl-5 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                  onChange={(e) =>
                    setMessage({
                      ...message,
                      shipmentId: e.target.value,
                    })
                  }
                />
              </div>
              <div className="relative">
                <textarea
                  placeholder="Your Message"
                  className="w-full pl-5 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                  rows="4"
                  onChange={(e) =>
                    setMessage({
                      ...message,
                      message: e.target.value,
                    })
                  }
                />
              </div>
              <button
                type="submit"
                className="block w-full mt-3 py-3 px-4 font-medium text-sm text-center text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg ring-offset-2 ring-indigo-600 focus:ring-2"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}; 