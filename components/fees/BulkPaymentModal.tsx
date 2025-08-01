import React, { useState } from 'react';
import { FeePayment, Student } from '../../types';
import { MOCK_STUDENTS } from '../../constants';
import { XIcon, UploadCloudIcon, DownloadIcon } from '../icons';

type NewPaymentData = {
    studentId: string;
    amount: number;
    method: FeePayment['method'];
    date: string;
};

interface BulkPaymentModalProps {
    onClose: () => void;
    onImport: (payments: NewPaymentData[]) => void;
}

const CSV_TEMPLATE_HEADERS = 'studentAdmissionNumber,amount,paymentMethod,paymentDate';
const CSV_TEMPLATE_BODY = 'ADM1001,5000,Mpesa,2024-05-28\nADM1004,10000,Bank,2024-05-27';
const CSV_TEMPLATE = `${CSV_TEMPLATE_HEADERS}\n${CSV_TEMPLATE_BODY}`;

const requiredHeaders = ['studentAdmissionNumber', 'amount', 'paymentMethod', 'paymentDate'];

export const BulkPaymentModal: React.FC<BulkPaymentModalProps> = ({ onClose, onImport }) => {
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<NewPaymentData[]>([]);
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

            const payments: NewPaymentData[] = [];
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',').map(v => v.trim());
                const admissionNumber = values[headers.indexOf('studentAdmissionNumber')];
                const student = MOCK_STUDENTS.find(s => s.admissionNumber === admissionNumber);
                const amount = parseFloat(values[headers.indexOf('amount')]);
                const method = values[headers.indexOf('paymentMethod')] as FeePayment['method'];
                const date = values[headers.indexOf('paymentDate')];

                if (student && !isNaN(amount) && ['Mpesa', 'Bank', 'Cash'].includes(method) && date) {
                   payments.push({ studentId: student.id, amount, method, date });
                }
            }
            setParsedData(payments);
        };
        reader.onerror = () => setError('Failed to read the file.');
        reader.readAsText(fileToParse);
    };

    const handleDownloadTemplate = () => {
        const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "bulk_payment_template.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImportClick = () => {
        setLoading(true);
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
                        <h2 className="text-xl font-semibold text-slate-800">Bulk Record Fee Payments</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100"><XIcon className="h-6 w-6 text-slate-500" /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-slate-800">Step 1: Download Template</h3>
                        <p className="text-sm text-slate-500 mt-1">Use the template to format your payment data correctly.</p>
                        <button onClick={handleDownloadTemplate} className="mt-3 inline-flex items-center px-4 py-2 bg-white text-slate-700 border border-slate-300 font-medium rounded-lg hover:bg-slate-50 text-sm">
                            <DownloadIcon className="h-4 w-4 mr-2" />
                            Download CSV Template
                        </button>
                    </div>

                    <div>
                         <h3 className="text-lg font-medium text-slate-800">Step 2: Upload Your File</h3>
                         <label htmlFor="file-upload" className="mt-2 flex justify-center w-full h-32 px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors">
                            <div className="space-y-1 text-center">
                                <UploadCloudIcon className="mx-auto h-12 w-12 text-slate-400" />
                                <p className="pl-1 text-sm text-slate-600">{file ? file.name : 'Click to upload or drag and drop a .csv file'}</p>
                            </div>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".csv" onChange={handleFileChange} />
                        </label>
                    </div>

                    {error && <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">{error}</div>}

                    {parsedData.length > 0 && (
                        <div>
                             <h3 className="text-lg font-medium text-slate-800">Step 3: Preview Data</h3>
                             <p className="text-sm text-slate-500 mt-1">Found <span className="font-bold">{parsedData.length}</span> payments. Here's a preview:</p>
                             <div className="mt-3 border rounded-lg overflow-hidden max-h-48">
                                 <table className="w-full text-sm text-left">
                                     <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider sticky top-0">
                                        <tr>
                                            <th className="py-2 px-4 font-medium">Student Name</th>
                                            <th className="py-2 px-4 font-medium">Amount</th>
                                            <th className="py-2 px-4 font-medium">Method</th>
                                            <th className="py-2 px-4 font-medium">Date</th>
                                        </tr>
                                     </thead>
                                     <tbody className="divide-y divide-slate-200">
                                        {parsedData.slice(0, 5).map((payment, index) => {
                                            const student = MOCK_STUDENTS.find(s => s.id === payment.studentId);
                                            return (
                                            <tr key={index}>
                                                <td className="py-2 px-4">{student?.firstName} {student?.lastName}</td>
                                                <td className="py-2 px-4">{payment.amount.toLocaleString()}</td>
                                                <td className="py-2 px-4">{payment.method}</td>
                                                <td className="py-2 px-4">{payment.date}</td>
                                            </tr>
                                        )})}
                                     </tbody>
                                 </table>
                             </div>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex justify-end space-x-3">
                    <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 font-medium rounded-lg hover:bg-slate-100 transition disabled:opacity-50">Cancel</button>
                    <button onClick={handleImportClick} disabled={loading || parsedData.length === 0} className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Importing...' : `Import ${parsedData.length} Payments`}
                    </button>
                </div>
            </div>
        </div>
    );
};
