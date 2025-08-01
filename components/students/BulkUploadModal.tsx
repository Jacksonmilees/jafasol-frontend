
import React, { useState } from 'react';
import { Student } from '../../types';
import { XIcon, UploadCloudIcon, DownloadIcon } from '../icons';

type NewStudentData = Omit<Student, 'id' | 'status' | 'enrollmentDate' | 'avatarUrl' | 'examResults' | 'isRegistered'>;

interface BulkUploadModalProps {
    onClose: () => void;
    onImport: (students: NewStudentData[]) => void;
}

const CSV_TEMPLATE_HEADERS = 'admissionNumber,firstName,lastName,dateOfBirth,gender,formClass,stream,guardianName,guardianPhone';
const CSV_TEMPLATE_BODY = 'ADM1009,Ali,Khan,2009-04-15,Male,Form 2,B,Mr. Khan,0722000111\nADM1010,Brenda,Mwangi,2010-07-22,Female,Form 1,C,Mrs. Mwangi,0733222333';
const CSV_TEMPLATE = `${CSV_TEMPLATE_HEADERS}\n${CSV_TEMPLATE_BODY}`;

const requiredHeaders = ['admissionNumber', 'firstName', 'lastName', 'formClass', 'stream'];

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ onClose, onImport }) => {
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<NewStudentData[]>([]);
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
            parseCsv(selectedFile);
        }
    };

    const parseCsv = (fileToParse: File) => {
        setError('');
        setParsedData([]);
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
            if (lines.length < 2) {
                setError('CSV file must have a header row and at least one data row.');
                return;
            }

            const headers = lines[0].split(',').map(h => h.trim());
            
            for (const requiredHeader of requiredHeaders) {
                if (!headers.includes(requiredHeader)) {
                    setError(`Missing required column: ${requiredHeader}. Please use the template.`);
                    return;
                }
            }

            const students: NewStudentData[] = [];
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',').map(v => v.trim());
                const studentObject = headers.reduce((obj, header, index) => {
                    (obj as any)[header] = values[index] || '';
                    return obj;
                }, {} as NewStudentData);

                // Basic validation
                if (studentObject.admissionNumber && studentObject.firstName && studentObject.lastName) {
                   students.push(studentObject);
                }
            }
            setParsedData(students);
        };
        reader.onerror = () => {
             setError('Failed to read the file.');
        }
        reader.readAsText(fileToParse);
    };

    const handleDownloadTemplate = () => {
        const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "student_template.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleImportClick = () => {
        setLoading(true);
        // Simulate API delay
        setTimeout(() => {
            onImport(parsedData);
            setLoading(false);
            onClose();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div className="flex items-center">
                        <UploadCloudIcon className="h-6 w-6 text-indigo-600 mr-3" />
                        <h2 className="text-xl font-semibold text-slate-800">Bulk Upload Students</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100" aria-label="Close">
                        <XIcon className="h-6 w-6 text-slate-500" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
                                    <span className="relative font-medium text-indigo-600">
                                        <span>Click to upload</span>
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

                    {/* Preview */}
                    {parsedData.length > 0 && (
                        <div>
                             <h3 className="text-lg font-medium text-slate-800">Step 3: Preview and Confirm</h3>
                             <p className="text-sm text-slate-500 mt-1">Found <span className="font-bold">{parsedData.length}</span> students. Here's a preview of the first 5 records.</p>
                             <div className="mt-3 border rounded-lg overflow-hidden">
                                 <table className="w-full text-sm text-left">
                                     <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                                        <tr>
                                            <th className="py-2 px-4 font-medium">Admission No.</th>
                                            <th className="py-2 px-4 font-medium">Full Name</th>
                                            <th className="py-2 px-4 font-medium">Class</th>
                                        </tr>
                                     </thead>
                                     <tbody className="divide-y divide-slate-200">
                                        {parsedData.slice(0, 5).map((student, index) => (
                                            <tr key={index}>
                                                <td className="py-2 px-4">{student.admissionNumber}</td>
                                                <td className="py-2 px-4">{student.firstName} {student.lastName}</td>
                                                <td className="py-2 px-4">{student.formClass} {student.stream}</td>
                                            </tr>
                                        ))}
                                     </tbody>
                                 </table>
                             </div>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex justify-end space-x-3">
                    <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 font-medium rounded-lg hover:bg-slate-100 transition disabled:opacity-50">
                        Cancel
                    </button>
                    <button onClick={handleImportClick} disabled={loading || parsedData.length === 0} className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Importing...' : `Import ${parsedData.length} Students`}
                    </button>
                </div>
            </div>
        </div>
    );
};
