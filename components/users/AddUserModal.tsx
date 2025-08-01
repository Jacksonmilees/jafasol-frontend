
import React, { useState } from 'react';
import { User, Role } from '../../types';
import { XIcon, UsersIcon } from '../icons';

interface AddUserModalProps {
    roles: Role[];
    onClose: () => void;
    onAddUser: (userData: Omit<User, 'id' | 'status' | 'avatarUrl'>) => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ roles, onClose, onAddUser }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        roleId: roles[0]?.id || '',
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedRole = roles.find(r => r.id === formData.roleId);
        if (!selectedRole) {
            // Handle error, though it shouldn't happen with a controlled select
            console.error("Selected role not found");
            return;
        }
        onAddUser({
            name: formData.name,
            email: formData.email,
            role: selectedRole
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div className="flex items-center">
                        <UsersIcon className="h-6 w-6 text-indigo-600 mr-3" />
                        <h2 className="text-xl font-semibold text-slate-800">Add New User</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100" aria-label="Close">
                        <XIcon className="h-6 w-6 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                        </div>
                        <div>
                            <label htmlFor="roleId" className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                            <select name="roleId" id="roleId" value={formData.roleId} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                                {roles.map(role => <option key={role.id} value={role.id}>{role.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 font-medium rounded-lg hover:bg-slate-100 transition">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                            Save User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
