import React from 'react';
import { Vehicle } from '../../types';
import { MoreHorizontalIcon } from '../icons';

export const VehicleRow: React.FC<{ vehicle: Vehicle }> = ({ vehicle }) => {
    return (
        <tr className="border-b border-slate-200 hover:bg-slate-50">
            <td className="py-3 px-6">
                 <p className="font-semibold text-slate-800">{vehicle.registrationNumber}</p>
                 <p className="text-xs text-slate-500">Capacity: {vehicle.capacity}</p>
            </td>
            <td className="py-3 px-6 text-slate-600">{vehicle.driverName}</td>
            <td className="py-3 px-6 text-slate-600">{vehicle.routeName}</td>
            <td className="py-3 px-6 text-right">
                <button className="p-2 rounded-md hover:bg-slate-200 transition-colors" aria-label={`Actions for ${vehicle.registrationNumber}`}>
                    <MoreHorizontalIcon className="h-5 w-5 text-slate-500" />
                </button>
            </td>
        </tr>
    );
};
