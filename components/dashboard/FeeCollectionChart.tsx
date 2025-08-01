import React from 'react';
import { FeesIcon } from '../icons';

interface FeeCollectionChartProps {
    collected: number;
    outstanding: number;
}

export const FeeCollectionChart: React.FC<FeeCollectionChartProps> = ({ collected, outstanding }) => {
    const total = collected + outstanding;
    const percentage = total > 0 ? Math.round((collected / total) * 100) : 0;

    const size = 120;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm h-full flex flex-col justify-between">
            <div>
                 <div className="flex items-center mb-4">
                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                        <FeesIcon className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Fee Collection</h3>
                        <p className="text-sm text-gray-500">Collected vs. Outstanding</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center my-4">
                <div className="relative">
                    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            stroke="#e5e7eb"
                            strokeWidth={strokeWidth}
                            fill="transparent"
                        />
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            stroke="#22c55e"
                            strokeWidth={strokeWidth}
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-800">{percentage}%</span>
                    </div>
                </div>
            </div>
             <div className="text-sm space-y-2">
                <div className="flex justify-between items-center">
                    <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>Collected</span>
                    <span className="font-medium">{collected.toLocaleString('en-US', { style: 'currency', currency: 'KES' })}</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-gray-200 mr-2"></span>Outstanding</span>
                    <span className="font-medium">{outstanding.toLocaleString('en-US', { style: 'currency', currency: 'KES' })}</span>
                </div>
            </div>
        </div>
    );
};