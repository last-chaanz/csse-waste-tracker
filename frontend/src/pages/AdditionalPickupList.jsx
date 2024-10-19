import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, isBefore, startOfDay } from 'date-fns';
import { PlusCircle, Loader2, AlertCircle, CreditCard, Calendar as CalendarIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { jwtDecode } from 'jwt-decode';
import { cn } from '@/lib/utils';

const AdditionalPickupList = () => {
    const [pickups, setPickups] = useState([]);
    const [showCompleted, setShowCompleted] = useState(false);
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

    const filteredPickups = pickups.filter((pickup) =>
        showCompleted ? pickup.pickupStatus === 'Completed' : pickup.pickupStatus !== 'Completed',
    );

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
        <div className="container mx-auto mt-10 px-4 sm:px-6 lg:px-8">
            <div className="rounded-lg bg-white shadow-xl">
                <div className="px-6 py-8 sm:px-10">
                    <h1 className="mb-6 text-3xl font-extrabold text-teal-600">Additional Pickups</h1>
                    <div className="mb-8 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                        <Dialog open={isAddingPickup} onOpenChange={setIsAddingPickup}>
                            <DialogTrigger asChild>
                                <Button className="w-full bg-teal-500 hover:bg-teal-600 sm:w-auto">
                                    <PlusCircle className="mr-2 h-5 w-5" /> Add New Pickup
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold text-teal-600">Add New Pickup</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="binId" className="text-sm font-medium text-gray-700">
                                            Select Bin
                                        </Label>
                                        <Select onValueChange={(value) => handleInputChange('binId', value)} required>
                                            <SelectTrigger className="w-full">
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
                                        <Label htmlFor="wasteType" className="text-sm font-medium text-gray-700">
                                            Waste Type
                                        </Label>
                                        <Select onValueChange={(value) => handleInputChange('wasteType', value)} required>
                                            <SelectTrigger className="w-full">
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
                                        <Label className="text-sm font-medium text-gray-700">Pickup Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={'outline'}
                                                    className={cn(
                                                        'w-full justify-start text-left font-normal',
                                                        !newPickup.pickupDate && 'text-muted-foreground',
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {newPickup.pickupDate ? (
                                                        format(newPickup.pickupDate, 'PPP')
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                </Button>
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
                                        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                                            Description
                                        </Label>
                                        <Input
                                            id="description"
                                            value={newPickup.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            className="w-full"
                                        />
                                    </div>
                                    <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600">
                                        Submit
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <Button
                            onClick={() => setShowCompleted(!showCompleted)}
                            className="w-full bg-blue-500 hover:bg-blue-600 sm:w-auto"
                        >
                            {showCompleted ? 'Show Active Pickups' : 'Show Completed Pickups'}
                        </Button>
                    </div>
                    {isLoading ? (
                        <div className="flex h-64 items-center justify-center">
                            <Loader2 className="h-12 w-12 animate-spin text-teal-500" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-teal-500">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white"
                                        >
                                            Bin Type
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white"
                                        >
                                            Waste Type
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white"
                                        >
                                            Pickup Date
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white"
                                        >
                                            Status
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white"
                                        >
                                            Payment
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white"
                                        >
                                            Description
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white"
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {filteredPickups.map((pickup) => (
                                        <tr
                                            key={pickup._id}
                                            className={cn(
                                                'transition duration-200 hover:bg-teal-50',
                                                pickup.collectorAccepted && 'bg-green-50',
                                            )}
                                        >
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                {bins.find((bin) => bin._id === pickup.binId)?.binType || 'N/A'}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                {pickup.wasteType}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                {format(new Date(pickup.pickupDate), 'PPP')}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                {pickup.pickupStatus}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                {pickup.paymentStatus}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{pickup.description}</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                                {showCompleted ? (
                                                    <Button disabled className="cursor-not-allowed bg-gray-300 text-gray-600">
                                                        Done
                                                    </Button>
                                                ) : (
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            onClick={() => {
                                                                setSelectedPickup(pickup);
                                                                setIsAddingComplaint(true);
                                                            }}
                                                            className="bg-yellow-500 hover:bg-yellow-600"
                                                        >
                                                            <AlertCircle className="mr-2 h-4 w-4" /> Complain
                                                        </Button>
                                                        {pickup.paymentStatus !== 'Paid' && (
                                                            <Button
                                                                onClick={() => handlePayment(pickup._id)}
                                                                className="bg-green-500 hover:bg-green-600"
                                                            >
                                                                <CreditCard className="mr-2 h-4 w-4" /> Pay
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={isAddingComplaint} onOpenChange={setIsAddingComplaint}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-teal-600">Add Complaint</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="complaint" className="text-sm font-medium text-gray-700">
                                Complaint
                            </Label>
                            <Input
                                id="complaint"
                                value={complaint}
                                onChange={(e) => setComplaint(e.target.value)}
                                placeholder="Enter your complaint"
                                className="w-full"
                            />
                        </div>
                        <Button onClick={handleAddComplaint} className="w-full bg-teal-500 hover:bg-teal-600">
                            Submit Complaint
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdditionalPickupList;
