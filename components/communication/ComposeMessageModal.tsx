
import React, { useState } from 'react';
import { XIcon, SendIcon } from '../icons';

interface ComposeMessageModalProps {
    onClose: () => void;
    onSend: (recipient: string, subject: string, body: string) => void;
}

export const ComposeMessageModal: React.FC<ComposeMessageModalProps> = ({ onClose, onSend }) => {
    const [recipient, setRecipient] = useState('All Parents');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSend(recipient, subject, body);
    };

    const recipientGroups = [
        'All Parents',
        'All Teachers',
        'All Students',
        'Parents of Form 4',
        'Parents of Form 3',
        'Parents of Form 2',
        'Parents of Form 1',
        'Teachers of Form 4',
    ];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div className="flex items-center">
                        <SendIcon className="h-6 w-6 text-indigo-600 mr-3" />
                        <h2 className="text-xl font-semibold text-slate-800">Compose New Message</h2>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-100" aria-label="Close">
                        <XIcon className="h-6 w-6 text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div>
                        <label htmlFor="recipient" className="block text-sm font-medium text-slate-700 mb-1">Recipient Group</label>
                        <select
                            name="recipient"
                            id="recipient"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        >
                            {recipientGroups.map(group => <option key={group} value={group}>{group}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                        <input
                            type="text"
                            name="subject"
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="body" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                        <textarea
                            name="body"
                            id="body"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            rows={8}
                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            required
                        />
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 font-medium rounded-lg hover:bg-slate-100 transition">
                        Cancel
                    </button>
                    <button type="submit" className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                        <SendIcon className="h-5 w-5 mr-2" />
                        Send Message
                    </button>
                </div>
            </form>
        </div>
    );
};
