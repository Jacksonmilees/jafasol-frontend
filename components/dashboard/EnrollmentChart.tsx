import React from 'react';
import { ENROLLMENT_DATA } from '../../constants';
import { EnrollmentData } from '../../types';


export const EnrollmentChart: React.FC = () => {
    const data: EnrollmentData = ENROLLMENT_DATA[0];
    const forms = ['Form 1', 'Form 2', 'Form 3', 'Form 4'] as const;
    const maxEnrollment = Math.max(...forms.map(form => data[form]));

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm h-full flex flex-col">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Enrollment by Form Level</h3>
            <div className="flex-grow flex items-end justify-around space-x-4">
                {forms.map(form => (
                    <div key={form} className="flex flex-col items-center flex-1">
                        <div className="text-sm font-medium text-slate-700 mb-1">{data[form]}</div>
                        <div className="w-full bg-slate-100 rounded-lg" style={{ height: '150px' }}>
                            <div
                                className="w-full bg-indigo-500 rounded-lg"
                                style={{ height: `${(data[form] / maxEnrollment) * 100}%`, transition: 'height 0.5s ease-out' }}
                                title={`${form}: ${data[form]} students`}
                            ></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">{form}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
