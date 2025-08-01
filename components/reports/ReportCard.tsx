
import React from 'react';
import { ReportTemplate } from '../../types';
import { FileTextIcon, TrendingUpIcon, DollarSignIcon, ClipboardListIcon, BookOpenIcon, UsersIcon } from '../icons';

// Create a dedicated component for rendering the icon
const ReportIcon: React.FC<{ iconName: string }> = ({ iconName }) => {
    const iconProps = { className: "h-6 w-6 text-indigo-500" };
    switch (iconName) {
        case 'FileTextIcon': return <FileTextIcon {...iconProps} />;
        case 'TrendingUpIcon': return <TrendingUpIcon {...iconProps} />;
        case 'DollarSignIcon': return <DollarSignIcon {...iconProps} />;
        case 'ClipboardListIcon': return <ClipboardListIcon {...iconProps} />;
        case 'BookOpenIcon': return <BookOpenIcon {...iconProps} />;
        case 'UsersIcon': return <UsersIcon {...iconProps} />;
        default: return null;
    }
};

export const ReportCard: React.FC<{ template: ReportTemplate }> = ({ template }) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col">
            <div className="flex items-start">
                <div className="p-3 bg-slate-100 rounded-lg mr-4">
                    <ReportIcon iconName={template.iconName} />
                </div>
                <div>
                    <h3 className="font-semibold text-slate-800">{template.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{template.description}</p>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex-grow flex items-end">
                <button className="w-full px-4 py-2 bg-white text-slate-700 text-sm font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition">
                    Generate Report
                </button>
            </div>
        </div>
    );
};