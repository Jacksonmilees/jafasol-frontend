import React, { useState, useEffect } from 'react';
import { ExamRow } from './exams/ExamRow';
import { ExamResults } from './exams/ExamResults';
import { Exam, User } from '../types';
import apiClient from '../api';
import { PlusIcon } from './icons';

interface ExamsProps {
  currentUser: User;
}

const Exams: React.FC<ExamsProps> = ({ currentUser }) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const loadExams = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.getExams({ limit: 100 });
      setExams(response.exams || response || []);
    } catch (e) {
      console.error('Failed to load exams:', e);
      setError('Failed to load exams. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  const handleToggleLock = async (examId: string) => {
    try {
      const exam = exams.find(e => e.id === examId);
      if (!exam) return;

      await apiClient.updateExam(examId, { marksLocked: !exam.marksLocked });
      await loadExams();
    } catch (e) {
      console.error('Failed to toggle exam lock:', e);
      setError('Failed to update exam. Please try again.');
    }
  };

  const handleCreateExam = async (examData: {
    name: string;
    type: 'CAT' | 'Mid-Term' | 'End-Term' | 'Mock';
    term: string;
    startDate: string;
    subjects: string[];
  }) => {
    try {
      await apiClient.createExam(examData);
      await loadExams();
    } catch (e) {
      console.error('Failed to create exam:', e);
      setError('Failed to create exam. Please try again.');
    }
  };

  const handleDeleteExam = async (examId: string) => {
    try {
      await apiClient.deleteExam(examId);
      await loadExams();
    } catch (e) {
      console.error('Failed to delete exam:', e);
      setError('Failed to delete exam. Please try again.');
    }
  };

  const handleManageResults = (exam: Exam) => {
    if (exam.status === 'Completed') {
      setSelectedExam(exam);
    } else {
      alert('You can only manage results for completed exams.');
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Exams</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadExams}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (selectedExam) {
    const currentExamState = exams.find(e => e.id === selectedExam.id) || selectedExam;
    return <ExamResults exam={currentExamState} onBack={() => setSelectedExam(null)} currentUser={currentUser} />;
  }

  const canManage = currentUser.role.name === 'Admin';

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm">
      <div className="p-4 md:p-6 border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Examinations</h2>
          <p className="text-sm text-gray-500 mt-1">
            {isLoading ? 'Loading exams...' : `Showing ${exams.length} exams`}
          </p>
        </div>
        <button
          onClick={() => {
            // Placeholder action for scheduling exam
            alert('Schedule Exam - coming soon');
          }}
          className="flex items-center justify-center px-4 py-2 mt-4 md:mt-0 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition whitespace-nowrap"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Schedule Exam
        </button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading exams...</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="py-3 px-6 font-medium">Exam Name</th>
                  <th scope="col" className="py-3 px-6 font-medium">Term</th>
                  <th scope="col" className="py-3 px-6 font-medium">Start Date</th>
                  <th scope="col" className="py-3 px-6 font-medium">Status</th>
                  <th scope="col" className="py-3 px-6 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {exams.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No exams found. Schedule an exam to get started.
                    </td>
                  </tr>
                ) : (
                  exams.map(exam => (
                    <ExamRow
                      key={exam.id}
                      exam={exam}
                      onManageResults={handleManageResults}
                      onToggleLock={handleToggleLock}
                      onDelete={handleDeleteExam}
                      canManage={canManage}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
          {exams.length > 0 && (
            <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
              <p>Showing 1 to {exams.length} of {exams.length} results</p>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">Previous</button>
                <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">Next</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Exams;