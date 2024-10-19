import React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, AlertCircle, CreditCard, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const PickupCard = ({ pickup, onReportIssue, onPayment }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Scheduled':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'In Progress':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'Completed':
                return 'bg-green-100 text-green-800 border-green-300';
            default:
                return 'bg-red-100 text-red-800 border-red-300';
        }
    };

    const getWasteTypeIcon = (wasteType) => {
        switch (wasteType) {
            case 'Recyclable Waste':
                return '♻️';
            case 'Non Recyclable Waste':
                return '🗑️';
            case 'Food':
                return '🍽️';
            default:
                return '📦';
        }
    };

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="p-4">
                <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-xl">{getWasteTypeIcon(pickup.wasteType)}</span>
                        <h3 className="text-sm font-bold text-gray-900 underline">{pickup.wasteType}</h3>
                    </div>
                    <Badge variant="outline" className={getStatusColor(pickup.pickupStatus)}>
                        {pickup.pickupStatus}
                    </Badge>
                </div>
                <div className="mb-3 flex items-center rounded-lg border p-2 text-sm text-gray-600">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(new Date(pickup.pickupDate), 'PPP')}
                </div>
                <div className="space-y-1 text-sm">
                    <p>
                        <span className="font-medium">Payment:</span> {pickup.paymentStatus}
                    </p>
                    <p className="line-clamp-2">
                        <span className="font-medium">Description:</span> {pickup.description}
                    </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                        onClick={() => onReportIssue(pickup)}
                        className="flex-1 items-center justify-center bg-yellow-500 text-white transition-all duration-300 hover:bg-yellow-600"
                        size="sm"
                    >
                        <AlertCircle className="mr-2 h-4 w-4" /> Report Issue
                    </Button>
                    {pickup.paymentStatus !== 'Paid' && (
                        <Button
                            onClick={() => onPayment(pickup._id)}
                            className="flex-1 items-center justify-center bg-green-500 text-white transition-all duration-300 hover:bg-green-600"
                            size="sm"
                        >
                            <CreditCard className="mr-2 h-4 w-4" /> Pay Now
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PickupCard;
