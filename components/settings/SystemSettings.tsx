


import React from 'react';
import { SaveIcon, DatabaseIcon } from '../icons';

interface SystemSettingsProps {
    schoolInfo: { name: string; motto: string };
    setSchoolInfo: React.Dispatch<React.SetStateAction<{ name: string; motto: string }>>;
    schoolLogo: string | null;
    setSchoolLogo: React.Dispatch<React.SetStateAction<string | null>>;
}

export const SystemSettings: React.FC<SystemSettingsProps> = ({ 
    schoolInfo, setSchoolInfo, 
    schoolLogo, setSchoolLogo
}) => {

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setSchoolLogo(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSaveChanges = () => {
        // In a real app, this would be an API call
        alert('System settings saved!');
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* School Info Card */}
                    <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm">
                        <div className="p-4 md:p-6 border-b border-slate-200">
                            <h3 className="text-lg font-medium leading-6 text-slate-900">School Information</h3>
                            <p className="mt-1 text-sm text-slate-500">Manage the school's name and official motto.</p>
                        </div>
                        <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="schoolName" className="block text-sm font-medium text-slate-700">School Name</label>
                                <input type="text" id="schoolName" value={schoolInfo.name} onChange={(e) => setSchoolInfo({...schoolInfo, name: e.target.value})} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="schoolMotto" className="block text-sm font-medium text-slate-700">School Motto</label>
                                <input type="text" id="schoolMotto" value={schoolInfo.motto} onChange={(e) => setSchoolInfo({...schoolInfo, motto: e.target.value})} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                            </div>
                        </div>
                    </div>
                     {/* Database Management */}
                    <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm">
                        <div className="p-4 md:p-6 border-b border-slate-200">
                            <h3 className="text-lg font-medium leading-6 text-slate-900">Database Management</h3>
                            <p className="mt-1 text-sm text-slate-500">Backup or restore the school's database.</p>
                        </div>
                        <div className="p-4 md:p-6 flex items-center space-x-4">
                           <button className="flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700">
                                <DatabaseIcon className="h-5 w-5 mr-2" />
                                Backup Database
                           </button>
                           <button className="flex items-center px-4 py-2 bg-white text-slate-700 border border-slate-300 font-medium rounded-lg hover:bg-slate-50">
                                Restore from Backup
                           </button>
                        </div>
                    </div>
                </div>
                {/* Right Column - Branding */}
                <div className="lg:col-span-1">
                     <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm">
                        <div className="p-4 md:p-6 border-b border-slate-200">
                            <h3 className="text-lg font-medium leading-6 text-slate-900">Branding</h3>
                            <p className="mt-1 text-sm text-slate-500">Upload school logo for reports.</p>
                        </div>
                        <div className="p-4 md:p-6">
                             <label className="block text-sm font-medium text-slate-700">School Logo</label>
                            <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-slate-300 px-6 pt-5 pb-6">
                                <div className="space-y-1 text-center">
                                    {schoolLogo ? (
                                        <img src={schoolLogo} alt="School Logo Preview" className="mx-auto h-24 w-auto" />
                                    ) : (
                                        <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                    <div className="flex text-sm text-slate-600 justify-center">
                                        <label htmlFor="logo-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500">
                                            <span>{schoolLogo ? 'Change file' : 'Upload a file'}</span>
                                            <input id="logo-upload" name="logo-upload" type="file" className="sr-only" accept="image/*" onChange={handleLogoUpload} />
                                        </label>
                                    </div>
                                    <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-slate-200 mt-8">
                 <button 
                    onClick={handleSaveChanges}
                    className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                    <SaveIcon className="h-5 w-5 mr-2" />
                    Save System Settings
                </button>
            </div>
        </div>
    );
};
