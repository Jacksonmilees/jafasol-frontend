import React, { useState } from 'react';
import { ClassPerformance } from './ClassPerformance';
import { SubjectAnalysis } from './SubjectAnalysis';
import { StudentTrendAnalysis } from './StudentTrendAnalysis';
import { TrendingUpIcon, BookOpenIcon, GraduationCapIcon } from '../icons';

const subNavItems = [
    { id: 'class', label: 'Class Performance', icon: TrendingUpIcon },
    { id: 'subject', label: 'Subject Analysis', icon: BookOpenIcon },
    { id: 'student', label: 'Student Trends', icon: GraduationCapIcon },
];

export const PerformanceAnalytics: React.FC = () => {
    const [activeView, setActiveView] = useState<'class' | 'subject' | 'student'>('class');

    const renderView = () => {
        switch (activeView) {
            case 'class':
                return <ClassPerformance />;
            case 'subject':
                return <SubjectAnalysis />;
            case 'student':
                return <StudentTrendAnalysis />;
            default:
                return <ClassPerformance />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {subNavItems.map(item => {
                         const Icon = item.icon;
                         const isActive = activeView === item.id;
                         return (
                            <button
                                key={item.id}
                                onClick={() => setActiveView(item.id as any)}
                                className={`shrink-0 flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'border-teal-500 text-teal-600'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                }`}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                <Icon className="h-5 w-5" />
                                {item.label}
                            </button>
                         )
                    })}
                </nav>
            </div>
            <div>
                {renderView()}
            </div>
        </div>
    );
};