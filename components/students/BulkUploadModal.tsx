
import React, { useState } from 'react';
import { DownloadIcon, UploadCloudIcon } from '../icons';

interface BulkUploadModalProps {
    onClose: () => void;
    onImport: (file: File) => void;
}

const CSV_TEMPLATE_HEADERS = 'admissionNumber,firstName,lastName,dateOfBirth,gender,formClass,stream,parentName,parentPhone';
const CSV_TEMPLATE_BODY = 'ADM1009,Ali,Khan,2009-04-15,Male,Form 2,B,Mr. Khan,0722000111\nADM1010,Brenda,Mwangi,2010-07-22,Female,Form 1,C,Mrs. Mwangi,0733222333';
const CSV_TEMPLATE = `${CSV_TEMPLATE_HEADERS}\n${CSV_TEMPLATE_BODY}`;

const requiredHeaders = ['admissionNumber', 'firstName', 'lastName', 'formClass', 'stream'];

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ onClose, onImport }) => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== 'text/csv') {
                setError('Invalid file type. Please upload a .csv file.');
                return;
            }
            setFile(selectedFile);
            setError('');
        }
    };

    const handleDownloadTemplate = () => {
        const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'students_template.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setError('');
    };

    const handleImportClick = async () => {
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }

        setLoading(true);
        try {
            onImport(file);
        } catch (error) {
            setError('Failed to upload file. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-900">Bulk Upload Students</h2>
                    <p className="text-sm text-slate-500 mt-1">Upload multiple students at once using a CSV file.</p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Step 1 */}
                    <div>
                        <h3 className="text-lg font-medium text-slate-800">Step 1: Get Your CSV Ready</h3>
                        <p className="text-sm text-slate-500 mt-1">Download our template to ensure your data is in the correct format.</p>
                        <p className="text-xs text-slate-500 mt-2">Required columns: <code className="bg-slate-100 p-1 rounded">{requiredHeaders.join(', ')}</code></p>
                        <button onClick={handleDownloadTemplate} className="mt-3 inline-flex items-center px-4 py-2 bg-white text-slate-700 border border-slate-300 font-medium rounded-lg hover:bg-slate-50 text-sm">
                            <DownloadIcon className="h-4 w-4 mr-2" />
                            Download CSV Template
                        </button>
                    </div>

                    {/* Step 2 */}
                    <div>
                         <h3 className="text-lg font-medium text-slate-800">Step 2: Upload Your File</h3>
                         <label htmlFor="file-upload" className="mt-2 flex justify-center w-full h-32 px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors">
                            <div className="space-y-1 text-center">
                                <UploadCloudIcon className="mx-auto h-12 w-12 text-slate-400" />
                                <div className="flex text-sm text-slate-600">
                                    <span className="relative bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                        Upload a file
                                    </span>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-slate-500">{file ? file.name : 'CSV file up to 5MB'}</p>
                            </div>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".csv" onChange={handleFileChange} />
                        </label>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* File selected info */}
                    {file && (
                        <div>
                             <h3 className="text-lg font-medium text-slate-800">Step 3: Confirm Upload</h3>
                             <p className="text-sm text-slate-500 mt-1">Ready to upload: <span className="font-bold">{file.name}</span></p>
                             <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                                 <p className="text-sm text-green-700">
                                     ✓ File selected: {file.name}<br/>
                                     ✓ Size: {(file.size / 1024).toFixed(1)} KB<br/>
                                     ✓ Type: CSV file
                                 </p>
                             </div>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex justify-end space-x-3">
                    <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 font-medium rounded-lg hover:bg-slate-100 transition disabled:opacity-50">
                        Cancel
                    </button>
                    <button onClick={handleImportClick} disabled={loading || !file} className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Uploading...' : 'Upload Students'}
                    </button>
                </div>
            </div>
        </div>
    );
};