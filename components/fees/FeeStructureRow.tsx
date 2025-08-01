
import React from 'react';
import { FeeStructure } from '../../types';
import { MoreHorizontalIcon } from '../icons';

export const FeeStructureRow: React.FC<{ feeStructure: FeeStructure }> = ({ feeStructure }) => {
    return (
        <tr className="border-b border-slate-200 hover:bg-slate-50">
            <td className="py-3 px-6 font-semibold text-slate-800">{feeStructure.formLevel}</td>
            <td className="py-3 px-6 text-slate-600">{feeStructure.type}</td>
            <td className="py-3 px-6 text-slate-600">{feeStructure.amount.toLocaleString('en-US', { style: 'currency', currency: 'KES' })}</td>
            <td className="py-3 px-6 text-slate-600">{feeStructure.term}</td>
            <td className="py-3 px-6 text-slate-600">{feeStructure.dueDate}</td>
            <td className="py-3 px-6 text-right">
                <button className="p-2 rounded-md hover:bg-slate-200 transition-colors" aria-label={`Actions for ${feeStructure.type}`}>
                    <MoreHorizontalIcon className="h-5 w-5 text-slate-500" />
                </button>
            </td>
        </tr>
    );
};