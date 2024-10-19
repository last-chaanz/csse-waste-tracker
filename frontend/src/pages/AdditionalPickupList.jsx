import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, isBefore, startOfDay } from 'date-fns';
import { PlusCircle, Loader2, AlertCircle, CreditCard, Calendar as CalendarIcon, Truck, CheckCircle, Clock } from 'lucide-react';
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
import { useNavigate } from 'react-router-dom';
import NavBar from './../components/common/Navbar';
import Footer from '@/components/common/Footer';
import PickupCard from '@/components/PickupCard';

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

    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate('/user/dashboard');
    };

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

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Scheduled':
                return <Clock className="h-6 w-6 text-blue-500" />;
            case 'In Progress':
                return <Truck className="h-6 w-6 text-yellow-500" />;
            case 'Completed':
                return <CheckCircle className="h-6 w-6 text-green-500" />;
            default:
                return <AlertCircle className="h-6 w-6 text-red-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'In Progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'Completed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-red-100 text-red-800';
        }
    };

    return (
        <>
            <NavBar />

            <div className="">
                <div className="rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl">
                    <div className="px-6 py-8 sm:px-10">
                        <h1 className="mb-6 text-center font-poppins text-3xl font-extrabold text-sky-900 underline">
                            SCHEDULED ADDITIONAL PICKUPS
                        </h1>
                        <div className="mb-8 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                            <Dialog open={isAddingPickup} onOpenChange={setIsAddingPickup}>
                                <DialogTrigger asChild>
                                    <Button className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white transition-all duration-300 hover:from-gray-900 hover:to-gray-800 hover:shadow-lg sm:w-auto">
                                        <PlusCircle className="mr-2 h-5 w-5" /> Schedule New Pickup
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
                                className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white transition-all duration-300 hover:from-gray-700 hover:to-gray-600 hover:shadow-lg sm:w-auto"
                            >
                                {showCompleted ? 'Show Active Pickups' : 'Show Completed Pickups'}
                            </Button>
                        </div>
                        {isLoading ? (
                            <div className="flex h-64 items-center justify-center">
                                <Loader2 className="h-12 w-12 animate-spin text-gray-900" />
                            </div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredPickups.map((pickup) => (
                                    <PickupCard
                                        key={pickup._id}
                                        pickup={pickup}
                                        bin={bins.find((bin) => bin._id === pickup.binId)}
                                        onReportIssue={(pickup) => {
                                            setSelectedPickup(pickup);
                                            setIsAddingComplaint(true);
                                        }}
                                        onPayment={handlePayment}
                                        showCompleted={showCompleted}
                                    />
                                ))}
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

            <Footer />
        </>
    );
};

export default AdditionalPickupList;
