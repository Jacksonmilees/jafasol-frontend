import React from 'react';
import { TimetableCellData } from '../../types';

export const TimetableCell: React.FC<{ entry: TimetableCellData | null, isPortal?: boolean }> = ({ entry, isPortal }) => {
    if (isPortal) {
         if (!entry) {
            return <td className="py-2 px-1 border-b border-gray-100 text-center text-gray-300 text-xs">-</td>;
        }
        return (
            <td className="py-2 px-1 border-b border-gray-100 text-center">
                <p className="font-semibold text-xs text-teal-700">{entry.line1}</p>
                <p className="text-[10px] text-gray-400">{entry.line2}</p>
            </td>
        )
    }

    if (!entry) {
        return <td className="py-3 px-2 border border-gray-200 text-center text-gray-400 text-xs">Break</td>;
    }
    return (
        <td className="py-3 px-3 border border-gray-200 text-center hover:bg-teal-50 transition-colors">
            <p className="font-semibold text-sm text-teal-800">{entry.line1}</p>
            <p className="text-xs text-gray-500">{entry.line2}</p>
        </td>
    )
};