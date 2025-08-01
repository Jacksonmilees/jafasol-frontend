import React from 'react';

export const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; change?: string; changeType?: 'increase' | 'decrease' }> = ({ icon, title, value, change, changeType }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm">
        <div className="flex justify-between items-start">
            <div className="flex flex-col">
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
                {icon}
            </div>
        </div>
        {change && (
            <p className={`text-xs mt-2 ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                {change} vs last month
            </p>
        )}
    </div>
);