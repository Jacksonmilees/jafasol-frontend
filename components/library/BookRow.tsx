import React from 'react';
import { Book } from '../../types';
import { MoreHorizontalIcon } from '../icons';

export const BookRow: React.FC<{ book: Book }> = ({ book }) => {
    return (
        <tr className="border-b border-slate-200 hover:bg-slate-50">
            <td className="py-3 px-6">
                <p className="font-semibold text-slate-800">{book.title}</p>
                <p className="text-xs text-slate-500">ISBN: {book.isbn}</p>
            </td>
            <td className="py-3 px-6 text-slate-600">{book.author}</td>
            <td className="py-3 px-6 text-slate-600">{book.availableCopies} / {book.totalCopies}</td>
            <td className="py-3 px-6 text-right">
                <button className="p-2 rounded-md hover:bg-slate-200 transition-colors" aria-label={`Actions for ${book.title}`}>
                    <MoreHorizontalIcon className="h-5 w-5 text-slate-500" />
                </button>
            </td>
        </tr>
    );
};
