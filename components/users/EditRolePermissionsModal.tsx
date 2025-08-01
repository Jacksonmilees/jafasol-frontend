
import React, { useState, useEffect } from 'react';
import { Role, Page, PermissionAction, ModulePermissions } from '../../types';
import { PERMISSION_MODULES, PERMISSION_ACTIONS } from '../../constants';
import { XIcon, ShieldCheckIcon } from '../icons';

interface EditRolePermissionsModalProps {
    role: Role;
    onClose: () => void;
    onSave: (updatedRole: Role) => void;
}

const toTitleCase = (str: string) => str.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());

export const EditRolePermissionsModal: React.FC<EditRolePermissionsModalProps> = ({ role, onClose, onSave }) => {
    const [permissions, setPermissions] = useState<Role['permissions']>(role.permissions);

    useEffect(() => {
        setPermissions(role.permissions);
    }, [role]);

    const handlePermissionChange = (module: Page, action: PermissionAction, checked: boolean) => {
        setPermissions(prev => {
            const newPermissions = { ...prev };
            if (!newPermissions[module]) {
                newPermissions[module] = {};
            }
            (newPermissions[module] as ModulePermissions)[action] = checked;
            return newPermissions;
        });
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...role, permissions });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div className="flex items-center">
                        <ShieldCheckIcon className="h-6 w-6 text-indigo-600 mr-3" />
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800">Edit Permissions</h2>
                            <p className="text-sm text-slate-500">Role: <span className="font-medium text-indigo-600">{role.name}</span></p>
                        </div>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-100" aria-label="Close">
                        <XIcon className="h-6 w-6 text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {PERMISSION_MODULES.map(module => (
                            <div key={module} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                <h3 className="font-semibold text-slate-800 mb-3">{module}</h3>
                                <div className="space-y-2">
                                    {PERMISSION_ACTIONS.map(action => (
                                        <label key={action} className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={!!permissions[module]?.[action]}
                                                onChange={(e) => handlePermissionChange(module, action, e.target.checked)}
                                                className="h-4 w-4 rounded border-slate-400 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm text-slate-600">{toTitleCase(action)}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 font-medium rounded-lg hover:bg-slate-100 transition">
                        Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                        Save Permissions
                    </button>
                </div>
            </form>
        </div>
    );
};
