import React, { useMemo } from 'react';
import { Student } from '../../types';
import { MOCK_EXAMS, MOCK_SUBJECTS } from '../../constants';

interface StudentPerformanceChartProps {
    student: Student;
}

export const StudentPerformanceChart: React.FC<StudentPerformanceChartProps> = ({ student }) => {

    const allStudentSubjectIds = useMemo(() => {
        const subjectIds = new Set<string>();
        if (student.examResults) {
            Object.values(student.examResults).forEach(record => {
                Object.keys(record.results).forEach(id => subjectIds.add(id));
            });
        }
        return Array.from(subjectIds);
    }, [student]);

    const examSubjects = useMemo(() => MOCK_SUBJECTS.filter(s => allStudentSubjectIds.includes(s.id)), [allStudentSubjectIds]);
    
    const chartData = useMemo(() => {
        if (!student.examResults) return [];
        
        return Object.entries(student.examResults)
            .map(([examId, record]) => {
                const exam = MOCK_EXAMS.find(e => e.id === examId);
                if (!exam) return null;

                let dataPoint: {[key: string]: any} = { name: exam.type, date: exam.startDate };
                examSubjects.forEach(subject => {
                    const score = record.results[subject.id];
                    if (typeof score === 'number') {
                        dataPoint[subject.name] = score;
                    }
                });
                return dataPoint;
            })
            .filter((d): d is {[key: string]: any} => d !== null)
            .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [student, examSubjects]);

    if (chartData.length < 2) {
        return (
             <div className="flex items-center justify-center h-48 text-sm text-gray-500">
                Not enough exam data to display a trend for this student.
             </div>
        )
    };

    const colors = ["#0d9488", "#10b981", "#ef4444", "#f59e0b", "#3b82f6", "#ec4899"];
    const subjectsInChart = examSubjects.map(s => s.name).filter(name => chartData.some(d => d[name] !== undefined));

    const width = 400;
    const height = 180;
    const padding = { top: 10, right: 10, bottom: 20, left: 30 };

    const getX = (index: number) => padding.left + (index * (width - padding.left - padding.right)) / (chartData.length - 1);
    const getY = (value: number) => height - padding.bottom - ((value / 100) * (height - padding.top - padding.bottom));

    return (
        <div>
            <h4 className="font-semibold text-gray-800 mb-2">Performance Trend</h4>
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
                {/* Y-axis grid lines and labels */}
                {[0, 25, 50, 75, 100].map(label => (
                    <g key={label}>
                        <line x1={padding.left} y1={getY(label)} x2={width - padding.right} y2={getY(label)} stroke="#e5e7eb" strokeWidth="1" />
                        <text x={padding.left - 5} y={getY(label) + 4} textAnchor="end" className="text-[9px] fill-gray-500">{label}%</text>
                    </g>
                ))}
                {/* X-axis labels */}
                {chartData.map((d, i) => (
                    <text key={d.name} x={getX(i)} y={height - padding.bottom + 12} textAnchor="middle" className="text-[9px] fill-gray-500">{d.name}</text>
                ))}
                {/* Lines and points */}
                {subjectsInChart.map((subject, subjectIndex) => {
                    const linePath = chartData
                        .map((d, i) => {
                             if(d[subject] === undefined) return null;
                             // Find previous point with data for this subject to draw line from
                             let lastValidIndex = -1;
                             for (let j = i - 1; j >= 0; j--) {
                                if (chartData[j][subject] !== undefined) {
                                    lastValidIndex = j;
                                    break;
                                }
                             }
                             const command = lastValidIndex === i - 1 ? 'L' : 'M';
                             return `${command} ${getX(i)} ${getY(d[subject]!)}`;
                        })
                        .filter(Boolean)
                        .join(' ');
                    
                    return (
                        <g key={subject}>
                            <path d={linePath} fill="none" stroke={colors[subjectIndex % colors.length]} strokeWidth="1.5" />
                            {chartData.map((d, i) => d[subject] !== undefined && (
                                <circle key={i} cx={getX(i)} cy={getY(d[subject]!)} r="2.5" fill={colors[subjectIndex % colors.length]}>
                                    <title>{`${d.name} - ${subject}: ${d[subject]}%`}</title>
                                </circle>
                            ))}
                        </g>
                    )
                })}
            </svg>
             <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
                {subjectsInChart.map((subject, subjectIndex) => (
                    <div key={subject} className="flex items-center">
                        <span className="h-2 w-2 rounded-full mr-1.5" style={{ backgroundColor: colors[subjectIndex % colors.length] }}></span>
                        <span className="text-xs text-gray-600">{subject}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};