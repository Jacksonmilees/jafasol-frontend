import React from 'react';
import { Wand2Icon } from '../icons';

export const GeminiBanner: React.FC<{ onAskGemini: () => void }> = ({ onAskGemini }) => (
    <div className="bg-teal-700 rounded-xl p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-lg">
        <div className="flex items-center">
            <Wand2Icon className="h-10 w-10 mr-6 hidden md:block" />
            <div>
                <h3 className="text-xl font-bold">Gemini-Powered Analytics</h3>
                <p className="opacity-80 mt-1 max-w-2xl">Ask complex questions in natural language and get instant, data-driven answers. For example: "Which Form 3 students are at risk of failing Mathematics based on their CAT 1 results and attendance?"</p>
            </div>
        </div>
            <button 
                onClick={onAskGemini}
                className="mt-6 md:mt-0 px-5 py-2.5 bg-white text-teal-700 font-semibold rounded-lg hover:bg-teal-50 transition flex-shrink-0"
            >
            Ask Gemini
        </button>
    </div>
);