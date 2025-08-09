
import React from 'react';
import { Exam } from '../../types';
import { MoreHorizontalIcon, ClipboardListIcon, LockIcon, UnlockIcon, TrashIcon } from '../icons';

interface ExamRowProps {
  exam: Exam;
  onManageResults: (exam: Exam) => void;
  onToggleLock: (examId: string) => void;
  onDelete: (examId: string) => void;
  canManage: boolean;
}

export const ExamRow: React.FC<ExamRowProps> = ({ exam, onManageResults, onToggleLock, onDelete, canManage }) => {
  const statusColors: Record<Exam['status'], string> = {
    Upcoming: 'bg-blue-100 text-blue-800',
    Ongoing: 'bg-yellow-100 text-yellow-800',
    Completed: 'bg-green-100 text-green-800',
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${exam.name}?`)) {
      onDelete(exam.id);
    }
  };

  const renderActions = () => {
    if (exam.status !== 'Completed') {
      return (
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-md hover:bg-slate-200 transition-colors" aria-label={`Actions for ${exam.name}`}>
            <MoreHorizontalIcon className="h-5 w-5 text-slate-500" />
          </button>
          {canManage && (
            <button
              onClick={handleDelete}
              className="flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 border border-red-200 text-sm font-medium rounded-lg hover:bg-red-200"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete
            </button>
          )}
        </div>
      );
    }

    if (canManage) {
      return (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onManageResults(exam)}
            className="flex items-center justify-center px-3 py-2 bg-white text-slate-700 border border-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50"
          >
            <ClipboardListIcon className="h-4 w-4 mr-2" />
            Results
          </button>
          <button
            onClick={() => onToggleLock(exam.id)}
            className={`flex items-center justify-center px-3 py-2 border text-sm font-medium rounded-lg ${
              exam.marksLocked
                ? 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200'
                : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {exam.marksLocked ? <UnlockIcon className="h-4 w-4 mr-2" /> : <LockIcon className="h-4 w-4 mr-2" />}
            {exam.marksLocked ? 'Unlock' : 'Lock'}
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 border border-red-200 text-sm font-medium rounded-lg hover:bg-red-200"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={() => onManageResults(exam)}
        className="flex items-center justify-center px-3 py-2 bg-white text-slate-700 border border-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition whitespace-nowrap"
      >
        <ClipboardListIcon className="h-4 w-4 mr-2" />
        Manage Results
      </button>
    );
  };

  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50">
      <td className="py-3 px-6">
        <p className="font-semibold text-slate-800">{exam.name}</p>
        <p className="text-xs text-slate-500">{exam.type}</p>
      </td>
      <td className="py-3 px-6 text-slate-600">{exam.term}</td>
      <td className="py-3 px-6 text-slate-600">{exam.startDate}</td>
      <td className="py-3 px-6">
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[exam.status]}`}>
          {exam.status}
        </span>
        {exam.marksLocked && <LockIcon className="h-4 w-4 inline-block ml-2 text-slate-500" title="Marks are locked" />}
      </td>
      <td className="py-3 px-6 text-left">{renderActions()}</td>
    </tr>
  );
};
