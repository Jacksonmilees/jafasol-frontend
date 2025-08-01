import React from 'react';
import { ATTENDANCE_TREND_DATA } from '../../constants';
import { AttendanceIcon } from '../icons';

export const AttendanceTrendChart: React.FC = () => {
    const data = ATTENDANCE_TREND_DATA;
    const width = 500;
    const height = 250;
    const padding = 40;
    const yMax = 100;
    let yMin = Math.min(...data.map(d => d.Attendance)) - 10;
    
    if (yMin < 0) yMin = 0;

    const getX = (index: number) => padding + (index * (width - 2 * padding)) / (data.length - 1);
    const getY = (value: number) => height - padding - ((value - yMin) / (yMax - yMin)) * (height - 2 * padding);
    
    const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.Attendance)}`).join(' ');
    const areaPath = `${linePath} L ${getX(data.length - 1)} ${height - padding} L ${getX(0)} ${height - padding} Z`;
    
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm h-full flex flex-col">
            <div className="flex items-center mb-4">
                 <div className="p-2 bg-gray-100 rounded-lg mr-3">
                    <AttendanceIcon className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Weekly Attendance</h3>
                     <p className="text-sm text-gray-500">Percentage of students present</p>
                </div>
            </div>
            <div className="flex-grow">
                 <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" aria-label="Attendance Trend Chart">
                    <defs>
                        <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#0d9488" stopOpacity="0.3"/>
                            <stop offset="100%" stopColor="#0d9488" stopOpacity="0"/>
                        </linearGradient>
                    </defs>
                    {/* Y-axis labels */}
                    {[yMin, yMax].map(label => (
                        <g key={label}>
                             <text x={padding - 8} y={getY(label) + 4} textAnchor="end" className="text-[10px] fill-gray-500">
                                {Math.round(label)}%
                            </text>
                        </g>
                    ))}
                     {/* X-axis labels */}
                    {data.map((d, i) => (
                        <text key={i} x={getX(i)} y={height - padding + 15} textAnchor="middle" className="text-[10px] fill-gray-500">
                            {d.name}
                        </text>
                    ))}
                    {/* Area */}
                    <path d={areaPath} fill="url(#areaGradient)" />
                    {/* Line */}
                    <path d={linePath} fill="none" stroke="#0d9488" strokeWidth="2" />
                 </svg>
            </div>
        </div>
    );
};