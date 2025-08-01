import React, { useState } from 'react';
import { MOCK_ACADEMIC_YEAR, MOCK_GRADING_SYSTEM, MOCK_ROLES } from '../constants';
import { AcademicYear, Grade, User, Role, AuditLog } from '../types';
import { SettingsNav } from './settings/SettingsNav';
import { SystemSettings } from './settings/SystemSettings';
import { AcademicSettings } from './settings/AcademicSettings';
import { RoleManagement } from './users/RoleManagement';
import { EditRolePermissionsModal } from './users/EditRolePermissionsModal';
import AuditLogs from './AuditLogs';

type SettingsTab = 'System' | 'Academic' | 'Roles & Permissions' | 'Security';

interface SettingsProps {
    currentUser: User;
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    roles: Role[];
    setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
    auditLogs: AuditLog[];
}


const Settings: React.FC<SettingsProps> = ({ currentUser, users, setUsers, roles, setRoles, auditLogs }) => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('System');

    // State for settings data, managed by the parent Settings component
    const [academicYear, setAcademicYear] = useState<AcademicYear>(MOCK_ACADEMIC_YEAR);
    const [gradingSystem, setGradingSystem] = useState<Grade[]>(MOCK_GRADING_SYSTEM);
    const [schoolInfo, setSchoolInfo] = useState({
        name: 'GREEN VALLEY HIGH SCHOOL',
        motto: 'Excellence and Integrity',
    });
    const [schoolLogo, setSchoolLogo] = useState<string | null>(null);
    const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);

     const handleUpdateRole = (updatedRole: Role) => {
        setRoles(roles.map(r => r.id === updatedRole.id ? updatedRole : r));
        // Also update the role for all users who have it
        setUsers(users.map(u => u.role.id === updatedRole.id ? { ...u, role: updatedRole } : u));
        setRoleToEdit(null);
    };

    const renderContent = () => {
        switch(activeTab) {
            case 'System':
                return (
                    <SystemSettings
                        schoolInfo={schoolInfo}
                        setSchoolInfo={setSchoolInfo}
                        schoolLogo={schoolLogo}
                        setSchoolLogo={setSchoolLogo}
                    />
                );
            case 'Academic':
                 return (
                    <AcademicSettings
                        academicYear={academicYear}
                        setAcademicYear={setAcademicYear}
                        gradingSystem={gradingSystem}
                        setGradingSystem={setGradingSystem}
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
                <p className="text-gray-500 mt-1">Manage your account and system preferences.</p>
            </div>
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