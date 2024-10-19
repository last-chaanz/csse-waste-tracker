import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import NavBar from '../common/Navbar';
import Footer from '../common/Footer';

const WasteBinForm = () => {
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const [binType, setBinType] = useState('Food');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate('/user/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    const binData = {
      location,
      binType,
      waste_level: 0,
      image,
      status: 'Empty',
      userId,
      collectionDay: 'To Be Scheduled',
      collectionStatus: 'Scheduled',
    };

    try {
      await axios.post('http://localhost:4000/api/wastebins', binData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setMessage('Waste Bin registered successfully!');
      setLocation('');
      setBinType('Food');
      setImage('');
    } catch (error) {
      setMessage('Error registering the Waste Bin.');
      console.error(error);
    }
  };

  return (
    <>
        <NavBar />

      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
        <form
          className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-3xl border border-gray-200 transform hover:scale-105 transition-transform duration-300"
          onSubmit={handleSubmit}
        >
          <p className="text-center text-lg text-gray-700 mb-6 px-6">
            Help us keep your community clean by registering your waste bin. This will allow us to monitor waste levels and ensure timely collection. Please provide the necessary details below to get started.
          </p>
          <h2 className="text-3xl font-extrabold text-center text-green-400 mb-6">Register Waste Bin</h2>

          {message && (
            <div className="text-center text-red-600 font-semibold mb-4">
              {message}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="location">
              City
            </label>
            <input
              type="text"
              id="location"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="binType">
              Bin Type
            </label>
            <select
              id="binType"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              value={binType}
              onChange={(e) => setBinType(e.target.value)}
              required
            >
              <option value="Food">Food</option>
              <option value="Non Recyclable Waste">Non Recyclable Waste</option>
              <option value="Recyclable Waste">Recyclable Waste</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="image">
              Bin Image
            </label>
            <input
              type="text"
              id="image"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              placeholder="Image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-green-700 hover:bg-green-500 text-white font-bold transition-colors duration-300"
          >
            Register Waste Bin
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default WasteBinForm;
