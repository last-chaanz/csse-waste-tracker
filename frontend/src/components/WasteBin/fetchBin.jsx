import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import LoginImage from '../../images/logoImage.jpeg'; 

const WasteBinList = () => {
    const [wasteBins, setWasteBins] = useState([]);
    const [message, setMessage] = useState('');
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedBin, setSelectedBin] = useState(null);
    const [updatedLocation, setUpdatedLocation] = useState('');
    const [updatedBinType, setUpdatedBinType] = useState('');
    const navigate = useNavigate();

    const handleNavigation = () => {
      navigate('/user/dashboard');
    };
  

    useEffect(() => {
        const fetchWasteBins = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('User not authenticated.');
                return;
            }

            let userId;
            try {
                const decodedToken = jwtDecode(token);
                userId = decodedToken.userId;
            } catch (error) {
                console.error('Invalid token:', error);
                setMessage('Invalid token.');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:4000/api/wastebinUser/${userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                setWasteBins(response.data);
            } catch (error) {
                setMessage('Error fetching waste bins.');
                console.error(error);
            }
        };

        fetchWasteBins();
    }, []);

    const handleRegisterBin = () => {
        navigate('/registerBin');
    };

    const handleUpdateBin = (bin) => {
        setSelectedBin(bin);
        setUpdatedLocation(bin.location);
        setUpdatedBinType(bin.binType);
        setIsUpdateModalOpen(true);
    };

    const handleDeleteBin = async (binId) => {
        const confirmed = window.confirm('Are you sure you want to delete this waste bin?');
        if (confirmed) {
            try {
                await axios.delete(`http://localhost:4000/api/wastebins/${binId}`);
                setWasteBins((prevWasteBins) => prevWasteBins.filter((bin) => bin._id !== binId));
                setMessage('Waste bin deleted successfully.');
            } catch (error) {
                console.error('Error deleting waste bin:', error);
                setMessage('Error deleting waste bin.');
            }
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:4000/api/updateBin/${selectedBin._id}`, {
                location: updatedLocation,
                binType: updatedBinType,
            });
            setWasteBins((prevWasteBins) =>
                prevWasteBins.map((bin) =>
                    bin._id === selectedBin._id ? { ...bin, location: updatedLocation, binType: updatedBinType } : bin
                )
            );
            setMessage('Waste bin updated successfully.');
            setIsUpdateModalOpen(false);
        } catch (error) {
            console.error('Error updating waste bin:', error);
            setMessage('Error updating waste bin.');
        }
    };

    return (
        <>
         {/* Navigation Bar */}
      <nav className="bg-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* Logo Image with navigation */}
            <img
              src={LoginImage}
              alt="CountryClean.LK"
              className="mr-3 h-16 cursor-pointer"
              onClick={handleNavigation}
            />
            <h1
              className="text-xl font-bold cursor-pointer"
              onClick={handleNavigation}
            >
              CountryClean.LK
            </h1>
          </div>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/FetchBin')}
              className="rounded-md px-4 py-2 text-gray-600 transition-colors duration-300 hover:bg-blue-500 hover:text-white"
            >
              Manage Bin
            </button>
            <button
              onClick={() => navigate('/additional-pickups')}
              className="rounded-md px-4 py-2 text-gray-600 transition-colors duration-300 hover:bg-blue-500 hover:text-white"
            >
              View Schedule
            </button>
            <button
              onClick={() => navigate('/payments')}
              className="rounded-md px-4 py-2 text-gray-600 transition-colors duration-300 hover:bg-blue-500 hover:text-white"
            >
              Payments
            </button>
          </div>
        </div>
      </nav>

            <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-100 to-gray-200">
    <div className="mt-12 p-4 text-center max-w-3xl">
        <p className="text-lg text-gray-600 mb-4">
            Effortlessly manage your waste bins and keep track of their status. Whether it's recyclable, non-recyclable, or food waste, register new bins and maintain a cleaner, greener environment.
        </p>
    </div>

    <button
        onClick={handleRegisterBin}
        className="mt-4 mb-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-200"
    >
        Register New Bin
    </button>

    <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-6xl">
        <h2 className="text-4xl font-bold text-center mt-4 text-blue-600">Manage Your Waste Bins Here</h2>

        {message && (
            <div className="text-red-500 text-center mt-4">
                {message}
            </div>
        )}

        {wasteBins.length === 0 ? (
            <div className="text-center text-gray-700 text-lg mt-6">
                No waste bins registered.
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
                {wasteBins.map((bin) => (
                    <div
                        key={bin._id}
                        className="border border-gray-300 rounded-xl p-6 bg-white hover:bg-gray-100 transition duration-300 transform hover:scale-105 shadow-md flex flex-col items-center"
                    >
                        {/* Image */}
                        {bin.image ? (
                            <img
                                src={bin.image}
                                alt={`Waste Bin in ${bin.location}`}
                                className="w-full h-42 object-cover rounded-lg mb-4"
                            />
                        ) : (
                            <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                                No Image
                            </div>
                        )}

                        {/* Location */}
                        <h3 className="font-semibold text-xl mb-2 text-blue-500">
                            {bin.location}
                        </h3>

                        {/* Bin Details */}
                        <div className="text-sm text-gray-700">
                            <p><strong>Bin Type:</strong> {bin.binType}</p>
                            <p><strong>Waste Level:</strong> {bin.waste_level}%</p>
                            <p><strong>Status:</strong> {bin.status}</p>
                            <p><strong>Collection Day:</strong> {bin.collectionDay}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 flex space-x-3">
                            <button
                                onClick={() => handleUpdateBin(bin)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition transform hover:scale-105 shadow-sm"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => handleDeleteBin(bin._id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition transform hover:scale-105 shadow-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>

    {/* Update Modal */}
    {isUpdateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-semibold mb-4">Update Waste Bin</h2>
                <form onSubmit={handleUpdateSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <input
                            type="text"
                            value={updatedLocation}
                            onChange={(e) => setUpdatedLocation(e.target.value)}
                            className="border border-gray-300 p-2 w-full rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Bin Type</label>
                        <select
                            value={updatedBinType}
                            onChange={(e) => setUpdatedBinType(e.target.value)}
                            className="border border-gray-300 p-2 w-full rounded"
                            required
                        >
                            <option value="Food">Food</option>
                            <option value="Recyclable Waste">Recyclable Waste</option>
                            <option value="Non Recyclable Waste">Non Recyclable Waste</option>
                        </select>
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={() => setIsUpdateModalOpen(false)}
                            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )}
      <br></br>
</div>
            {/* Footer */}
            <footer className="bg-white p-4 text-center shadow-md">
                <p className="text-gray-600">© 2024 CountryClean.LK. All rights reserved.</p>
                <p className="text-gray-600">
                    Follow us on{' '}
                    <a href="#" className="text-blue-500 hover:underline">
                        Facebook
                    </a>
                    ,{' '}
                    <a href="#" className="text-blue-500 hover:underline">
                        Twitter
                    </a>
                    ,{' '}
                    <a href="#" className="text-blue-500 hover:underline">
                        Instagram
                    </a>
                </p>
            </footer>
        </>
    );
};

export default WasteBinList;
