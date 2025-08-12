import React, { useState, useEffect } from 'react';
import { SettingsIcon, SaveIcon } from './icons';
import { User, Page } from '../types';
import apiClient from '../api';

interface SettingsProps {
    currentUser?: User;
    addAuditLog?: (action: string, details: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ currentUser, addAuditLog }) => {
    const [settings, setSettings] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Permission checks
    const isAdmin = currentUser?.role?.name === 'Admin';
    const canEdit = isAdmin || currentUser?.role?.permissions?.[Page.Settings]?.edit || false;

    // Load settings from API
    const loadSettings = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.getSettings();
            setSettings(response.settings);
        } catch (error) {
            console.error('Failed to load settings:', error);
            setError('Failed to load settings. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Save settings to API
    const saveSettings = async (updatedSettings: any) => {
        setIsSaving(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await apiClient.updateSettings(updatedSettings);
            setSettings(response.settings);
            setSuccess('Settings saved successfully!');
            addAuditLog?.('Settings Updated', 'School settings were updated');
            
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error('Failed to save settings:', error);
            setError('Failed to save settings. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    // Load settings on component mount
    useEffect(() => {
        loadSettings();
    }, []);

    if (!currentUser) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    if (!canEdit) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <SettingsIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
                <p className="text-gray-500">You don't have permission to access settings.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                            <SettingsIcon className="h-8 w-8 text-purple-600 mr-3" />
                            School Settings
                        </h2>
                        <p className="text-gray-600 mt-2 text-lg">Configure your school's academic calendar, admission numbers, and system preferences</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-sm mt-4 md:mt-0">
                        <p className="text-sm text-gray-500 font-medium">Current Academic Year</p>
                        <p className="text-xl font-bold text-purple-600">
                            {settings?.academicCalendar?.currentAcademicYear || 'Not Set'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Success/Error Messages */}
            {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800">{success}</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            {/* Settings Content */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading settings...</p>
                    </div>
                ) : settings ? (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800">School Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
                                <input
                                    type="text"
                                    value={settings.schoolInfo?.name || ''}
                                    onChange={(e) => setSettings(prev => ({
                                        ...prev,
                                        schoolInfo: { ...prev.schoolInfo, name: e.target.value }
                                    }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">School Motto</label>
                                <input
                                    type="text"
                                    value={settings.schoolInfo?.motto || ''}
                                    onChange={(e) => setSettings(prev => ({
                                        ...prev,
                                        schoolInfo: { ...prev.schoolInfo, motto: e.target.value }
                                    }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Current Academic Year</label>
                                <input
                                    type="text"
                                    value={settings.academicCalendar?.currentAcademicYear || ''}
                                    onChange={(e) => setSettings(prev => ({
                                        ...prev,
                                        academicCalendar: { ...prev.academicCalendar, currentAcademicYear: e.target.value }
                                    }))}
                                    placeholder="e.g., 2024-2025"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Admission Number Pattern</label>
                                <input
                                    type="text"
                                    value={settings.admissionNumberSettings?.pattern || ''}
                                    onChange={(e) => setSettings(prev => ({
                                        ...prev,
                                        admissionNumberSettings: { ...prev.admissionNumberSettings, pattern: e.target.value }
                                    }))}
                                    placeholder="e.g., STD{year}{form}{sequence}"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                />
                                <p className="text-sm text-gray-500 mt-1">Use {`{year}`}, {`{form}`}, {`{sequence}`} as placeholders</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <SettingsIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Settings Found</h3>
                        <p className="text-gray-500">Settings have not been initialized yet.</p>
                    </div>
                )}
            </div>

            {/* Save Button */}
            {settings && (
                <div className="flex justify-end">
                    <button
                        onClick={() => saveSettings(settings)}
                        disabled={isSaving}
                        className="flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <SaveIcon className="h-5 w-5 mr-2" />
                                Save Settings
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Settings;