import React from 'react';
import { ACADEMIC_PERFORMANCE_DATA } from '../../constants';
import { TrendingUpIcon } from '../icons';

export const AcademicPerformanceChart: React.FC = () => {
    const data = ACADEMIC_PERFORMANCE_DATA;
    const width = 500;
    const height = 250;
    const padding = 40;
    const yMax = 100;
    const yMin = Math.min(...data.map(d => d['Average Score'])) - 10;

    const getX = (index: number) => padding + (index * (width - 2 * padding)) / (data.length - 1);
    const getY = (value: number) => height - padding - ((value - yMin) / (yMax - yMin)) * (height - 2 * padding);
    
    const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d['Average Score'])}`).join(' ');

    const yAxisLabels = [yMin, yMin + (yMax-yMin)/2, yMax].map(val => Math.round(val));

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm h-full flex flex-col">
            <div className="flex items-center mb-4">
                <div className="p-2 bg-gray-100 rounded-lg mr-3">
                    <TrendingUpIcon className="h-5 w-5 text-teal-500" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Academic Performance Trend</h3>
                    <p className="text-sm text-gray-500">Average score across recent exams</p>
                </div>
            </div>
            <div className="flex-grow">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" aria-label="Academic Performance Chart">
                    {/* Y-axis grid lines and labels */}
                    {yAxisLabels.map(label => (
                        <g key={label}>
                           <line 
                                x1={padding} y1={getY(label)} 
                                x2={width - padding} y2={getY(label)} 
                                stroke="#e5e7eb" 
                                strokeWidth="1"
                                strokeDasharray="2,3"
                            />
                            <text 
                                x={padding - 8} 
                                y={getY(label) + 4} 
                                textAnchor="end" 
                                className="text-[10px] fill-gray-500"
                            >
                                {label}%
                            </text>
                        </g>
                    ))}
                    {/* X-axis labels */}
                    {data.map((d, i) => (
                        <text 
                            key={d.name} 
                            x={getX(i)} 
                            y={height - padding + 15} 
                            textAnchor="middle" 
                            className="text-[10px] fill-gray-500"
                        >
                            {d.name}
                        </text>
                    ))}
                    {/* Line */}
                    <path d={linePath} fill="none" stroke="#0d9488" strokeWidth="2" />
                    {/* Points */}
                    {data.map((d, i) => (
                         <circle 
                            key={i} 
                            cx={getX(i)} 
                            cy={getY(d['Average Score'])} 
                            r="4" 
                            fill="#fff" 
                            stroke="#0d9488" 
                            strokeWidth="2" 
                        >
                            <title>{`${d.name}: ${d['Average Score']}%`}</title>
                         </circle>
                    ))}
                </svg>
            </div>
        </div>
    );
};