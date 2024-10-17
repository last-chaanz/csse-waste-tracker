import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, isBefore, startOfDay } from 'date-fns';
import { PlusCircle, Loader2, AlertCircle, CreditCard } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { jwtDecode } from 'jwt-decode';

const AdditionalPickupList = () => {
    const [pickups, setPickups] = useState([]);
    const [bins, setBins] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingPickup, setIsAddingPickup] = useState(false);
    const [isAddingComplaint, setIsAddingComplaint] = useState(false);
    const [selectedPickup, setSelectedPickup] = useState(null);
    const [complaint, setComplaint] = useState('');
    const [newPickup, setNewPickup] = useState({
        binId: '',
        wasteType: '',
        pickupDate: new Date(),
        description: '',
    });
    const { toast } = useToast();

    useEffect(() => {
        fetchPickupsAndBins();
    }, []);

    const fetchPickupsAndBins = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('User not authenticated.');
            }

            let userId;
            try {
                const decodedToken = jwtDecode(token);
                userId = decodedToken.userId;
            } catch (error) {
                throw new Error('Invalid token.');
            }

            const [pickupsResponse, binsResponse] = await Promise.all([
                axios.get(`http://localhost:4000/api/additional-pickups/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get(`http://localhost:4000/api/wastebinUser/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            setPickups(pickupsResponse.data);
            setBins(binsResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to fetch data. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (name, value) => {
        setNewPickup({ ...newPickup, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isBefore(newPickup.pickupDate, startOfDay(new Date()))) {
            toast({
                title: 'Error',
                description: 'Pickup date cannot be in the past.',
                variant: 'destructive',
            });
            return;
        }
        try {
            await axios.post(
                'http://localhost:4000/api/additional-pickup',
                {
                    ...newPickup,
                    pickupDate: format(newPickup.pickupDate, 'yyyy-MM-dd'),
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                },
            );
            setIsAddingPickup(false);
            setNewPickup({ binId: '', wasteType: '', pickupDate: new Date(), description: '' });
            fetchPickupsAndBins();
            toast({
                title: 'Success',
                description: 'New pickup added successfully.',
            });
        } catch (error) {
            console.error('Error creating pickup:', error);
            toast({
                title: 'Error',
                description: 'Failed to add new pickup. Please try again.',
                variant: 'destructive',
            });
        }
    };

    const handleAddComplaint = async () => {
        try {
            await axios.post(
                `http://localhost:4000/api/additional-pickup/${selectedPickup._id}/complain`,
                { complaint },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                },
            );
            setIsAddingComplaint(false);
            setComplaint('');
            fetchPickupsAndBins();
            toast({
                title: 'Success',
                description: 'Complaint added successfully.',
            });
        } catch (error) {
            console.error('Error adding complaint:', error);
            toast({
                title: 'Error',
                description: 'Failed to add complaint. Please try again.',
                variant: 'destructive',
            });
        }
    };

    const handlePayment = async (pickupId) => {
        try {
            await axios.put(
                `http://localhost:4000/api/additional-pickup/${pickupId}/pay`,
                {},
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                },
            );
            fetchPickupsAndBins();
            toast({
                title: 'Success',
                description: 'Payment successful.',
            });
        } catch (error) {
            console.error('Error processing payment:', error);
            toast({
                title: 'Error',
                description: 'Failed to process payment. Please try again.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="container mx-auto mt-10 rounded-lg bg-white p-6 shadow-lg">
            <h1 className="mb-6 text-3xl font-bold text-teal-600">Additional Pickups</h1>
            <Dialog open={isAddingPickup} onOpenChange={setIsAddingPickup}>
                <DialogTrigger asChild>
                    <Button className="mb-6 bg-teal-500 hover:bg-teal-700">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Pickup
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Pickup</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="binId">Select Bin</Label>
                            <Select onValueChange={(value) => handleInputChange('binId', value)} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Bin" />
                                </SelectTrigger>
                                <SelectContent>
                                    {bins.map((bin) => (
                                        <SelectItem key={bin._id} value={bin._id}>
                                            {bin.binType} - {bin.location}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="wasteType">Waste Type</Label>
                            <Select onValueChange={(value) => handleInputChange('wasteType', value)} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Waste Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Food">Food</SelectItem>
                                    <SelectItem value="Non Recyclable Waste">Non Recyclable Waste</SelectItem>
                                    <SelectItem value="Recyclable Waste">Recyclable Waste</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Pickup Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline">{format(newPickup.pickupDate, 'PPP')}</Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={newPickup.pickupDate}
                                        onSelect={(date) => handleInputChange('pickupDate', date)}
                                        disabled={(date) => isBefore(date, startOfDay(new Date()))}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={newPickup.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="bg-teal-500 hover:bg-teal-700">
                            Submit
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
            {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse overflow-hidden rounded-lg border border-gray-300 shadow-md">
                        <thead className="bg-teal-500 text-white">
                            <tr>
                                <th className="border border-gray-300 p-4 text-left text-sm md:text-base">Bin Type</th>
                                <th className="border border-gray-300 p-4 text-left text-sm md:text-base">Waste Type</th>
                                <th className="border border-gray-300 p-4 text-left text-sm md:text-base">Pickup Date</th>
                                <th className="border border-gray-300 p-4 text-left text-sm md:text-base">Status</th>
                                <th className="border border-gray-300 p-4 text-left text-sm md:text-base">Payment</th>
                                <th className="border border-gray-300 p-4 text-left text-sm md:text-base">Description</th>
                                <th className="border border-gray-300 p-4 text-left text-sm md:text-base">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pickups.map((pickup) => (
                                <tr
                                    key={pickup._id}
                                    className={`transition duration-200 hover:bg-teal-100 ${pickup.collectorAccepted ? 'bg-green-100' : ''}`}
                                >
                                    <td className="border border-gray-300 p-4 text-sm md:text-base">
                                        {bins.find((bin) => bin._id === pickup.binId)?.binType || 'N/A'}
                                    </td>
                                    <td className="border border-gray-300 p-4 text-sm md:text-base">{pickup.wasteType}</td>
                                    <td className="border border-gray-300 p-4 text-sm md:text-base">
                                        {format(new Date(pickup.pickupDate), 'PPP')}
                                    </td>
                                    <td className="border border-gray-300 p-4 text-sm md:text-base">{pickup.pickupStatus}</td>
                                    <td className="border border-gray-300 p-4 text-sm md:text-base">{pickup.paymentStatus}</td>
                                    <td className="border border-gray-300 p-4 text-sm md:text-base">{pickup.description}</td>
                                    <td className="border border-gray-300 p-4 text-sm md:text-base">
                                        <Button
                                            onClick={() => {
                                                setSelectedPickup(pickup);
                                                setIsAddingComplaint(true);
                                            }}
                                            className="mr-2 bg-yellow-500 hover:bg-yellow-700"
                                        >
                                            <AlertCircle className="mr-2 h-4 w-4" /> Complain
                                        </Button>
                                        {pickup.paymentStatus !== 'Paid' && (
                                            <Button
                                                onClick={() => handlePayment(pickup._id)}
                                                className="bg-green-500 hover:bg-green-700"
                                            >
                                                <CreditCard className="mr-2 h-4 w-4" /> Pay
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <Dialog open={isAddingComplaint} onOpenChange={setIsAddingComplaint}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Complaint</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Label htmlFor="complaint">Complaint</Label>
                        <Input
                            id="complaint"
                            value={complaint}
                            onChange={(e) => setComplaint(e.target.value)}
                            placeholder="Enter your complaint"
                        />
                        <Button onClick={handleAddComplaint} className="bg-teal-500 hover:bg-teal-700">
                            Submit Complaint
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdditionalPickupList;
