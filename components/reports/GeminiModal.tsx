import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Wand2Icon, XIcon, LinkIcon } from '../icons';
import { GroundingChunk } from '../../types';


export const GeminiModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');
    const [error, setError] = useState('');
    const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);

    useEffect(() => {
        if (!isOpen) {
            // Reset state when modal is closed
            setPrompt('');
            setLoading(false);
            setResponse('');
            setError('');
            setGroundingChunks([]);
        }
    }, [isOpen]);

    const handleGenerate = async () => {
        if (!prompt) return;
        setLoading(true);
        setResponse('');
        setError('');
        setGroundingChunks([]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                },
            });

            setResponse(result.text);

            const chunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (chunks) {
                setGroundingChunks(chunks as GroundingChunk[]);
            }

        } catch (e: any) {
            console.error(e);
            setError(e.message || 'An error occurred while generating the report.');
        } finally {
            setLoading(false);
        }
    };

    const examplePrompts = [
        'Which students have attendance below 85%?',
        'Show me the top 5 performers in the last math exam.',
        'What is the fee balance for students in Form 4?',
        'Who won the most medals in the Paris Olympics 2024?'
    ];
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" role="dialog" aria-modal="true">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <Wand2Icon className="h-6 w-6 text-teal-600 mr-3" />
                        <h2 className="text-xl font-semibold text-gray-800">Ask Gemini for AI-Powered Insights</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close">
                        <XIcon className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    <div className="space-y-4">
                        <label htmlFor="gemini-prompt" className="font-medium text-gray-700">Your Question</label>
                        <textarea
                            id="gemini-prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., Which Form 3 students are at risk of failing based on their recent results?"
                            className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                            disabled={loading}
                        />
                         <div className="text-sm text-gray-500">
                            Or try an example:
                            <div className="flex flex-wrap gap-2 mt-2">
                                {examplePrompts.map(p => (
                                    <button key={p} onClick={() => setPrompt(p)} disabled={loading} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium transition">
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {(loading || response || error) && (
                         <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Generated Report</h3>
                            {loading && (
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600"></div>
                                    <span>Generating...</span>
                                </div>
                            )}
                            {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}
                            {response && <pre className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap font-sans text-sm">{response}</pre>}
                            {groundingChunks.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-sm font-semibold text-gray-600 mb-2">Sources from Google Search:</h4>
                                    <ul className="space-y-1">
                                        {groundingChunks.map((chunk, index) => (
                                            <li key={index} className="flex items-center">
                                                <LinkIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                                                <a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-sm text-teal-600 hover:underline truncate">
                                                    {chunk.web.title || chunk.web.uri}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-200 rounded-b-2xl flex justify-end space-x-3">
                    <button onClick={onClose} disabled={loading} className="px-4 py-2 bg-white text-gray-700 border border-gray-300 font-medium rounded-lg hover:bg-gray-100 transition disabled:opacity-50">
                        Cancel
                    </button>
                    <button onClick={handleGenerate} disabled={loading || !prompt} className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Generating...' : 'Generate'}
                    </button>
                </div>
            </div>
        </div>
    );
};