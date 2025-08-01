import React from 'react';
import { Route } from '../../types';
import { MoreHorizontalIcon } from '../icons';

export const RouteRow: React.FC<{ route: Route }> = ({ route }) => {
    return (
        <tr className="border-b border-slate-200 hover:bg-slate-50">
            <td className="py-3 px-6">
                 <p className="font-semibold text-slate-800">{route.name}</p>
            </td>
            <td className="py-3 px-6 text-slate-600">{route.stops} stops</td>
            <td className="py-3 px-6 text-slate-600">{route.fare.toLocaleString('en-US', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 })}</td>
            <td className="py-3 px-6 text-right">
                <button className="p-2 rounded-md hover:bg-slate-200 transition-colors" aria-label={`Actions for ${route.name}`}>
                    <MoreHorizontalIcon className="h-5 w-5 text-slate-500" />
                </button>
            </td>
        </tr>
    );
};
