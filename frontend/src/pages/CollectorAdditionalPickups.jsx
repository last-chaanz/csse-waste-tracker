/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Loader2, CheckCircle, AlertCircle, Truck, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { jwtDecode } from 'jwt-decode';

const CollectorAdditionalPickups = () => {
    const [pickups, setPickups] = useState([]);
    const [showCompleted, setShowCompleted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPickup, setSelectedPickup] = useState(null);
    const [isViewingComplaints, setIsViewingComplaints] = useState(false);
    const [collectorLocation, setCollectorLocation] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        fetchPickups();
    }, []);

    const fetchPickups = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('User not authenticated.');
            }

            const decodedToken = jwtDecode(token);
            setCollectorLocation(decodedToken.location);

            const response = await axios.get('http://localhost:4000/api/additional-pickups', {
                headers: { Authorization: `Bearer ${token}` },
            });

            setPickups(response.data);
        } catch (error) {
            console.error('Error fetching pickups:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch pickups. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const filteredPickups = pickups.filter((pickup) =>
        showCompleted ? pickup.pickupStatus === 'Completed' : pickup.pickupStatus !== 'Completed',
    );

    const handleAcceptPickup = async (pickupId) => {
        try {
            await axios.put(
                `http://localhost:4000/api/additional-pickup/${pickupId}/accept`,
                {},
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                },
            );
            fetchPickups();
            toast({
                title: 'Success',
                description: 'Pickup accepted successfully.',
            });
        } catch (error) {
            console.error('Error accepting pickup:', error);
            toast({
                title: 'Error',
                description: 'Failed to accept pickup. Please try again.',
                variant: 'destructive',
            });
        }
    };

    const handleCompletePickup = async (pickupId) => {
        try {
            await axios.put(
                `http://localhost:4000/api/additional-pickup/${pickupId}/complete`,
                {},
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                },
            );
            fetchPickups();
            toast({
                title: 'Success',
                description: 'Pickup completed successfully.',
            });
        } catch (error) {
            console.error('Error completing pickup:', error);
            toast({
                title: 'Error',
                description: 'Failed to complete pickup. Please try again.',
                variant: 'destructive',
            });
        }
    };

    const renderPickupCard = (pickup) => (
        <div key={pickup._id} className="mb-4 rounded-lg border border-gray-300 bg-white p-4 shadow-md">
            <div className="mb-2 flex justify-between">
                <span className="font-semibold">{pickup.wasteType}</span>
                <span
                    className={`rounded-full px-2 py-1 text-xs ${pickup.pickupStatus === 'Completed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}
                >
                    {pickup.pickupStatus}
                </span>
            </div>
            <div className="mb-2 text-sm">
                <p>Date: {format(new Date(pickup.pickupDate), 'PPP')}</p>
                <p>Payment: {pickup.paymentStatus}</p>
                <p className="truncate">Description: {pickup.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
                {!showCompleted && (
                    <>
                        {pickup.pickupStatus === 'Pending' && !pickup.collectorAccepted && (
                            <Button
                                onClick={() => handleAcceptPickup(pickup._id)}
                                className="flex-grow bg-green-500 text-xs hover:bg-green-700"
                            >
                                <CheckCircle className="mr-1 h-3 w-3" /> Accept
                            </Button>
                        )}
                        {pickup.pickupStatus === 'Pending' && pickup.collectorAccepted && (
                            <Button
                                onClick={() => handleCompletePickup(pickup._id)}
                                className="flex-grow bg-blue-500 text-xs hover:bg-blue-700"
                            >
                                <Truck className="mr-1 h-3 w-3" /> Pickup Done
                            </Button>
                        )}
                    </>
                )}
                {pickup.complaint && (
                    <Button
                        onClick={() => {
                            setSelectedPickup(pickup);
                            setIsViewingComplaints(true);
                        }}
                        className="flex-grow bg-yellow-500 text-xs hover:bg-yellow-700"
                    >
                        <AlertCircle className="mr-1 h-3 w-3" /> View Complaints
                    </Button>
                )}
            </div>
        </div>
    );

    return (
        <div className="container mx-auto mt-4 rounded-lg bg-white p-4 shadow-lg md:mt-10 md:p-6">
            <h1 className="mb-4 text-2xl font-bold text-teal-600 md:mb-6 md:text-3xl">Additional Pickups</h1>
            <div className="mb-4 flex flex-col items-start justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
                <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-teal-500 md:h-5 md:w-5" />
                    <span className="text-base font-semibold md:text-lg">Your Location: {collectorLocation}</span>
                </div>
                <Button
                    onClick={() => setShowCompleted(!showCompleted)}
                    className="w-full bg-blue-500 text-sm hover:bg-blue-700 md:w-auto"
                >
                    {showCompleted ? 'Show Active Pickups' : 'Show Completed Pickups'}
                </Button>
            </div>
            {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
                </div>
            ) : (
                <div>
                    <div className="hidden md:block">
                        <table className="min-w-full border-collapse overflow-hidden rounded-lg border border-gray-300 shadow-md">
                            <thead className="bg-teal-500 text-white">
                                <tr>
                                    <th className="border border-gray-300 p-2 text-left text-sm md:p-4 md:text-base">
                                        Waste Type
                                    </th>
                                    <th className="border border-gray-300 p-2 text-left text-sm md:p-4 md:text-base">
                                        Pickup Date
                                    </th>
                                    <th className="border border-gray-300 p-2 text-left text-sm md:p-4 md:text-base">Status</th>
                                    <th className="border border-gray-300 p-2 text-left text-sm md:p-4 md:text-base">Payment</th>
                                    <th className="border border-gray-300 p-2 text-left text-sm md:p-4 md:text-base">
                                        Description
                                    </th>
                                    <th className="border border-gray-300 p-2 text-left text-sm md:p-4 md:text-base">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPickups.map((pickup) => (
                                    <tr
                                        key={pickup._id}
                                        className={`transition duration-200 hover:bg-teal-100 ${
                                            pickup.collectorAccepted ? 'bg-green-100' : ''
                                        }`}
                                    >
                                        <td className="border border-gray-300 p-2 text-sm md:p-4 md:text-base">
                                            {pickup.wasteType}
                                        </td>
                                        <td className="border border-gray-300 p-2 text-sm md:p-4 md:text-base">
                                            {format(new Date(pickup.pickupDate), 'PPP')}
                                        </td>
                                        <td className="border border-gray-300 p-2 text-sm md:p-4 md:text-base">
                                            {pickup.pickupStatus}
                                        </td>
                                        <td className="border border-gray-300 p-2 text-sm md:p-4 md:text-base">
                                            {pickup.paymentStatus}
                                        </td>
                                        <td className="border border-gray-300 p-2 text-sm md:p-4 md:text-base">
                                            {pickup.description}
                                        </td>
                                        <td className="border border-gray-300 p-2 text-sm md:p-4 md:text-base">
                                            {!showCompleted && (
                                                <>
                                                    {pickup.pickupStatus === 'Pending' && !pickup.collectorAccepted && (
                                                        <Button
                                                            onClick={() => handleAcceptPickup(pickup._id)}
                                                            className="mr-2 bg-green-500 text-xs hover:bg-green-700 md:text-sm"
                                                        >
                                                            <CheckCircle className="mr-1 h-3 w-3 md:h-4 md:w-4" /> Accept
                                                        </Button>
                                                    )}
                                                    {pickup.pickupStatus === 'Pending' && pickup.collectorAccepted && (
                                                        <Button
                                                            onClick={() => handleCompletePickup(pickup._id)}
                                                            className="mr-2 bg-blue-500 text-xs hover:bg-blue-700 md:text-sm"
                                                        >
                                                            <Truck className="mr-1 h-3 w-3 md:h-4 md:w-4" /> Pickup Done
                                                        </Button>
                                                    )}
                                                </>
                                            )}
                                            {pickup.complaint && (
                                                <Button
                                                    onClick={() => {
                                                        setSelectedPickup(pickup);
                                                        setIsViewingComplaints(true);
                                                    }}
                                                    className="bg-yellow-500 text-xs hover:bg-yellow-700 md:text-sm"
                                                >
                                                    <AlertCircle className="mr-1 h-3 w-3 md:h-4 md:w-4" /> View Complaints
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="md:hidden">{filteredPickups.map(renderPickupCard)}</div>
                </div>
            )}
            <Dialog open={isViewingComplaints} onOpenChange={setIsViewingComplaints}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Complaints</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {selectedPickup?.complaint && (
                            <div className="rounded-md bg-yellow-100 p-4">
                                <p className="text-sm text-yellow-700">{selectedPickup.complaint}</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CollectorAdditionalPickups;
