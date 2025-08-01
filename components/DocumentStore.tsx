
import React, { useState } from 'react';
import { MOCK_DOCUMENTS, MOCK_STUDENTS } from '../constants';
import { PlusIcon, SearchIcon } from './icons';
import { DocumentRow } from './documents/DocumentRow';
import { UploadDocumentModal } from './documents/UploadDocumentModal';
import { DeleteDocumentModal } from './documents/DeleteDocumentModal';
import { Document } from '../types';


const DocumentStore: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [docToDelete, setDocToDelete] = useState<Document | null>(null);

    const handleUploadDocument = (newDocData: Omit<Document, 'id' | 'uploadDate' | 'fileUrl'>) => {
        const newDocument: Document = {
            id: `DOC${(documents.length + 10).toString()}`,
            ...newDocData,
            uploadDate: new Date().toISOString().split('T')[0],
            fileUrl: '#', // Placeholder URL
        };
        setDocuments([newDocument, ...documents]);
        setIsUploadModalOpen(false);
    };
    
    const handleDeleteDocument = (docId: string) => {
        setDocuments(documents.filter(d => d.id !== docId));
        setDocToDelete(null);
    };

    return (
        <>
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm">
                <div className="p-4 md:p-6 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800">Document Store</h2>
                        <p className="text-sm text-slate-500 mt-1">Manage all student documents.</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search documents..."
                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:border-indigo-500 focus:outline-none transition"
                                aria-label="Search documents"
                            />
                        </div>
                        <button 
                            onClick={() => setIsUploadModalOpen(true)}
                            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition whitespace-nowrap">
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Upload Document
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                            <tr>
                                <th scope="col" className="py-3 px-6 font-medium">Document Name</th>
                                <th scope="col" className="py-3 px-6 font-medium">Student</th>
                                <th scope="col" className="py-3 px-6 font-medium">Type</th>
                                <th scope="col" className="py-3 px-6 font-medium">Upload Date</th>
                                <th scope="col" className="py-3 px-6 font-medium"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {documents.map(doc => (
                                <DocumentRow
                                    key={doc.id} 
                                    document={doc}
                                    onDelete={setDocToDelete}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-600">
                    <p>Showing 1 to {documents.length} of {documents.length} results</p>
                    <div className="flex items-center space-x-2">
                        <button className="px-3 py-1 border border-slate-300 rounded-md hover:bg-slate-100 transition-colors">Previous</button>
                        <button className="px-3 py-1 border border-slate-300 rounded-md hover:bg-slate-100 transition-colors">Next</button>
                    </div>
                </div>
            </div>

            {isUploadModalOpen && <UploadDocumentModal students={MOCK_STUDENTS} onClose={() => setIsUploadModalOpen(false)} onUpload={handleUploadDocument} />}
            {docToDelete && <DeleteDocumentModal document={docToDelete} onClose={() => setDocToDelete(null)} onDelete={handleDeleteDocument} />}
        </>
    );
};

export default DocumentStore;
