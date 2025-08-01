
import React from 'react';
import { FeeStructure } from '../../types';
import { PlusIcon } from '../icons';
import { FeeStructureRow } from './FeeStructureRow';

interface FeeStructureListProps {
    feeStructures: FeeStructure[];
    onAddFeeStructure: () => void;
}

export const FeeStructureList: React.FC<FeeStructureListProps> = ({ feeStructures, onAddFeeStructure }) => {
    return (
        <>
            <div className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">Fee Structure Items</h3>
                    <p className="text-sm text-slate-500 mt-1">Manage all billable items like tuition, boarding, etc.</p>
                </div>
                <button 
                    onClick={onAddFeeStructure}
                    className="flex items-center justify-center mt-4 md:mt-0 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition whitespace-nowrap">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Fee Item
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                        <tr>
                            <th scope="col" className="py-3 px-6 font-medium">Form Level</th>
                            <th scope="col" className="py-3 px-6 font-medium">Type</th>
                            <th scope="col" className="py-3 px-6 font-medium">Amount (KES)</th>
                            <th scope="col" className="py-3 px-6 font-medium">Term</th>
                            <th scope="col" className="py-3 px-6 font-medium">Due Date</th>
                            <th scope="col" className="py-3 px-6 font-medium"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {feeStructures.map(item => (
                            <FeeStructureRow key={item.id} feeStructure={item} />
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};
