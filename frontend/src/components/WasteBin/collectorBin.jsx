import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 

const CollectorBin = () => {
  const [message, setMessage] = useState('');
  const [address, setAddress] = useState('');
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBin, setSelectedBin] = useState(null); // For the selected bin in modals
  const [selectedDay, setSelectedDay] = useState(''); // State for storing the selected day
  const [showDayModal, setShowDayModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    const fetchAddressAndBins = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('User not authenticated.');
        setLoading(false);
        return;
      }

      let userId;
      try {
        const decodedToken = jwtDecode(token);
        userId = decodedToken.userId;
      } catch (error) {
        console.error('Invalid token:', error);
        setMessage('Invalid token.');
        setLoading(false);
        return;
      }

      try {
        const addressResponse = await axios.get(`http://localhost:4000/api/auth/userAddress/${userId}`);
        const userAddress = addressResponse.data.address;
        setAddress(userAddress);

        const binResponse = await axios.get(`http://localhost:4000/api/wastebin/${userAddress}`);
        setBins(binResponse.data.wasteBins || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('Error fetching bin details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAddressAndBins();
  }, []);

  // Function to handle collection day change
  const handleDayChange = async (binId, newDay) => {
    try {
      await axios.put(`http://localhost:4000/api/wastebin/updateDay/${binId}`, { collectionDay: newDay });
      setBins(bins.map(bin => bin._id === binId ? { ...bin, collectionDay: newDay } : bin));
      setShowDayModal(false);
    } catch (error) {
      console.error('Error updating collection day:', error);
    }
  };

  // Function to handle collection status update
  const handleStatusChange = async (binId) => {
    try {
      await axios.put(`http://localhost:4000/api/wastebin/markCollected/${binId}`);
      setBins(bins.map(bin => bin._id === binId ? { ...bin, waste_level: 0 } : bin));
      setShowStatusModal(false);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-5 text-teal-600">Assigned Bin Details</h1>
        {loading && <p className="text-gray-500">Loading...</p>}
        {message && <p className="text-red-500">{message}</p>}

        {address && <p className="text-lg mb-5 font-semibold">Collection Area: <span className="text-teal-500">{address}</span></p>}

        {bins.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 rounded-lg overflow-hidden shadow-md">
              <thead className="bg-teal-500 text-white">
                <tr>
                  <th className="border border-gray-300 p-4 text-left text-sm md:text-base">Bin Type</th>
                  <th className="border border-gray-300 p-4 text-left text-sm md:text-base">Waste Level (%)</th>
                  <th className="border border-gray-300 p-4 text-left text-sm md:text-base">Status</th>
                  <th className="border border-gray-300 p-4 text-left text-sm md:text-base">Collection Day</th>
                  <th className="border border-gray-300 p-4 text-left text-sm md:text-base">Manage Bin</th>
                </tr>
              </thead>
              <tbody>
                {bins.map((bin, index) => (
                  <tr key={index} className="hover:bg-teal-100 transition duration-200">
                    <td className="border border-gray-300 p-4 text-sm md:text-base">{bin.binType}</td>
                    <td className="border border-gray-300 p-4 text-sm md:text-base">{bin.waste_level}</td>
                    <td className="border border-gray-300 p-4 text-sm md:text-base">{bin.status}</td>
                    <td className="border border-gray-300 p-4 text-sm md:text-base">{bin.collectionDay}</td>
                    <td className="border border-gray-300 p-4 text-sm md:text-base text-center">
                      <button
                        className="mx-2 py-2 px-4 bg-teal-500 hover:bg-teal-700 text-white font-bold rounded"
                        onClick={() => { setSelectedBin(bin); setSelectedDay(bin.collectionDay); setShowDayModal(true); }}
                      >
                        Change Day
                      </button>
                      <button
                        className="mx-2 py-2 px-4 bg-teal-500 hover:bg-teal-700 text-white font-bold rounded"
                        onClick={() => { setSelectedBin(bin); setShowStatusModal(true); }}
                      >
                        Mark as Collected
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && <p className="text-lg">No bins assigned to this location yet.</p>
        )}
      </div>

      {/* Collection Day Modal */}
      {showDayModal && selectedBin && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Change Collection Day for {selectedBin.binType}</h2>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedDay} // Pre-select current collection day
              onChange={(e) => setSelectedDay(e.target.value)} // Capture selected day
            >
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-teal-500 rounded hover:bg-teal-700 text-white ml-2"
                onClick={() => handleDayChange(selectedBin._id, selectedDay)} // Pass the selected day
              >
                Submit
              </button>
              <button
                className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500 text-white"
                onClick={() => setShowDayModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Collection Status Modal */}
      {showStatusModal && selectedBin && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Mark {selectedBin.binType} as Collected</h2>
            <p>Are you sure you want to mark this bin as collected?</p>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-teal-500 hover:bg-teal-700 rounded text-white"
                onClick={() => handleStatusChange(selectedBin._id)}
              >
                Yes
              </button>
              <button
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 rounded text-white ml-2"
                onClick={() => setShowStatusModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectorBin;
