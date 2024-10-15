import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Trash2, MapPin, Bell, DollarSign } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const Pickup = () => {
    const [date, setDate] = useState(new Date());

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-8">
            <div className="mx-auto max-w-6xl">
                <h1 className="mb-8 text-4xl font-bold text-indigo-800">EcoCollect: Smart Waste Pickup</h1>
                <Tabs defaultValue="schedule" className="w-full">
                    <TabsList className="mb-8 grid w-full grid-cols-4">
                        <TabsTrigger value="schedule" className="text-lg">
                            Schedule Pickup
                        </TabsTrigger>
                        <TabsTrigger value="history" className="text-lg">
                            Pickup History
                        </TabsTrigger>
                        <TabsTrigger value="map" className="text-lg">
                            Bin Locations
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="text-lg">
                            Notifications
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="schedule">
                        <Card className="bg-white/80 shadow-xl backdrop-blur-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl text-indigo-700">Schedule a Pickup</CardTitle>
                                <CardDescription>Fill in the details to schedule a new waste pickup.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="wasteType" className="text-indigo-600">
                                        Waste Type
                                    </Label>
                                    <Select>
                                        <SelectTrigger id="wasteType" className="w-full">
                                            <SelectValue placeholder="Select waste type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="general">General Waste</SelectItem>
                                            <SelectItem value="recyclable">Recyclable</SelectItem>
                                            <SelectItem value="organic">Organic</SelectItem>
                                            <SelectItem value="hazardous">Hazardous</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-indigo-600">
                                        Description
                                    </Label>
                                    <Input id="description" placeholder="Additional details about the waste" className="w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-indigo-600">Collection Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start text-left font-normal"
                                                id="date"
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? format(date, 'PPP') : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700">Schedule Pickup</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="history">
                        <Card className="bg-white/80 shadow-xl backdrop-blur-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl text-indigo-700">Pickup History</CardTitle>
                                <CardDescription>View your recent pickup requests and their statuses.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((pickup) => (
                                        <Card key={pickup} className="bg-white">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-lg text-indigo-600">Pickup #{pickup}</CardTitle>
                                                <CardDescription>{format(new Date(), 'PPP')}</CardDescription>
                                            </CardHeader>
                                            <CardContent className="pb-2">
                                                <p>
                                                    <strong className="text-indigo-600">Waste Type:</strong> General Waste
                                                </p>
                                                <p>
                                                    <strong className="text-indigo-600">Status:</strong>
                                                    <span className="ml-2 rounded-full bg-yellow-200 px-2 py-1 text-xs font-semibold text-yellow-800">
                                                        Pending
                                                    </span>
                                                </p>
                                            </CardContent>
                                            <CardFooter>
                                                <Button variant="outline" className="w-full text-red-500 hover:bg-red-50">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Cancel Pickup
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="map">
                        <Card className="bg-white/80 shadow-xl backdrop-blur-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl text-indigo-700">Bin Locations</CardTitle>
                                <CardDescription>Find the nearest waste bins in your area.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex h-64 items-center justify-center bg-gray-300">
                                    <MapPin className="h-12 w-12 text-indigo-600" />
                                    <p className="ml-4 text-lg text-indigo-800">Map Component Placeholder</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications">
                        <Card className="bg-white/80 shadow-xl backdrop-blur-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl text-indigo-700">Notifications</CardTitle>
                                <CardDescription>
                                    Stay updated with your pickup schedules and service announcements.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((notification) => (
                                        <Card key={notification} className="bg-white">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="flex items-center text-lg">
                                                    <Bell className="mr-2 h-5 w-5 text-indigo-600" />
                                                    Upcoming Pickup Reminder
                                                </CardTitle>
                                                <CardDescription>{format(new Date(), 'PPP')}</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p>
                                                    Your scheduled pickup is tomorrow. Please ensure your waste is properly sorted
                                                    and ready for collection.
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <Card className="mt-8 bg-white/80 shadow-xl backdrop-blur-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl text-indigo-700">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                            <Button className="flex h-24 flex-col items-center justify-center bg-green-100 text-green-700 hover:bg-green-200">
                                <DollarSign className="mb-2 h-8 w-8" />
                                Make Payment
                            </Button>
                            <Button className="flex h-24 flex-col items-center justify-center bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
                                <Bell className="mb-2 h-8 w-8" />
                                Set Reminders
                            </Button>
                            <Button className="flex h-24 flex-col items-center justify-center bg-red-100 text-red-700 hover:bg-red-200">
                                <Trash2 className="mb-2 h-8 w-8" />
                                Report Issue
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Pickup;
