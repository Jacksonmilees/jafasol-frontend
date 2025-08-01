import React, { useMemo, useState } from 'react';
import { MOCK_STUDENTS, MOCK_FEE_INVOICES, MOCK_FEE_PAYMENTS, MOCK_FEE_STRUCTURE } from '../constants';
import { Student, FeePayment, FeeStructure } from '../types';
import { DollarSignIcon, TrendingUpIcon, UsersIcon, PlusIcon, UploadCloudIcon } from './icons';
import { FeeStatCard } from './fees/FeeStatCard';
import { StudentFeeRow } from './fees/StudentFeeRow';
import { RecordPaymentModal } from './fees/RecordPaymentModal';
import { StudentFeeStatementModal } from './fees/StudentFeeStatementModal';
import { FeeStructureList } from './fees/FeeStructureList';
import { AddFeeStructureModal } from './fees/AddFeeStructureModal';
import { BulkPaymentModal } from './fees/BulkPaymentModal';

const Fees: React.FC = () => {
    const [payments, setPayments] = useState<FeePayment[]>(MOCK_FEE_PAYMENTS);
    const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(MOCK_FEE_STRUCTURE);
    const [activeTab, setActiveTab] = useState<'Status' | 'Structure'>('Status');

    const [studentForPayment, setStudentForPayment] = useState<Student | null>(null);
    const [studentForStatement, setStudentForStatement] = useState<Student | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isBulkPaymentModalOpen, setIsBulkPaymentModalOpen] = useState(false);


    const feeData = useMemo(() => {
        const studentFeeDetails = MOCK_STUDENTS.map(student => {
            const invoices = MOCK_FEE_INVOICES.filter(inv => inv.studentId === student.id);
            const studentPayments = payments.filter(pay => pay.studentId === student.id);

            const totalBilled = invoices.reduce((acc, inv) => acc + inv.amount, 0);
            const totalPaid = studentPayments.reduce((acc, pay) => acc + pay.amount, 0);
            const balance = totalBilled - totalPaid;

            return {
                student,
                totalBilled,
                totalPaid,
                balance,
            };
        });

        const totalBilled = studentFeeDetails.reduce((acc, item) => acc + item.totalBilled, 0);
        const totalCollected = studentFeeDetails.reduce((acc, item) => acc + item.totalPaid, 0);
        const totalOutstanding = totalBilled - totalCollected;

        return { studentFeeDetails, totalBilled, totalCollected, totalOutstanding };
    }, [payments]);

    const handleRecordPayment = (student: Student, amount: number, method: 'Mpesa' | 'Bank' | 'Cash', date: string) => {
        const newPayment: FeePayment = {
            id: `PAY-${Date.now()}`,
            studentId: student.id,
            amount,
            method,
            date,
        };
        setPayments(prev => [...prev, newPayment]);
        setStudentForPayment(null);
    };

    const handleAddFeeStructure = (newFeeItem: Omit<FeeStructure, 'id'>) => {
        const newStructure: FeeStructure = {
            id: `FS${(feeStructures.length + 10).toString()}`,
            ...newFeeItem
        };
        setFeeStructures(prev => [newStructure, ...prev]);
        setIsAddModalOpen(false);
    };
    
    const handleBulkAddPayments = (data: { studentId: string; amount: number; method: 'Mpesa' | 'Bank' | 'Cash'; date: string }[]) => {
        const newPayments: FeePayment[] = data.map(item => ({
            id: `PAY-BULK-${Date.now()}-${Math.random()}`,
            ...item,
        }));
        setPayments(prev => [...prev, ...newPayments]);
        setIsBulkPaymentModalOpen(false);
    };

    return (
        <>
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Fee Management</h2>
                <p className="text-gray-500 mt-1">Track student balances, payments, and fee structures.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FeeStatCard title="Total Billed" amount={feeData.totalBilled} icon={<UsersIcon className="h-6 w-6 text-blue-500" />} />
                <FeeStatCard title="Total Collected" amount={feeData.totalCollected} icon={<DollarSignIcon className="h-6 w-6 text-green-500" />} />
                <FeeStatCard title="Total Outstanding" amount={feeData.totalOutstanding} icon={<TrendingUpIcon className="h-6 w-6 text-amber-500" />} />
            </div>

            <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6 px-6" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('Status')}
                            className={`shrink-0 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                                activeTab === 'Status'
                                    ? 'border-teal-500 text-teal-600'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            }`}
                        >
                            Student Fee Status
                        </button>
                        <button
                            onClick={() => setActiveTab('Structure')}
                            className={`shrink-0 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                                activeTab === 'Structure'
                                    ? 'border-teal-500 text-teal-600'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            }`}
                        >
                            Fee Structure Setup
                        </button>
                    </nav>
                </div>
                
                {activeTab === 'Status' ? (
                    <>
                        <div className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Student Fee Status</h3>
                                <p className="text-sm text-gray-500 mt-1">Overview of all student accounts.</p>
                            </div>
                            <div className="flex items-center space-x-2 mt-4 md:mt-0">
                                 <button 
                                    onClick={() => setIsBulkPaymentModalOpen(true)}
                                    className="flex items-center justify-center px-4 py-2 bg-white text-gray-700 border border-gray-300 font-medium rounded-lg hover:bg-gray-50 transition whitespace-nowrap">
                                    <UploadCloudIcon className="h-5 w-5 mr-2" />
                                    Bulk Record Payments
                                </button>
                                <button className="flex items-center justify-center px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition whitespace-nowrap">
                                    <PlusIcon className="h-5 w-5 mr-2" />
                                    Bulk Invoicing
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                                    <tr>
                                        <th scope="col" className="py-3 px-6 font-medium">Student</th>
                                        <th scope="col" className="py-3 px-6 font-medium">Total Billed</th>
                                        <th scope="col" className="py-3 px-6 font-medium">Total Paid</th>
                                        <th scope="col" className="py-3 px-6 font-medium">Balance</th>
                                        <th scope="col" className="py-3 px-6 font-medium text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {feeData.studentFeeDetails.map(item => (
                                        <StudentFeeRow 
                                            key={item.student.id} 
                                            feeDetails={item}
                                            onRecordPayment={() => setStudentForPayment(item.student)}
                                            onViewStatement={() => setStudentForStatement(item.student)}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <FeeStructureList 
                        feeStructures={feeStructures}
                        onAddFeeStructure={() => setIsAddModalOpen(true)}
                    />
                )}
            </div>
        </div>

        {studentForPayment && (
            <RecordPaymentModal 
                student={studentForPayment} 
                onClose={() => setStudentForPayment(null)} 
                onSave={handleRecordPayment}
            />
        )}
        {studentForStatement && (
            <StudentFeeStatementModal
                student={studentForStatement}
                onClose={() => setStudentForStatement(null)}
            />
        )}
        {isAddModalOpen && (
            <AddFeeStructureModal
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddFeeStructure}
            />
        )}
        {isBulkPaymentModalOpen && (
            <BulkPaymentModal
                onClose={() => setIsBulkPaymentModalOpen(false)}
                onImport={handleBulkAddPayments}
            />
        )}
        </>
    );
};

export default Fees;