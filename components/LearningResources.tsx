

import React, { useState } from 'react';
import { MOCK_LEARNING_RESOURCES, MOCK_TEACHERS } from '../constants';
import { LearningResource, User } from '../types';
import { PlusIcon } from './icons';
import { ResourceRow } from './learning-resources/ResourceRow';
import { UploadResourceModal } from './learning-resources/UploadResourceModal';
import { DeleteResourceModal } from './learning-resources/DeleteResourceModal';

interface LearningResourcesProps {
    currentUser: User;
}

const LearningResources: React.FC<LearningResourcesProps> = ({ currentUser }) => {
    const [resources, setResources] = useState<LearningResource[]>(MOCK_LEARNING_RESOURCES);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [resourceToEdit, setResourceToEdit] = useState<LearningResource | null>(null);
    const [resourceToDelete, setResourceToDelete] = useState<LearningResource | null>(null);

    const handleUploadOrUpdateResource = (resourceData: Omit<LearningResource, 'id' | 'uploadDate' | 'uploaderName'>, id?: string) => {
        if (id) {
            // Update
            const updatedResource = { ...resources.find(r => r.id === id)!, ...resourceData, uploaderName: currentUser.name };
            setResources(resources.map(r => r.id === id ? updatedResource : r));
        } else {
            // Create
            const newResource: LearningResource = {
                id: `LR${(resources.length + 10).toString()}`,
                ...resourceData,
                uploaderName: currentUser.name,
                uploadDate: new Date().toISOString().split('T')[0],
            };
            setResources([newResource, ...resources]);
        }
        setIsUploadModalOpen(false);
        setResourceToEdit(null);
    };
    
    const handleDeleteResource = (resourceId: string) => {
        setResources(resources.filter(r => r.id !== resourceId));
        setResourceToDelete(null);
    };

    const handleEdit = (resource: LearningResource) => {
        setResourceToEdit(resource);
        setIsUploadModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsUploadModalOpen(false);
        setResourceToEdit(null);
    }

    return (
        <>
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm">
                <div className="p-4 md:p-6 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800">Learning Resources</h2>
                        <p className="text-sm text-slate-500 mt-1">Manage shared notes, assignments, and videos.</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                        {/* Future filter controls can go here */}
                        <button 
                            onClick={() => setIsUploadModalOpen(true)}
                            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition whitespace-nowrap">
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Upload Resource
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                            <tr>
                                <th scope="col" className="py-3 px-6 font-medium">Title</th>
                                <th scope="col" className="py-3 px-6 font-medium">Subject</th>
                                <th scope="col" className="py-3 px-6 font-medium">Class</th>
                                <th scope="col" className="py-3 px-6 font-medium">Type</th>
                                <th scope="col" className="py-3 px-6 font-medium">Uploaded By</th>
                                <th scope="col" className="py-3 px-6 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {resources.map(resource => (
                                <ResourceRow
                                    key={resource.id} 
                                    resource={resource}
                                    onEdit={handleEdit}
                                    onDelete={setResourceToDelete}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {(isUploadModalOpen || resourceToEdit) && 
                <UploadResourceModal 
                    resource={resourceToEdit}
                    onClose={handleCloseModal} 
                    onSave={handleUploadOrUpdateResource} 
                />}
            {resourceToDelete && <DeleteResourceModal resource={resourceToDelete} onClose={() => setResourceToDelete(null)} onDelete={handleDeleteResource} />}
        </>
    );
};

export default LearningResources;