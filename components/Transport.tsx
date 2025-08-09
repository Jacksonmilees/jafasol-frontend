import React, { useState, useEffect } from 'react';
import { PlusIcon } from './icons';
import { VehicleRow } from './transport/VehicleRow';
import { RouteRow } from './transport/RouteRow';
import apiClient from '../api';

interface Vehicle {
  _id: string;
  vehicleNumber: string;
  vehicleType: string;
  capacity: number;
  driverName: string;
  driverPhone: string;
  status: string;
  route?: string;
  createdAt: string;
  updatedAt: string;
}

interface Route {
  _id: string;
  routeName: string;
  startPoint: string;
  endPoint: string;
  stops: string[];
  estimatedTime: string;
  vehicleId?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const Transport: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [routes, setRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Fetch vehicles and routes on component mount
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const [vehiclesResponse, routesResponse] = await Promise.all([
                apiClient.getVehicles(),
                apiClient.getRoutes()
            ]);

            setVehicles(vehiclesResponse.data || vehiclesResponse);
            setRoutes(routesResponse.data || routesResponse);
        } catch (err) {
            console.error('Error fetching transport data:', err);
            setError('Failed to load transport data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateVehicle = async (vehicleData: any) => {
        try {
            const response = await apiClient.createVehicle(vehicleData);
            setVehicles(prev => [...prev, response.data || response]);
        } catch (err) {
            console.error('Error creating vehicle:', err);
            setError('Failed to create vehicle. Please try again.');
        }
    };

    const handleUpdateVehicle = async (id: string, vehicleData: any) => {
        try {
            const response = await apiClient.updateVehicle(id, vehicleData);
            setVehicles(prev => prev.map(v => v._id === id ? (response.data || response) : v));
        } catch (err) {
            console.error('Error updating vehicle:', err);
            setError('Failed to update vehicle. Please try again.');
        }
    };

    const handleDeleteVehicle = async (id: string) => {
        try {
            await apiClient.deleteVehicle(id);
            setVehicles(prev => prev.filter(v => v._id !== id));
        } catch (err) {
            console.error('Error deleting vehicle:', err);
            setError('Failed to delete vehicle. Please try again.');
        }
    };

    const handleCreateRoute = async (routeData: any) => {
        try {
            const response = await apiClient.createRoute(routeData);
            setRoutes(prev => [...prev, response.data || response]);
        } catch (err) {
            console.error('Error creating route:', err);
            setError('Failed to create route. Please try again.');
        }
    };

    const handleUpdateRoute = async (id: string, routeData: any) => {
        try {
            const response = await apiClient.updateRoute(id, routeData);
            setRoutes(prev => prev.map(r => r._id === id ? (response.data || response) : r));
        } catch (err) {
            console.error('Error updating route:', err);
            setError('Failed to update route. Please try again.');
        }
    };

    const handleDeleteRoute = async (id: string) => {
        try {
            await apiClient.deleteRoute(id);
            setRoutes(prev => prev.filter(r => r._id !== id));
        } catch (err) {
            console.error('Error deleting route:', err);
            setError('Failed to delete route. Please try again.');
        }
    };

    // Filter vehicles based on search and status
    const filteredVehicles = vehicles.filter(vehicle => {
        const matchesSearch = vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            vehicle.driverName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Filter routes based on search and status
    const filteredRoutes = routes.filter(route => {
        const matchesSearch = route.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            route.startPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            route.endPoint.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || route.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

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

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                    <button 
                        onClick={() => setError(null)}
                        className="float-right font-bold"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Search and Filter Controls */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search vehicles and routes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Maintenance">Maintenance</option>
                    </select>
                    <button
                        onClick={fetchData}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Vehicles List */}
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm">
                    <div className="p-4 md:p-6 border-b border-slate-200 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-800">
                            Vehicles ({filteredVehicles.length})
                        </h3>
                        <button 
                            onClick={() => {/* TODO: Open create vehicle modal */}}
                            className="flex items-center justify-center px-3 py-2 bg-white text-slate-700 border border-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 transition"
                        >
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
                                    <th scope="col" className="py-3 px-6 font-medium">Status</th>
                                    <th scope="col" className="py-3 px-6 font-medium"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredVehicles.length > 0 ? (
                                    filteredVehicles.map(vehicle => (
                                        <VehicleRow 
                                            key={vehicle._id} 
                                            vehicle={vehicle}
                                            onUpdate={handleUpdateVehicle}
                                            onDelete={handleDeleteVehicle}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-slate-500">
                                            No vehicles found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Routes List */}
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm">
                    <div className="p-4 md:p-6 border-b border-slate-200 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-800">
                            Routes ({filteredRoutes.length})
                        </h3>
                        <button 
                            onClick={() => {/* TODO: Open create route modal */}}
                            className="flex items-center justify-center px-3 py-2 bg-white text-slate-700 border border-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 transition"
                        >
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
                                    <th scope="col" className="py-3 px-6 font-medium">Time</th>
                                    <th scope="col" className="py-3 px-6 font-medium">Status</th>
                                    <th scope="col" className="py-3 px-6 font-medium"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredRoutes.length > 0 ? (
                                    filteredRoutes.map(route => (
                                        <RouteRow 
                                            key={route._id} 
                                            route={route}
                                            onUpdate={handleUpdateRoute}
                                            onDelete={handleDeleteRoute}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-slate-500">
                                            No routes found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transport;
