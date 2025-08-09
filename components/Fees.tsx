import React, { useEffect, useMemo, useState } from 'react';
import { DollarSignIcon, TrendingUpIcon, UsersIcon, PlusIcon, UploadCloudIcon } from './icons';
import { FeeStatCard } from './fees/FeeStatCard';
import { StudentFeeRow } from './fees/StudentFeeRow';
import { RecordPaymentModal } from './fees/RecordPaymentModal';
import { StudentFeeStatementModal } from './fees/StudentFeeStatementModal';
import { FeeStructureList } from './fees/FeeStructureList';
import { AddFeeStructureModal } from './fees/AddFeeStructureModal';
import { BulkPaymentModal } from './fees/BulkPaymentModal';
import apiClient from '../api';
import { Student, FeePayment, FeeStructure, FeeInvoice } from '../types';

const Fees: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [invoices, setInvoices] = useState<FeeInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Status' | 'Structure'>('Status');

  const [studentForPayment, setStudentForPayment] = useState<Student | null>(null);
  const [studentForStatement, setStudentForStatement] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkPaymentModalOpen, setIsBulkPaymentModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [studentsResponse, paymentsResponse, structuresResponse, invoicesResponse] = await Promise.all([
        apiClient.getStudents({ limit: 100 }),
        apiClient.getFeePayments({ limit: 100 }),
        apiClient.getFeeStructures({ limit: 100 }),
        apiClient.getFeeInvoices({ limit: 100 }),
      ]);

      setStudents(studentsResponse.students || studentsResponse || []);
      setPayments(paymentsResponse.payments || paymentsResponse || []);
      setFeeStructures(structuresResponse.feeStructures || structuresResponse || []);
      setInvoices(invoicesResponse.invoices || invoicesResponse || []);
    } catch (e) {
      console.error('Failed to load fees data:', e);
      setError('Failed to load fees data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const feeData = useMemo(() => {
    const totalBilled = invoices.reduce((acc, inv) => acc + inv.amount, 0);
    const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0);
    const totalOutstanding = totalBilled - totalCollected;

    const studentFeeDetails = students.map(student => {
      const sInvoices = invoices.filter(i => i.studentId === student.id);
      const sPayments = payments.filter(p => p.studentId === student.id);
      const sBilled = sInvoices.reduce((acc, i) => acc + i.amount, 0);
      const sPaid = sPayments.reduce((acc, p) => acc + p.amount, 0);
      const sBalance = sBilled - sPaid;
      return {
        student,
        totalBilled: sBilled,
        totalPaid: sPaid,
        balance: sBalance,
      };
    });

    return { totalBilled, totalCollected, totalOutstanding, studentFeeDetails };
  }, [students, payments, invoices]);

  const handleRecordPayment = async (student: Student, amount: number, method: 'Mpesa' | 'Bank' | 'Cash', date: string) => {
    try {
      await apiClient.createFeePayment({
        studentId: student.id,
        amount,
        method,
        date,
      });
      await loadData();
      setStudentForPayment(null);
    } catch (e) {
      console.error('Failed to record payment:', e);
      setError('Failed to record payment. Please try again.');
    }
  };

  const handleAddFeeStructure = async (newFeeItem: Omit<FeeStructure, 'id'>) => {
    try {
      await apiClient.createFeeStructure({
        formLevel: newFeeItem.formLevel,
        amount: newFeeItem.amount,
        type: newFeeItem.type,
        term: newFeeItem.term,
        dueDate: newFeeItem.dueDate,
      });
      await loadData();
      setIsAddModalOpen(false);
    } catch (e) {
      console.error('Failed to add fee structure:', e);
      setError('Failed to add fee structure. Please try again.');
    }
  };

  const handleBulkAddPayments = async (data: { studentId: string; amount: number; method: 'Mpesa' | 'Bank' | 'Cash'; date: string }[]) => {
    try {
      await apiClient.bulkCreatePayments(data);
      await loadData();
      setIsBulkPaymentModalOpen(false);
    } catch (e) {
      console.error('Failed to bulk add payments:', e);
      setError('Failed to add payments. Please try again.');
    }
  };

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-6">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Fees Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={loadData} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">School Fees</h2>
          <p className="text-gray-500 mt-1">Manage fee structures, invoices and payments.</p>
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
                Fee Structure
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'Status' ? (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-800">Student Fee Balances</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsBulkPaymentModalOpen(true)}
                      className="flex items-center px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      <UploadCloudIcon className="h-4 w-4 mr-2" />
                      Bulk Payment
                    </button>
                  </div>
                </div>

                {students.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No students found. Please add students first.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {feeData.studentFeeDetails.map(item => (
                      <StudentFeeRow
                        key={item.student.id}
                        student={item.student}
                        totalBilled={item.totalBilled}
                        totalPaid={item.totalPaid}
                        balance={item.balance}
                        onRecordPayment={(student) => setStudentForPayment(student)}
                        onViewStatement={(student) => setStudentForStatement(student)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-800">Fee Structure</h3>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Fee Item
                  </button>
                </div>

                {feeStructures.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No fee structures found. Add fee structures to get started.
                  </div>
                ) : (
                  <FeeStructureList
                    feeStructures={feeStructures}
                    onAddFeeStructure={() => setIsAddModalOpen(true)}
                  />
                )}
              </div>
            )}
          </div>
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