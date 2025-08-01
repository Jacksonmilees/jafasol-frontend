import React from 'react';
import { Subject } from '../../types';
import { MoreHorizontalIcon } from '../icons';

export const SubjectRow: React.FC<{ subject: Subject }> = ({ subject }) => {
    return (
        <tr className="border-b border-slate-200 hover:bg-slate-50">
            <td className="py-3 px-6">
                <p className="font-semibold text-slate-800">{subject.name}</p>
                <p className="text-xs text-slate-500">{subject.code}</p>
            </td>
            <td className="py-3 px-6 text-slate-600">{subject.curriculum}</td>
            <td className="py-3 px-6 text-slate-600">Form {subject.formLevels.join(', ')}</td>
            <td className="py-3 px-6 text-right">
                <button className="p-2 rounded-md hover:bg-slate-200 transition-colors" aria-label={`Actions for ${subject.name}`}>
                    <MoreHorizontalIcon className="h-5 w-5 text-slate-500" />
                </button>
            </td>
        </tr>
    );
};
