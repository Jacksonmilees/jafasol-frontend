import React from 'react';
import { PlusIcon, CreditCardIcon, SendIcon } from '../icons';

export const QuickActionsCard: React.FC = () => {
    const actions = [
        { label: 'Add Student', icon: <PlusIcon className="h-5 w-5 text-teal-500" /> },
        { label: 'Record Payment', icon: <CreditCardIcon className="h-5 w-5 text-green-500" /> },
        { label: 'Send Message', icon: <SendIcon className="h-5 w-5 text-blue-500" /> },
    ];

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm h-full flex flex-col justify-between">
            <div>
                <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
                <p className="text-sm text-gray-500 mt-1">Access common tasks with one click.</p>
            </div>
            <div className="mt-4 space-y-3">
                {actions.map(action => (
                    <button 
                        key={action.label}
                        className="w-full flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <div className="p-2 bg-white rounded-md border border-gray-200 mr-4">
                            {action.icon}
                        </div>
                        <span className="font-medium text-gray-700">{action.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};