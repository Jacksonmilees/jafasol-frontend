


import React, { useState } from 'react';
import { PlusIcon, SearchIcon, UploadCloudIcon } from './icons';
import { UserRow } from './users/UserRow';
import { AddUserModal } from './users/AddUserModal';
import { EditUserModal } from './users/EditUserModal';
import { User, Role, Page } from '../types';

interface UserManagementProps {
    currentUser: User;
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    roles: Role[];
}

const UserManagement: React.FC<UserManagementProps> = ({ currentUser, users, setUsers, roles }) => {
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);

    const handleAddUser = (newUserData: Omit<User, 'id' | 'status' | 'avatarUrl'>) => {
        const newUser: User = {
            id: `U${(users.length + 10).toString().padStart(3, '0')}`,
            ...newUserData,
            status: 'Active',
            avatarUrl: `https://picsum.photos/seed/U${Math.random()}/40/40`,
        };
        setUsers([newUser, ...users]);
        setIsAddUserModalOpen(false);
    };
    
    const handleUpdateUser = (updatedUser: User) => {
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        setUserToEdit(null);
    };
    
    const canCreateUser = currentUser.role.permissions[Page.UserManagement]?.create;

    return (
        <>
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm">
                <div className="p-4 md:p-6 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800">System Users</h2>
                        <p className="text-sm text-slate-500 mt-1">Manage all system user accounts.</p>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center mt-4 md:mt-0">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="w-full sm:w-auto pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:border-indigo-500 focus:outline-none transition"
                                aria-label="Search users"
                            />
                        </div>
                        {canCreateUser && (
                            <button 
                                onClick={() => setIsAddUserModalOpen(true)}
                                className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition whitespace-nowrap">
                                <PlusIcon className="h-5 w-5 mr-2" />
                                Add User
                            </button>
                        )}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                            <tr>
                                <th scope="col" className="py-3 px-6 font-medium">User</th>
                                <th scope="col" className="py-3 px-6 font-medium hidden sm:table-cell">Email</th>
                                <th scope="col" className="py-3 px-6 font-medium">Role</th>
                                <th scope="col" className="py-3 px-6 font-medium">Status</th>
                                <th scope="col" className="py-3 px-6 font-medium"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {users.map(user => (
                                <UserRow 
                                    key={user.id} 
                                    user={user}
                                    currentUser={currentUser}
                                    onEdit={setUserToEdit}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-600">
                    <p className="text-xs sm:text-sm">Showing 1 to {users.length} of {users.length} results</p>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        <button className="px-3 py-1 border border-slate-300 rounded-md hover:bg-slate-100 transition-colors text-xs sm:text-sm">Previous</button>
                        <button className="px-3 py-1 border border-slate-300 rounded-md hover:bg-slate-100 transition-colors text-xs sm:text-sm">Next</button>
                    </div>
                </div>
            </div>

            {isAddUserModalOpen && <AddUserModal roles={roles} onClose={() => setIsAddUserModalOpen(false)} onAddUser={handleAddUser} />}
            {userToEdit && <EditUserModal user={userToEdit} roles={roles} onClose={() => setUserToEdit(null)} onUpdateUser={handleUpdateUser} />}
        </>
    );
};

export default UserManagement;
