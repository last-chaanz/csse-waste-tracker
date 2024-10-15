import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const WasteBinList = () => {
    const [wasteBins, setWasteBins] = useState([]);
    const [message, setMessage] = useState('');
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedBin, setSelectedBin] = useState(null);
    const [updatedLocation, setUpdatedLocation] = useState('');
    const [updatedBinType, setUpdatedBinType] = useState('');
    const navigate = useNavigate();

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
            <div className="min-h-screen bg-gradient-to-r from-green-200 to-blue-200 flex flex-col items-center">
                <button
                    onClick={handleRegisterBin}
                    className="mt-4 mb-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                    Register New Bin
                </button>
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-4xl font-bold text-center mt-10 text-blue-600">Manage Your Waste Bins Here</h2>

                    {message && (
                        <div className="text-red-500 text-center mt-4">
                            {message}
                        </div>
                    )}

                    {wasteBins.length === 0 ? (
                        <div className="text-center text-gray-700 text-lg mt-4">
                            No waste bins registered.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                            {wasteBins.map((bin) => (
                                <div
                                    key={bin._id}
                                    className="border border-gray-200 rounded-lg p-4 flex flex-col bg-white hover:bg-gray-100 transition duration-300 transform hover:scale-105 shadow-md"
                                >
                                    {/* Image */}
                                    {bin.image && (
                                        <img
                                            src={bin.image}
                                            alt={`Waste Bin in ${bin.location}`}
                                            className="w-full h-50 object-cover rounded-lg mb-4"
                                        />
                                    )}
                                    {/* Location */}
                                    <h3 className="font-semibold text-xl mb-2 text-blue-500">
                                        {bin.location}
                                    </h3>
                                    {/* Bin Type */}
                                    <p className="text-sm text-gray-700">
                                        <strong>Bin Type:</strong> {bin.binType}
                                    </p>
                                    {/* Waste Level */}
                                    <p className="text-sm text-gray-700">
                                        <strong>Waste Level:</strong> {bin.waste_level}%
                                    </p>
                                    {/* Status */}
                                    <p className="text-sm text-gray-700">
                                        <strong>Status:</strong> {bin.status}
                                    </p>
                                    <div className="mt-4 flex space-x-2">
                                        <button
                                            onClick={() => handleUpdateBin(bin)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 font-semibold shadow-sm"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDeleteBin(bin._id)}
                                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200 font-semibold shadow-sm"
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
            </div>
        </>
    );
};

export default WasteBinList;
