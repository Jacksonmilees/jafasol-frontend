
import React from 'react';
import { Student } from '../../types';
import { CreditCardIcon, FileTextIcon } from '../icons';

interface StudentFeeRowProps {
  student: Student;
  totalBilled: number;
  totalPaid: number;
  balance: number;
  onRecordPayment: (student: Student) => void;
  onViewStatement: (student: Student) => void;
}

export const StudentFeeRow: React.FC<StudentFeeRowProps> = ({
  student,
  totalBilled,
  totalPaid,
  balance,
  onRecordPayment,
  onViewStatement,
}) => {
  const balanceColor = balance > 0 ? 'text-amber-600' : 'text-green-600';

  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50">
      <td className="py-3 px-6">
        <div className="flex items-center">
          <img
            className="h-9 w-9 rounded-full object-cover"
            src={student.avatarUrl}
            alt={`${student.firstName} ${student.lastName}`}
          />
          <div className="ml-3">
            <p className="font-semibold text-slate-800">
              {student.firstName} {student.lastName}
            </p>
            <p className="text-xs text-slate-500">
              {student.admissionNumber} | {student.formClass} {student.stream}
            </p>
          </div>
        </div>
      </td>
      <td className="py-3 px-6 text-slate-600">
        {totalBilled.toLocaleString('en-US', { style: 'currency', currency: 'KES' })}
      </td>
      <td className="py-3 px-6 text-slate-600">
        {totalPaid.toLocaleString('en-US', { style: 'currency', currency: 'KES' })}
      </td>
      <td className={`py-3 px-6 font-semibold ${balanceColor}`}>
        {balance.toLocaleString('en-US', { style: 'currency', currency: 'KES' })}
      </td>
      <td className="py-3 px-6 text-center">
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => onRecordPayment(student)}
            className="p-2 rounded-md hover:bg-slate-200 transition-colors"
            title="Record Payment"
          >
            <CreditCardIcon className="h-5 w-5 text-slate-500" />
          </button>
          <button
            onClick={() => onViewStatement(student)}
            className="p-2 rounded-md hover:bg-slate-200 transition-colors"
            title="View Statement"
          >
            <FileTextIcon className="h-5 w-5 text-slate-500" />
          </button>
        </div>
      </td>
    </tr>
  );
};