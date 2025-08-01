
import React from 'react';
import { Role, User, Page } from '../../types';
import { PencilIcon, ShieldCheckIcon } from '../icons';

interface RoleManagementProps {
    currentUser: User;
    roles: Role[];
    users: User[];
    onEditRole: (role: Role) => void;
}

export const RoleManagement: React.FC<RoleManagementProps> = ({ currentUser, roles, users, onEditRole }) => {
    
    const countUsersInRole = (roleId: string) => {
        return users.filter(user => user.role.id === roleId).length;
    };

    const canEditRole = currentUser.role.permissions[Page.UserManagement]?.edit;

    return (
        <div>
            <div className="p-4 md:p-6">
                <h2 className="text-xl font-semibold text-slate-800">Roles & Permissions</h2>
                <p className="text-sm text-slate-500 mt-1">Define what users can see and do in the system.</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                        <tr>
                            <th scope="col" className="py-3 px-6 font-medium">Role</th>
                            <th scope="col" className="py-3 px-6 font-medium">Users</th>
                            <th scope="col" className="py-3 px-6 font-medium"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {roles.map(role => (
                            <tr key={role.id} className="hover:bg-slate-50">
                                <td className="py-3 px-6">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-slate-100 rounded-md mr-3">
                                            <ShieldCheckIcon className="w-5 h-5 text-slate-500"/>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">{role.name}</p>
                                            <p className="text-xs text-slate-500">{role.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 px-6 text-slate-600">{countUsersInRole(role.id)} users</td>
                                <td className="py-3 px-6 text-right">
                                    {canEditRole && (
                                        <button 
                                            onClick={() => onEditRole(role)}
                                            className="flex items-center justify-center px-3 py-2 bg-white text-slate-700 border border-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 transition whitespace-nowrap">
                                            <PencilIcon className="h-4 w-4 mr-2" />
                                            Edit Permissions
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
