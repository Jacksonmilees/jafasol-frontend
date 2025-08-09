import React, { useState } from 'react';
import { MoreHorizontalIcon, PencilIcon, TrashIcon } from '../icons';

interface Route {
  _id: string;
  routeName: string;
  startPoint: string;
  endPoint: string;
  stops: string[];
  estimatedTime: string;
  vehicleId?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface RouteRowProps {
  route: Route;
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
}

export const RouteRow: React.FC<RouteRowProps> = ({ route, onUpdate, onDelete }) => {
    const [showActions, setShowActions] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800';
            case 'Inactive':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-slate-100 text-slate-800';
        }
    };

    return (
        <tr className="border-b border-slate-200 hover:bg-slate-50">
            <td className="py-3 px-6">
                <p className="font-semibold text-slate-800">{route.routeName}</p>
                <p className="text-xs text-slate-500">{route.startPoint} → {route.endPoint}</p>
            </td>
            <td className="py-3 px-6 text-slate-600">
                {route.stops.length} stops
                {route.stops.length > 0 && (
                    <p className="text-xs text-slate-500 mt-1">
                        {route.stops.slice(0, 2).join(', ')}
                        {route.stops.length > 2 && ` +${route.stops.length - 2} more`}
                    </p>
                )}
            </td>
            <td className="py-3 px-6 text-slate-600">
                {route.estimatedTime}
            </td>
            <td className="py-3 px-6">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(route.status)}`}>
                    {route.status}
                </span>
            </td>
            <td className="py-3 px-6 text-right relative">
                <button 
                    className="p-2 rounded-md hover:bg-slate-200 transition-colors" 
                    aria-label={`Actions for ${route.routeName}`}
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
                                    if (window.confirm(`Are you sure you want to delete route ${route.routeName}?`)) {
                                        onDelete(route._id);
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
