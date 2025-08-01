import React, { useState } from 'react';
import { MOCK_REPORT_TEMPLATES } from '../constants';
import { ReportCard } from './reports/ReportCard';
import { GeminiBanner } from './reports/GeminiBanner';
import { GeminiModal } from './reports/GeminiModal';
import { User } from '../types';
import { PerformanceAnalytics } from './reports/PerformanceAnalytics';

interface ReportsProps {
    currentUser: User;
}

const Reports: React.FC<ReportsProps> = ({ currentUser }) => {
    const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'Standard Reports' | 'Performance Analytics'>('Performance Analytics');

    const renderContent = () => {
        switch(activeTab) {
            case 'Standard Reports':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {MOCK_REPORT_TEMPLATES.map(template => (
                            <ReportCard key={template.id} template={template} />
                        ))}
                    </div>
                );
            case 'Performance Analytics':
                return <PerformanceAnalytics />;
            default:
                return null;
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2>
                <p className="text-gray-500 mt-1">Generate insightful reports to drive school performance.</p>
            </div>

            <GeminiBanner onAskGemini={() => setIsGeminiModalOpen(true)} />

            <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm">
                 <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6 px-6" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('Standard Reports')}
                            className={`shrink-0 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                                activeTab === 'Standard Reports'
                                    ? 'border-teal-500 text-teal-600'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            }`}
                        >
                            Standard Reports
                        </button>
                        <button
                            onClick={() => setActiveTab('Performance Analytics')}
                            className={`shrink-0 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                                activeTab === 'Performance Analytics'
                                    ? 'border-teal-500 text-teal-600'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            }`}
                        >
                            Performance Analytics
                        </button>
                    </nav>
                </div>
                <div className="p-4 md:p-6">
                    {renderContent()}
                </div>
            </div>

            <GeminiModal isOpen={isGeminiModalOpen} onClose={() => setIsGeminiModalOpen(false)} />
        </div>
    );
};

export default Reports;