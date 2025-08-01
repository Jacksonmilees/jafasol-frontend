
import React, { useState, useRef, useEffect } from 'react';
import { LearningResource } from '../../types';
import { MoreHorizontalIcon, DownloadIcon, TrashIcon, PencilIcon, LinkIcon } from '../icons';

interface ResourceRowProps {
    resource: LearningResource;
    onEdit: (resource: LearningResource) => void;
    onDelete: (resource: LearningResource) => void;
}

const getResourceTypeIcon = (type: LearningResource['resourceType']) => {
    if (type.includes('PDF')) return <span className="text-xs font-bold text-red-600">PDF</span>;
    if (type.includes('DOC')) return <span className="text-xs font-bold text-blue-600">DOC</span>;
    if (type.includes('Video')) return <span className="text-xs font-bold text-indigo-600">URL</span>;
    return null;
}

export const ResourceRow: React.FC<ResourceRowProps> = ({ resource, onEdit, onDelete }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    const isLink = resource.resourceType === 'Video Link';
    const ActionIcon = isLink ? LinkIcon : DownloadIcon;
    const actionText = isLink ? 'Open Link' : 'Download';

    return (
        <tr className="border-b border-slate-200 hover:bg-slate-50">
            <td className="py-3 px-6">
                <p className="font-semibold text-slate-800">{resource.title}</p>
                <p className="text-xs text-slate-500 max-w-xs truncate" title={resource.description}>{resource.description}</p>
            </td>
            <td className="py-3 px-6 text-slate-600">{resource.subject}</td>
            <td className="py-3 px-6 text-slate-600">{resource.formClass}</td>
            <td className="py-3 px-6 text-slate-600">
                <div className="flex items-center space-x-2">
                    {getResourceTypeIcon(resource.resourceType)}
                    <span>{resource.resourceType}</span>
                </div>
            </td>
            <td className="py-3 px-6">
                 <p className="text-slate-600">{resource.uploaderName}</p>
                 <p className="text-xs text-slate-500">{resource.uploadDate}</p>
            </td>
            <td className="py-3 px-6 text-right">
                <div className="relative" ref={menuRef}>
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)} 
                        className="p-2 rounded-md hover:bg-slate-200 transition-colors" 
                        aria-label={`Actions for ${resource.title}`}
                    >
                        <MoreHorizontalIcon className="h-5 w-5 text-slate-500" />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-slate-200/80">
                            <div className="py-1" role="menu">
                                <a href={resource.fileUrl} target={isLink ? "_blank" : "_self"} rel="noopener noreferrer" download={!isLink} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" role="menuitem">
                                    <ActionIcon className="w-4 h-4 mr-3" />
                                    {actionText}
                                </a>
                                <button onClick={() => { onEdit(resource); setIsMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" role="menuitem">
                                    <PencilIcon className="w-4 h-4 mr-3" />
                                    Edit
                                </button>
                                <button onClick={() => { onDelete(resource); setIsMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50" role="menuitem">
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
