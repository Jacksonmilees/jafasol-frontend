
import React from 'react';
import { LearningResource } from '../../types';
import { XIcon, TrashIcon } from '../icons';

interface DeleteResourceModalProps {
    resource: LearningResource;
    onClose: () => void;
    onDelete: (resourceId: string) => void;
}

export const DeleteResourceModal: React.FC<DeleteResourceModalProps> = ({ resource, onClose, onDelete }) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div className="flex items-center">
                        <TrashIcon className="h-6 w-6 text-red-600 mr-3" />
                        <h2 className="text-xl font-semibold text-slate-800">Delete Resource</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100" aria-label="Close">
                        <XIcon className="h-6 w-6 text-slate-500" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-slate-600">
                        Are you sure you want to delete <strong className="font-semibold text-slate-800">{resource.title}</strong>? 
                        This action cannot be undone.
                    </p>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 font-medium rounded-lg hover:bg-slate-100 transition">
                        Cancel
                    </button>
                    <button onClick={() => onDelete(resource.id)} className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};
