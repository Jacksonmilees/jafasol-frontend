
import React, { useState } from 'react';
import { FeeStructure } from '../../types';
import { XIcon, DollarSignIcon } from '../icons';

interface AddFeeStructureModalProps {
    onClose: () => void;
    onAdd: (data: Omit<FeeStructure, 'id'>) => void;
}

export const AddFeeStructureModal: React.FC<AddFeeStructureModalProps> = ({ onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        formLevel: 'All Forms',
        amount: '',
        type: 'Tuition' as FeeStructure['type'],
        term: 'Annual',
        dueDate: new Date().toISOString().split('T')[0]
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const amountNumber = parseFloat(formData.amount);
        if (isNaN(amountNumber) || amountNumber <= 0) {
            alert("Please enter a valid amount.");
            return;
        }
        onAdd({ ...formData, amount: amountNumber });
    };
    
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div className="flex items-center">
                        <DollarSignIcon className="h-6 w-6 text-indigo-600 mr-3" />
                        <h2 className="text-xl font-semibold text-slate-800">Add New Fee Item</h2>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-100" aria-label="Close">
                        <XIcon className="h-6 w-6 text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div>
                        <label htmlFor="formLevel" className="block text-sm font-medium text-slate-700 mb-1">Form Level</label>
                        <select name="formLevel" id="formLevel" value={formData.formLevel} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                            <option>All Forms</option>
                            <option>Form 1</option>
                            <option>Form 2</option>
                            <option>Form 3</option>
                            <option>Form 4</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1">Fee Type</label>
                        <select name="type" id="type" value={formData.type} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                            <option>Tuition</option>
                            <option>Boarding</option>
                            <option>Transport</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">Amount (KES)</label>
                        <input type="number" name="amount" id="amount" value={formData.amount} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="term" className="block text-sm font-medium text-slate-700 mb-1">Term</label>
                            <select name="term" id="term" value={formData.term} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                                <option>Annual</option>
                                <option>Term 1</option>
                                <option>Term 2</option>
                                <option>Term 3</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                            <input type="date" name="dueDate" id="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 font-medium rounded-lg hover:bg-slate-100 transition">
                        Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                        Save Item
                    </button>
                </div>
            </form>
        </div>
    );
};
