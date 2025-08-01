import React from 'react';
import { MOCK_BOOKS, MOCK_ISSUED_BOOKS } from '../constants';
import { PlusIcon, SearchIcon } from './icons';
import { BookRow } from './library/BookRow';
import { IssuedBookRow } from './library/IssuedBookRow';

const Library: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Library Management</h2>
                    <p className="text-slate-500 mt-1">Manage book catalog, issues, and returns.</p>
                </div>
                 <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <button className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition whitespace-nowrap">
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Issue Book
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Book Catalog */}
                <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/80 shadow-sm">
                    <div className="p-4 md:p-6 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between">
                         <div>
                            <h3 className="text-lg font-semibold text-slate-800">Book Catalog</h3>
                            <p className="text-sm text-slate-500 mt-1">Search and manage all books.</p>
                        </div>
                        <div className="flex items-center space-x-2 mt-4 md:mt-0">
                           <button className="flex items-center justify-center px-3 py-2 bg-white text-slate-700 border border-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 transition">
                                <PlusIcon className="h-4 w-4 mr-1.5" />
                                New Book
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                         <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                                <tr>
                                    <th scope="col" className="py-3 px-6 font-medium">Book Title</th>
                                    <th scope="col" className="py-3 px-6 font-medium">Author</th>
                                    <th scope="col" className="py-3 px-6 font-medium">Copies</th>
                                    <th scope="col" className="py-3 px-6 font-medium"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {MOCK_BOOKS.map(book => <BookRow key={book.id} book={book} />)}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Issued Books */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-sm">
                    <div className="p-4 md:p-6 border-b border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-800">Issued Books</h3>
                         <p className="text-sm text-slate-500 mt-1">Track all currently issued books.</p>
                    </div>
                     <div className="overflow-x-auto">
                         <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                                <tr>
                                    <th scope="col" className="py-3 px-6 font-medium">Book / Student</th>
                                    <th scope="col" className="py-3 px-6 font-medium">Due Date</th>
                                    <th scope="col" className="py-3 px-6 font-medium"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {MOCK_ISSUED_BOOKS.map(item => <IssuedBookRow key={item.id} issue={item} />)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Library;
