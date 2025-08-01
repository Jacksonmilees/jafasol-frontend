import React from 'react';
import { Wand2Icon } from '../icons';

export const GeminiCard: React.FC = () => (
    <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col items-center justify-center text-center">
        <div className="p-4 bg-indigo-100 rounded-full">
            <Wand2Icon className="h-8 w-8 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mt-4">AI-Powered Insights</h3>
        <p className="text-sm text-slate-500 mt-1">Generate an AI report on student performance, attendance, or finances.</p>
        <button className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
            Generate with Gemini
        </button>
    </div>
);
