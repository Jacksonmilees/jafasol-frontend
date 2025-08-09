import React, { useState, useEffect } from 'react';
import { User, Role, AuditLog } from '../types';
import { SettingsNav } from './settings/SettingsNav';
import { SystemSettings } from './settings/SystemSettings';
import { AcademicSettings } from './settings/AcademicSettings';
import { RoleManagement } from './users/RoleManagement';
import { EditRolePermissionsModal } from './users/EditRolePermissionsModal';
import AuditLogs from './AuditLogs';
import apiClient from '../api';

type SettingsTab = 'System' | 'Academic' | 'Roles & Permissions' | 'Security';

interface SettingsProps {
    currentUser: User;
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    roles: Role[];
    setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
    auditLogs: AuditLog[];
}

interface SchoolSettings {
    name: string;
    motto: string;
    logo?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
}

const Settings: React.FC<SettingsProps> = ({ currentUser, users, setUsers, roles, setRoles, auditLogs }) => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('System');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Real settings data
    const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>({
        name: '',
        motto: '',
        logo: '',
        address: '',
        phone: '',
        email: '',
        website: ''
    });
    const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);

    // Fetch school settings on component mount
    useEffect(() => {
        fetchSchoolSettings();
    }, []);

    const fetchSchoolSettings = async () => {
        setIsLoading(true);
        setError('');
        
        try {
            const response = await apiClient.getSettings();
            
            if (response.settings) {
                setSchoolSettings({
                    name: response.settings.schoolName || '',
                    motto: response.settings.schoolMotto || '',
                    logo: response.settings.schoolLogo || '',
                    address: response.settings.address || '',
                    phone: response.settings.phone || '',
                    email: response.settings.email || '',
                    website: response.settings.website || ''
                });
            }
        } catch (error: any) {
            console.error('Failed to fetch settings:', error);
            setError('Failed to load settings. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const updateSchoolSettings = async (updatedSettings: Partial<SchoolSettings>) => {
        setIsLoading(true);
        setError('');
        
        try {
            const response = await apiClient.request('/api/settings', {
                method: 'PUT',
                body: JSON.stringify({
                    schoolName: updatedSettings.name,
                    schoolMotto: updatedSettings.motto,
                    schoolLogo: updatedSettings.logo,
                    address: updatedSettings.address,
                    phone: updatedSettings.phone,
                    email: updatedSettings.email,
                    website: updatedSettings.website
                })
            });
            
            if (response.message) {
                setSchoolSettings(prev => ({ ...prev, ...updatedSettings }));
                // Update page title if school name changed
                if (updatedSettings.name) {
                    document.title = `${updatedSettings.name} - Jafasol`;
                }
            }
        } catch (error: any) {
            console.error('Failed to update settings:', error);
            setError('Failed to save settings. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateRole = (updatedRole: Role) => {
        setRoles(roles.map(r => r.id === updatedRole.id ? updatedRole : r));
        // Also update the role for all users who have it
        setUsers(users.map(u => u.role.id === updatedRole.id ? { ...u, role: updatedRole } : u));
        setRoleToEdit(null);
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                </div>
            );
        }

        switch(activeTab) {
            case 'System':
                return (
                    <SystemSettings
                        schoolSettings={schoolSettings}
                        updateSchoolSettings={updateSchoolSettings}
                        isLoading={isLoading}
                        error={error}
                    />
                );
            case 'Academic':
                return (
                    <AcademicSettings
                        currentUser={currentUser}
                    />
                );
            case 'Roles & Permissions':
                return (
                    <RoleManagement 
                        currentUser={currentUser}
                        roles={roles}
                        users={users}
                        onEditRole={setRoleToEdit}
                    />
                );
            case 'Security':
                return <AuditLogs logs={auditLogs} isSubcomponent={true} />;
            default:
                return null;
        }
    }

    return (
        <>
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
                <p className="text-gray-500 mt-1">Manage your school settings and preferences.</p>
            </div>
            
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}
            
            <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm">
                <div className="p-4 md:p-6">
                    <SettingsNav activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className="mt-6">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
        {roleToEdit && <EditRolePermissionsModal role={roleToEdit} onClose={() => setRoleToEdit(null)} onSave={handleUpdateRole} />}
        </>
    );
};

export default Settings;