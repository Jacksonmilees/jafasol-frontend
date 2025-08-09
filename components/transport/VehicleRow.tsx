import React, { useState } from 'react';
import { MoreHorizontalIcon, PencilIcon, TrashIcon } from '../icons';

interface Vehicle {
  _id: string;
  vehicleNumber: string;
  vehicleType: string;
  capacity: number;
  driverName: string;
  driverPhone: string;
  status: string;
  route?: string;
  createdAt: string;
  updatedAt: string;
}

interface VehicleRowProps {
  vehicle: Vehicle;
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
}

export const VehicleRow: React.FC<VehicleRowProps> = ({ vehicle, onUpdate, onDelete }) => {
    const [showActions, setShowActions] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800';
            case 'Inactive':
                return 'bg-red-100 text-red-800';
            case 'Maintenance':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-slate-100 text-slate-800';
        }
    };

    return (
        <tr className="border-b border-slate-200 hover:bg-slate-50">
            <td className="py-3 px-6">
                <p className="font-semibold text-slate-800">{vehicle.vehicleNumber}</p>
                <p className="text-xs text-slate-500">Type: {vehicle.vehicleType} | Capacity: {vehicle.capacity}</p>
            </td>
            <td className="py-3 px-6">
                <p className="text-slate-600">{vehicle.driverName}</p>
                <p className="text-xs text-slate-500">{vehicle.driverPhone}</p>
            </td>
            <td className="py-3 px-6 text-slate-600">
                {vehicle.route || 'Not assigned'}
            </td>
            <td className="py-3 px-6">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                    {vehicle.status}
                </span>
            </td>
            <td className="py-3 px-6 text-right relative">
                <button 
                    className="p-2 rounded-md hover:bg-slate-200 transition-colors" 
                    aria-label={`Actions for ${vehicle.vehicleNumber}`}
                    onClick={() => setShowActions(!showActions)}
                >
                    <MoreHorizontalIcon className="h-5 w-5 text-slate-500" />
                </button>
                
                {showActions && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-slate-200">
                        <div className="py-1">
                            <button
                                onClick={() => {
                                    setShowActions(false);
                                    // TODO: Open edit modal
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                            >
                                <PencilIcon className="h-4 w-4 mr-2" />
                                Edit
                            </button>
                            <button
                                onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete vehicle ${vehicle.vehicleNumber}?`)) {
                                        onDelete(vehicle._id);
                                    }
                                    setShowActions(false);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                                <TrashIcon className="h-4 w-4 mr-2" />
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </td>
        </tr>
    );
};
