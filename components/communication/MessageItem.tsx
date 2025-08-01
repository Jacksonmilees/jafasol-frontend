import React from 'react';
import { Message } from '../../types';

export const MessageItem: React.FC<{ message: Message }> = ({ message }) => {
    return (
        <div className={`p-4 border-l-4 cursor-pointer hover:bg-gray-100 ${message.isRead ? 'border-transparent' : 'border-teal-500 bg-teal-50/50'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-semibold text-gray-800">{message.sender}</p>
                    <p className="text-sm font-medium text-gray-600 mt-1">{message.subject}</p>
                </div>
                <p className="text-xs text-gray-500 flex-shrink-0 ml-4">{message.timestamp}</p>
            </div>
            <p className="text-sm text-gray-500 mt-2">{message.preview}</p>
        </div>
    )
}