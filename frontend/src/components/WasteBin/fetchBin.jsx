/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import NavBar from '../common/Navbar';
import Footer from '../common/Footer';

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
                    bin._id === selectedBin._id ? { ...bin, location: updatedLocation, binType: updatedBinType } : bin,
                ),
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
            <NavBar />

            <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-gray-100 to-gray-200">
                <div className="mt-12 max-w-3xl p-4 text-center">
                    <p className="mb-4 text-lg text-gray-600">
                        Effortlessly manage your waste bins and keep track of their status. Whether it's recyclable,
                        non-recyclable, or food waste, register new bins and maintain a cleaner, greener environment.
                    </p>
                </div>

                <button
                    onClick={handleRegisterBin}
                    className="mb-6 mt-4 transform rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-white shadow-lg transition duration-200 hover:scale-105 hover:shadow-xl"
                >
                    Register New Bin
                </button>

                <div className="w-full max-w-6xl rounded-xl bg-white p-8 shadow-2xl">
                    <h2 className="mt-4 text-center text-4xl font-bold text-blue-600">Manage Your Waste Bins Here</h2>

                    {message && <div className="mt-4 text-center text-red-500">{message}</div>}

                    {wasteBins.length === 0 ? (
                        <div className="mt-6 text-center text-lg text-gray-700">No waste bins registered.</div>
                    ) : (
                        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                            {wasteBins.map((bin) => (
                                <div
                                    key={bin._id}
                                    className="flex transform flex-col items-center rounded-xl border border-gray-300 bg-white p-6 shadow-md transition duration-300 hover:scale-105 hover:bg-gray-100"
                                >
                                    {/* Image */}
                                    {bin.image ? (
                                        <img
                                            src={bin.image}
                                            alt={`Waste Bin in ${bin.location}`}
                                            className="h-42 mb-4 w-full rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-40 w-full items-center justify-center rounded-lg bg-gray-200 text-gray-500">
                                            No Image
                                        </div>
                                    )}

                                    {/* Location */}
                                    <h3 className="mb-2 text-xl font-semibold text-blue-500">{bin.location}</h3>

                                    {/* Bin Details */}
                                    <div className="text-sm text-gray-700">
                                        <p>
                                            <strong>Bin Type:</strong> {bin.binType}
                                        </p>
                                        <p>
                                            <strong>Waste Level:</strong> {bin.waste_level}%
                                        </p>
                                        <p>
                                            <strong>Status:</strong> {bin.status}
                                        </p>
                                        <p>
                                            <strong>Collection Day:</strong> {bin.collectionDay}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-4 flex space-x-3">
                                        <button
                                            onClick={() => handleUpdateBin(bin)}
                                            className="transform rounded-full bg-blue-500 px-4 py-2 text-white shadow-sm transition hover:scale-105 hover:bg-blue-600"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDeleteBin(bin._id)}
                                            className="transform rounded-full bg-red-500 px-4 py-2 text-white shadow-sm transition hover:scale-105 hover:bg-red-600"
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
                        <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
                            <h2 className="mb-4 text-xl font-semibold">Update Waste Bin</h2>
                            <form onSubmit={handleUpdateSubmit}>
                                <div className="mb-4">
                                    <label className="mb-1 block text-sm font-medium">Location</label>
                                    <input
                                        type="text"
                                        value={updatedLocation}
                                        onChange={(e) => setUpdatedLocation(e.target.value)}
                                        className="w-full rounded border border-gray-300 p-2"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="mb-1 block text-sm font-medium">Bin Type</label>
                                    <select
                                        value={updatedBinType}
                                        onChange={(e) => setUpdatedBinType(e.target.value)}
                                        className="w-full rounded border border-gray-300 p-2"
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
                                        className="rounded bg-gray-300 px-4 py-2 text-black transition hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
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
            <Footer />
        </>
    );
};

export default WasteBinList;
