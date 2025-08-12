import React, { useState } from 'react';
import { Subject, SchoolClass, Teacher } from '../../types';
import { XIcon, Wand2Icon, SettingsIcon, ClockIcon, UsersIcon, BookOpenIcon } from '../icons';

interface TimetableGeneratorProps {
  subjects: Subject[];
  classes: SchoolClass[];
  teachers: Teacher[];
  academicYear: string;
  term: string;
  onGenerate: (settings: GenerationSettings) => void;
  onClose: () => void;
}

interface GenerationSettings {
  timetableType: 'Teaching' | 'Exam';
  optimizeFor: 'BalancedWorkload' | 'TeacherPreferences' | 'SubjectDistribution' | 'MinimizeConflicts';
  allowBackToBackDifficult: boolean;
  maxPeriodsPerDayPerTeacher: number;
  preferMorningForDifficult: boolean;
  includeSaturday: boolean;
  
  // Exam-specific settings
  examSettings?: {
    examDays: string[];
    maxExamsPerDay: number;
    minTimeBetweenExams: number;
    prioritizeCore: boolean;
  };
  
  // Advanced constraints
  constraints: {
    teacherUnavailability: Array<{
      teacherId: string;
      day: string;
      startTime: string;
      endTime: string;
    }>;
    subjectPreferences: Array<{
      subjectId: string;
      preferredDays: string[];
      preferredPeriods: string[];
    }>;
    classPreferences: Array<{
      classId: string;
      avoidedDays: string[];
      avoidedPeriods: string[];
    }>;
  };
}

export const TimetableGenerator: React.FC<TimetableGeneratorProps> = ({
  subjects,
  classes,
  teachers,
  academicYear,
  term,
  onGenerate,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [settings, setSettings] = useState<GenerationSettings>({
    timetableType: 'Teaching',
    optimizeFor: 'BalancedWorkload',
    allowBackToBackDifficult: false,
    maxPeriodsPerDayPerTeacher: 6,
    preferMorningForDifficult: true,
    includeSaturday: false,
    examSettings: {
      examDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      maxExamsPerDay: 3,
      minTimeBetweenExams: 60,
      prioritizeCore: true
    },
    constraints: {
      teacherUnavailability: [],
      subjectPreferences: [],
      classPreferences: []
    }
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onGenerate(settings);
    } catch (error) {
      console.error('Error generating timetable:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const addTeacherUnavailability = () => {
    setSettings(prev => ({
      ...prev,
      constraints: {
        ...prev.constraints,
        teacherUnavailability: [
          ...prev.constraints.teacherUnavailability,
          {
            teacherId: '',
            day: 'Monday',
            startTime: '08:00',
            endTime: '09:00'
          }
        ]
      }
    }));
  };

  const removeTeacherUnavailability = (index: number) => {
    setSettings(prev => ({
      ...prev,
      constraints: {
        ...prev.constraints,
        teacherUnavailability: prev.constraints.teacherUnavailability.filter((_, i) => i !== index)
      }
    }));
  };

  const updateTeacherUnavailability = (index: number, field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      constraints: {
        ...prev.constraints,
        teacherUnavailability: prev.constraints.teacherUnavailability.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Wand2Icon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Basic Settings</h3>
        <p className="text-gray-600">Configure the basic parameters for timetable generation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timetable Type
          </label>
          <select
            value={settings.timetableType}
            onChange={(e) => setSettings(prev => ({ ...prev, timetableType: e.target.value as any }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            <option value="Teaching">Teaching Timetable</option>
            <option value="Exam">Exam Timetable</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Optimize For
          </label>
          <select
            value={settings.optimizeFor}
            onChange={(e) => setSettings(prev => ({ ...prev, optimizeFor: e.target.value as any }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            <option value="BalancedWorkload">Balanced Teacher Workload</option>
            <option value="TeacherPreferences">Teacher Preferences</option>
            <option value="SubjectDistribution">Even Subject Distribution</option>
            <option value="MinimizeConflicts">Minimize Conflicts</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Periods per Day (Per Teacher)
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={settings.maxPeriodsPerDayPerTeacher}
            onChange={(e) => setSettings(prev => ({ 
              ...prev, 
              maxPeriodsPerDayPerTeacher: parseInt(e.target.value) || 6 
            }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="preferMorningForDifficult"
              checked={settings.preferMorningForDifficult}
              onChange={(e) => setSettings(prev => ({ 
                ...prev, 
                preferMorningForDifficult: e.target.checked 
              }))}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="preferMorningForDifficult" className="ml-2 text-sm text-gray-700">
              Prefer morning slots for difficult subjects
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="allowBackToBackDifficult"
              checked={settings.allowBackToBackDifficult}
              onChange={(e) => setSettings(prev => ({ 
                ...prev, 
                allowBackToBackDifficult: e.target.checked 
              }))}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="allowBackToBackDifficult" className="ml-2 text-sm text-gray-700">
              Allow back-to-back difficult subjects
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeSaturday"
              checked={settings.includeSaturday}
              onChange={(e) => setSettings(prev => ({ 
                ...prev, 
                includeSaturday: e.target.checked 
              }))}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="includeSaturday" className="ml-2 text-sm text-gray-700">
              Include Saturday in timetable
            </label>
          </div>
        </div>
      </div>

      {settings.timetableType === 'Exam' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h4 className="text-md font-medium text-yellow-900 mb-4">Exam-Specific Settings</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Exams per Day
              </label>
              <input
                type="number"
                min="1"
                max="6"
                value={settings.examSettings?.maxExamsPerDay || 3}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev,
                  examSettings: {
                    ...prev.examSettings!,
                    maxExamsPerDay: parseInt(e.target.value) || 3
                  }
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Time Between Exams (minutes)
              </label>
              <input
                type="number"
                min="30"
                max="180"
                value={settings.examSettings?.minTimeBetweenExams || 60}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev,
                  examSettings: {
                    ...prev.examSettings!,
                    minTimeBetweenExams: parseInt(e.target.value) || 60
                  }
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="prioritizeCore"
                checked={settings.examSettings?.prioritizeCore || false}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev,
                  examSettings: {
                    ...prev.examSettings!,
                    prioritizeCore: e.target.checked
                  }
                }))}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="prioritizeCore" className="ml-2 text-sm text-gray-700">
                Prioritize core subjects for better time slots
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <SettingsIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Constraints</h3>
        <p className="text-gray-600">Configure specific constraints and preferences</p>
      </div>

      {/* Teacher Unavailability */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-medium text-gray-900">Teacher Unavailability</h4>
          <button
            onClick={addTeacherUnavailability}
            className="px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
          >
            Add Constraint
          </button>
        </div>

        <div className="space-y-3">
          {settings.constraints.teacherUnavailability.map((constraint, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <select
                value={constraint.teacherId}
                onChange={(e) => updateTeacherUnavailability(index, 'teacherId', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="">Select Teacher</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.firstName} {teacher.lastName}
                  </option>
                ))}
              </select>

              <select
                value={constraint.day}
                onChange={(e) => updateTeacherUnavailability(index, 'day', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
              </select>

              <input
                type="time"
                value={constraint.startTime}
                onChange={(e) => updateTeacherUnavailability(index, 'startTime', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />

              <input
                type="time"
                value={constraint.endTime}
                onChange={(e) => updateTeacherUnavailability(index, 'endTime', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />

              <button
                onClick={() => removeTeacherUnavailability(index)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          ))}

          {settings.constraints.teacherUnavailability.length === 0 && (
            <div className="text-center text-gray-500 py-6">
              No teacher unavailability constraints added
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <ClockIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Review & Generate</h3>
        <p className="text-gray-600">Review your settings and generate the timetable</p>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Generation Summary</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Type:</span> {settings.timetableType}
          </div>
          <div>
            <span className="font-medium">Optimization:</span> {settings.optimizeFor}
          </div>
          <div>
            <span className="font-medium">Max Periods/Day:</span> {settings.maxPeriodsPerDayPerTeacher}
          </div>
          <div>
            <span className="font-medium">Include Saturday:</span> {settings.includeSaturday ? 'Yes' : 'No'}
          </div>
          <div>
            <span className="font-medium">Prefer Morning (Difficult):</span> {settings.preferMorningForDifficult ? 'Yes' : 'No'}
          </div>
          <div>
            <span className="font-medium">Back-to-back Difficult:</span> {settings.allowBackToBackDifficult ? 'Allowed' : 'Avoided'}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <div className="flex items-center">
              <BookOpenIcon className="h-6 w-6 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-900">Subjects</p>
                <p className="text-lg font-bold text-blue-600">{subjects.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-100 p-4 rounded-lg">
            <div className="flex items-center">
              <UsersIcon className="h-6 w-6 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-900">Classes</p>
                <p className="text-lg font-bold text-green-600">{classes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-100 p-4 rounded-lg">
            <div className="flex items-center">
              <UsersIcon className="h-6 w-6 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-900">Teachers</p>
                <p className="text-lg font-bold text-purple-600">{teachers.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning about generation time */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <ClockIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-yellow-900">Generation Time</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Generating a timetable may take several minutes depending on the complexity and number of constraints.
              The system will optimize the schedule to minimize conflicts and meet your preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const totalSteps = 3;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Timetable Generator</h2>
            <p className="text-gray-600 mt-1">{academicYear} - {term}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <XIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            {Array.from({ length: totalSteps }, (_, i) => (
              <React.Fragment key={i}>
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium
                  ${currentStep > i + 1 ? 'bg-indigo-600 border-indigo-600 text-white' :
                    currentStep === i + 1 ? 'border-indigo-600 text-indigo-600' :
                    'border-gray-300 text-gray-400'}
                `}>
                  {i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`
                    flex-1 h-1 mx-4
                    ${currentStep > i + 1 ? 'bg-indigo-600' : 'bg-gray-200'}
                  `} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 rounded-b-2xl flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-3 bg-white text-gray-700 border border-gray-300 font-medium rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white text-gray-700 border border-gray-300 font-medium rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2Icon className="h-4 w-4 mr-2 inline" />
                    Generate Timetable
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};



