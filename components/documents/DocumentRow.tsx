
import React, { useState, useEffect, useRef } from 'react';
import { Document } from '../../types';
import { MoreHorizontalIcon, DownloadIcon, TrashIcon } from '../icons';

interface DocumentRowProps {
    document: Document;
    onDelete: (document: Document) => void;
}

export const DocumentRow: React.FC<DocumentRowProps> = ({ document: doc, onDelete }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    return (
        <tr className="border-b border-slate-200 hover:bg-slate-50">
            <td className="py-3 px-6">
                 <p className="font-semibold text-slate-800">{doc.name}</p>
                 <p className="text-xs text-slate-500">{doc.id}</p>
            </td>
            <td className="py-3 px-6 text-slate-600">{doc.studentName}</td>
            <td className="py-3 px-6 text-slate-600">{doc.type}</td>
            <td className="py-3 px-6 text-slate-600">{doc.uploadDate}</td>
            <td className="py-3 px-6 text-right">
                <div className="relative" ref={menuRef}>
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)} 
                        className="p-2 rounded-md hover:bg-slate-200 transition-colors" 
                        aria-label={`Actions for ${doc.name}`}
                        aria-haspopup="true"
                        aria-expanded={isMenuOpen}
                    >
                        <MoreHorizontalIcon className="h-5 w-5 text-slate-500" />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-slate-200/80">
                            <div className="py-1" role="menu" aria-orientation="vertical">
                                <a href={doc.fileUrl} download className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" role="menuitem">
                                    <DownloadIcon className="w-4 h-4 mr-3" />
                                    Download
                                </a>
                                <button onClick={() => { onDelete(doc); setIsMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50" role="menuitem">
                                    <TrashIcon className="w-4 h-4 mr-3" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );
};
