import React from 'react';
import { SettingsIcon, CalendarDaysIcon, ShieldCheckIcon, ShieldAlertIcon } from '../icons';

type SettingsTab = 'System' | 'Academic' | 'Roles & Permissions' | 'Security';

interface SettingsNavProps {
    activeTab: SettingsTab;
    setActiveTab: (tab: SettingsTab) => void;
}

const navItems: { id: SettingsTab; label: string; icon: React.FC<{className?: string}> }[] = [
    { id: 'System', label: 'System & Branding', icon: SettingsIcon },
    { id: 'Academic', label: 'Academic', icon: CalendarDaysIcon },
    { id: 'Roles & Permissions', label: 'Roles & Permissions', icon: ShieldCheckIcon },
    { id: 'Security', label: 'Security', icon: ShieldAlertIcon },
];

export const SettingsNav: React.FC<SettingsNavProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                {navItems.map(item => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
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
    );
};