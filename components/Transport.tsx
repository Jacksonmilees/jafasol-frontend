import React from 'react';
import { MOCK_VEHICLES, MOCK_ROUTES } from '../constants';
import { PlusIcon } from './icons';
import { VehicleRow } from './transport/VehicleRow';
import { RouteRow } from './transport/RouteRow';

const Transport: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Transport Management</h2>
                    <p className="text-slate-500 mt-1">Manage vehicles, routes, and student assignments.</p>
                </div>
                 <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <button className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition whitespace-nowrap">
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Assign Student
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Vehicles List */}
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm">
                    <div className="p-4 md:p-6 border-b border-slate-200 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-800">Vehicles</h3>
                        <button className="flex items-center justify-center px-3 py-2 bg-white text-slate-700 border border-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 transition">
                            <PlusIcon className="h-4 w-4 mr-1.5" />
                            New Vehicle
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                         <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                                <tr>
                                    <th scope="col" className="py-3 px-6 font-medium">Vehicle Reg.</th>
                                    <th scope="col" className="py-3 px-6 font-medium">Driver</th>
                                    <th scope="col" className="py-3 px-6 font-medium">Route</th>
                                    <th scope="col" className="py-3 px-6 font-medium"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {MOCK_VEHICLES.map(vehicle => <VehicleRow key={vehicle.id} vehicle={vehicle} />)}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Routes List */}
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm">
                    <div className="p-4 md:p-6 border-b border-slate-200 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-800">Routes</h3>
                         <button className="flex items-center justify-center px-3 py-2 bg-white text-slate-700 border border-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 transition">
                            <PlusIcon className="h-4 w-4 mr-1.5" />
                            New Route
                        </button>
                    </div>
                     <div className="overflow-x-auto">
                         <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                                <tr>
                                    <th scope="col" className="py-3 px-6 font-medium">Route Name</th>
                                    <th scope="col" className="py-3 px-6 font-medium">Stops</th>
                                    <th scope="col" className="py-3 px-6 font-medium">Fare</th>
                                    <th scope="col" className="py-3 px-6 font-medium"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {MOCK_ROUTES.map(route => <RouteRow key={route.id} route={route} />)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transport;
