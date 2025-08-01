import React, { useState } from 'react';
import { MOCK_MESSAGES } from '../constants';
import { PlusIcon } from './icons';
import { MessageItem } from './communication/MessageItem';
import { ComposeMessageModal } from './communication/ComposeMessageModal';

const Communication: React.FC = () => {
    const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);

    const handleSendMessage = (recipient: string, subject: string, body: string) => {
        // In a real app, this would trigger an API call.
        // For this demo, we'll just show an alert.
        console.log(`Sending message to ${recipient}:\nSubject: ${subject}\nBody: ${body}`);
        alert(`Message successfully sent to ${recipient}!`);
        setIsComposeModalOpen(false);
    };

    return (
        <>
            <div className="space-y-8">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Communication Hub</h2>
                        <p className="text-gray-500 mt-1">Send and receive messages and notifications.</p>
                    </div>
                    <button
                        onClick={() => setIsComposeModalOpen(true)}
                        className="flex items-center justify-center px-4 py-2 mt-4 md:mt-0 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition whitespace-nowrap">
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Compose Message
                    </button>
                </div>

                <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
                    <div className="p-4 md:p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">Inbox</h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {MOCK_MESSAGES.map(msg => <MessageItem key={msg.id} message={msg} />)}
                    </div>
                     <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
                        <p>Showing 1 to {MOCK_MESSAGES.length} of {MOCK_MESSAGES.length} messages</p>
                        <div className="flex items-center space-x-2">
                            <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">Previous</button>
                            <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">Next</button>
                        </div>
                    </div>
                </div>
            </div>
            {isComposeModalOpen && (
                <ComposeMessageModal
                    onClose={() => setIsComposeModalOpen(false)}
                    onSend={handleSendMessage}
                />
            )}
        </>
    );
};

export default Communication;