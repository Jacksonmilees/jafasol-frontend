
import React, { useState, useMemo } from 'react';
import { AuditLog, AuditLogAction } from '../types';
import { HistoryIcon, ChevronDownIcon } from './icons';

const LogRow: React.FC<{ log: AuditLog }> = ({ log }) => {
    const isSuccess = log.action.includes('Success');
    const isFailure = log.action.includes('Failure');
    const isDestructive = log.action.includes('Deleted');
    const isUpdate = log.action.includes('Updated') || log.action.includes('Changed');
    const isCreate = log.action.includes('Created') || log.action.includes('Backup');

    const statusColor = 
        isSuccess ? 'bg-green-100 text-green-800' :
        isFailure || isDestructive ? 'bg-red-100 text-red-800' :
        isUpdate ? 'bg-amber-100 text-amber-800' :
        isCreate ? 'bg-sky-100 text-sky-800' :
        'bg-slate-100 text-slate-800';

    return (
        <tr className="border-b border-slate-200 hover:bg-slate-50">
            <td className="py-3 px-6">
                <p className="font-medium text-slate-700">{new Date(log.timestamp).toLocaleString()}</p>
            </td>
             <td className="py-3 px-6">
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColor}`}>
                    {log.action}
                </span>
            </td>
            <td className="py-3 px-6">
                <p className="font-semibold text-slate-800">{log.userName || 'System'}</p>
                <p className="text-xs text-slate-500">{log.userId || 'N/A'}</p>
            </td>
            <td className="py-3 px-6">
                 <p className="font-medium text-slate-700">{log.target.type}: {log.target.name || log.target.id || 'N/A'}</p>
            </td>
            <td className="py-3 px-6 text-slate-600">{log.details}</td>
        </tr>
    );
};


const AuditLogs: React.FC<{ logs: AuditLog[]; isSubcomponent?: boolean }> = ({ logs, isSubcomponent = false }) => {
    const [filter, setFilter] = useState<AuditLogAction | 'All'>('All');
    
    const actionTypes = useMemo(() => ['All', ...Array.from(new Set(logs.map(log => log.action)))], [logs]);

    const filteredLogs = useMemo(() => {
        if (filter === 'All') return logs;
        return logs.filter(log => log.action === filter);
    }, [logs, filter]);


    const header = (
        <div className="p-4 md:p-6 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center">
                <HistoryIcon className="h-6 w-6 text-slate-500 mr-3" />
                <div>
                    <h2 className="text-xl font-semibold text-slate-800">Audit Logs</h2>
                    <p className="text-sm text-slate-500 mt-1">Review important events that have occurred in the system.</p>
                </div>
            </div>
             <div className="relative mt-4 md:mt-0">
                <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="pl-4 pr-10 py-2 bg-white border border-slate-300 rounded-lg focus:border-indigo-500 focus:outline-none transition appearance-none">
                    {actionTypes.map(action => <option key={action} value={action}>{action}</option>)}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
            </div>
        </div>
    );
    
    const mainContent = (
        <>
            <div className="overflow-x-auto">
                {filteredLogs.length > 0 ? (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                            <tr>
                                <th scope="col" className="py-3 px-6 font-medium">Timestamp</th>
                                <th scope="col" className="py-3 px-6 font-medium">Action</th>
                                <th scope="col" className="py-3 px-6 font-medium">User</th>
                                <th scope="col" className="py-3 px-6 font-medium">Target</th>
                                <th scope="col" className="py-3 px-6 font-medium">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredLogs.map(log => <LogRow key={log.id} log={log} />)}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-6 text-center text-slate-500">
                        <p>No log entries match the current filter.</p>
                    </div>
                )}
            </div>
             <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-600">
                <p className="text-xs sm:text-sm">Showing 1 to {filteredLogs.length} of {filteredLogs.length} results</p>
            </div>
        </>
    );

    if (isSubcomponent) {
        return (
            <div>
                {mainContent}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm">
           {header}
           {mainContent}
        </div>
    );
};

export default AuditLogs;
