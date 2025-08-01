
import React from 'react';

interface FeeStatCardProps {
    title: string;
    amount: number;
    icon: React.ReactNode;
}

export const FeeStatCard: React.FC<FeeStatCardProps> = ({ title, amount, icon }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
        <div className="flex justify-between items-start">
            <div className="flex flex-col">
                <p className="text-sm text-slate-500">{title}</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                    {amount.toLocaleString('en-US', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 })}
                </p>
            </div>
            <div className="p-3 bg-slate-100 rounded-lg">
                {icon}
            </div>
        </div>
    </div>
);