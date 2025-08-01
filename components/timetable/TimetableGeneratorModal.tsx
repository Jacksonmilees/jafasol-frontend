
import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Wand2Icon, XIcon } from '../icons';
import { MOCK_CLASSES, MOCK_TEACHERS, MOCK_SUBJECTS } from '../../constants';
import { TimetableEntry } from '../../types';

export const TimetableGeneratorModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [selectedClassId, setSelectedClassId] = useState<string>(MOCK_CLASSES[0]?.id || '');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<TimetableEntry[] | null>(null);
    const [error, setError] = useState('');

    const generatePrompt = () => {
        const schoolClass = MOCK_CLASSES.find(c => c.id === selectedClassId);
        if (!schoolClass) return '';

        const classSubjects = MOCK_SUBJECTS.filter(s => s.formLevels.includes(schoolClass.formLevel));
        const teachersForClass = MOCK_TEACHERS.filter(t => t.classes.includes(schoolClass.name));
        
        let prompt = `Generate a 5-day school timetable for ${schoolClass.name}.`;
        prompt += ` The school day is from 8:00 AM to 4:00 PM, with 40-minute lessons. Include a 20-minute break around 10:00 AM and a 60-minute lunch break around 1:00 PM.`;
        prompt += ` The subjects for this class are: ${classSubjects.map(s => s.name).join(', ')}.`;
        prompt += ` The available teachers who teach this class are: ${teachersForClass.map(t => `${t.name} (teaches ${t.subjects.join('/')})`).join(', ')}.`;
        prompt += ` Please assign teachers to the subjects they teach. Do not schedule a teacher for two different classes at the same time.`;
        prompt += ` Structure the response as JSON according to the provided schema. For breaks, return an object with 'isBreak' set to true.`;

        return prompt;
    };

    const handleGenerate = async () => {
        const prompt = generatePrompt();
        if (!prompt) {
            setError('Could not generate prompt. Please select a valid class.');
            return;
        }

        setLoading(true);
        setResponse(null);
        setError('');

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                timetable: {
                    type: Type.ARRAY,
                    description: "An array of timetable entries for each time slot.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            time: { type: Type.STRING, description: "The time slot, e.g., '08:00 - 08:40'." },
                            monday: { type: Type.OBJECT, properties: { isBreak: {type: Type.BOOLEAN}, subject: { type: Type.STRING }, teacher: { type: Type.STRING } }, nullable: true },
                            tuesday: { type: Type.OBJECT, properties: { isBreak: {type: Type.BOOLEAN}, subject: { type: Type.STRING }, teacher: { type: Type.STRING } }, nullable: true },
                            wednesday: { type: Type.OBJECT, properties: { isBreak: {type: Type.BOOLEAN}, subject: { type: Type.STRING }, teacher: { type: Type.STRING } }, nullable: true },
                            thursday: { type: Type.OBJECT, properties: { isBreak: {type: Type.BOOLEAN}, subject: { type: Type.STRING }, teacher: { type: Type.STRING } }, nullable: true },
                            friday: { type: Type.OBJECT, properties: { isBreak: {type: Type.BOOLEAN}, subject: { type: Type.STRING }, teacher: { type: Type.STRING } }, nullable: true },
                        }
                    }
                }
            }
        };


        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                 config: {
                    temperature: 0.2,
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                },
            });
            const parsed = JSON.parse(result.text);
            setResponse(parsed.timetable);

        } catch (e: any) {
            console.error(e);
            setError(e.message || 'An error occurred while generating the timetable. The model may have returned an invalid format.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" role="dialog" aria-modal="true">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div className="flex items-center">
                        <Wand2Icon className="h-6 w-6 text-indigo-600 mr-3" />
                        <h2 className="text-xl font-semibold text-slate-800">AI Timetable Generator</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100" aria-label="Close">
                        <XIcon className="h-6 w-6 text-slate-500" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    <div className="space-y-4">
                        <label htmlFor="class-select" className="font-medium text-slate-700">Select a Class to Generate Timetable For</label>
                        <select
                            id="class-select"
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(e.target.value)}
                            className="w-full md:w-1/2 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            disabled={loading}
                        >
                            {MOCK_CLASSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    
                    {(loading || response || error) && (
                         <div className="mt-6 pt-6 border-t border-slate-200">
                            <h3 className="text-lg font-medium text-slate-800 mb-4">Generated Timetable Suggestion</h3>
                            {loading && (
                                <div className="flex items-center space-x-2 text-slate-600">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                                    <span>Generating... please wait.</span>
                                </div>
                            )}
                            {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}
                            {response && (
                                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                                            <tr>
                                                <th className="py-2 px-3 font-medium">Time</th>
                                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                                                    <th key={day} className="py-2 px-3 font-medium text-center">{day}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200">
                                            {response.map((row, idx) => (
                                                <tr key={idx}>
                                                    <td className="py-2 px-3 font-semibold bg-slate-50">{row.time}</td>
                                                    {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const).map(day => {
                                                        const entry = row[day] as any;
                                                        if (!entry || entry.isBreak) {
                                                            return <td key={day} className="py-2 px-3 text-center text-slate-400 text-xs">Break</td>
                                                        }
                                                        return (
                                                             <td key={day} className="py-2 px-3 text-center">
                                                                <p className="font-semibold text-indigo-800 text-xs">{entry.subject}</p>
                                                                <p className="text-[10px] text-slate-500">{entry.teacher}</p>
                                                            </td>
                                                        )
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex justify-end space-x-3">
                    <button onClick={onClose} disabled={loading} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 font-medium rounded-lg hover:bg-slate-100 transition disabled:opacity-50">
                        Cancel
                    </button>
                    <button onClick={handleGenerate} disabled={loading || !selectedClassId} className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Generating...' : 'Generate'}
                    </button>
                </div>
            </div>
        </div>
    );
};