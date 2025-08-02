import React, { useState } from 'react';
import { User } from '../types';
import { LogoIcon } from './icons';
import apiClient from '../api';

interface LoginProps {
  onCredentialsSuccess: (user: User) => void;
  onFailure: (email: string) => void;
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onCredentialsSuccess, onFailure, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.login(email, password);
      
      // Set the token for future API calls
      apiClient.setToken(response.token);
      
      // Transform the user data to match our frontend User type
      const user: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: {
          id: response.user.role || 'admin',
          name: response.user.role || 'Admin',
          permissions: {} // Will be loaded separately if needed
        },
        status: 'Active',
        avatarUrl: response.user.avatarUrl,
        lastLoginAt: response.user.lastLoginAt,
        twoFactorEnabled: response.user.twoFactorEnabled || false
      };

      onCredentialsSuccess(user);
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed. Please try again.');
      onFailure(email);
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.login(userEmail, userPassword);
      apiClient.setToken(response.token);
      
      const user: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: {
          id: response.user.role || 'admin',
          name: response.user.role || 'Admin',
          permissions: {}
        },
        status: 'Active',
        avatarUrl: response.user.avatarUrl,
        lastLoginAt: response.user.lastLoginAt,
        twoFactorEnabled: response.user.twoFactorEnabled || false
      };

      onCredentialsSuccess(user);
    } catch (error: any) {
      console.error('Quick login failed:', error);
      setError(error.message || 'Quick login failed.');
      onFailure(userEmail);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="p-8 space-y-6 bg-white rounded-2xl shadow-lg">
          <div className="text-center">
              <LogoIcon className="mx-auto h-12 w-auto text-teal-600" />
              <h2 className="mt-6 text-3xl font-bold text-gray-900">
                  Welcome to JafaSol
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                  Sign in to your account
              </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
              <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                      <label htmlFor="email-address" className="sr-only">Email address</label>
                      <input
                          id="email-address"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          disabled={isLoading}
                          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm disabled:bg-gray-100"
                          placeholder="Email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                      />
                  </div>
                  <div>
                      <label htmlFor="password" className="sr-only">Password</label>
                      <input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          required
                          disabled={isLoading}
                          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm disabled:bg-gray-100"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                      />
                  </div>
              </div>

              {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                      {error}
                  </div>
              )}

              <div className="flex items-center justify-between">
                  <div className="text-sm">
                      <a href="#" className="font-medium text-teal-600 hover:text-teal-500">
                          Forgot your password?
                      </a>
                  </div>
                  <div className="text-sm">
                      <button
                          type="button"
                          onClick={onSwitchToRegister}
                          className="font-medium text-teal-600 hover:text-teal-500"
                      >
                          Create account
                      </button>
                  </div>
              </div>

              <div>
                  <button
                      type="submit"
                      disabled={isLoading}
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      {isLoading ? (
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                      ) : null}
                      {isLoading ? 'Signing in...' : 'Sign in'}
                  </button>
              </div>

              <div className="mt-6">
                  <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">Quick login</span>
                      </div>
                  </div>

                  <div className="mt-6 text-center text-sm text-gray-500">
                      <p>Enter your credentials to login</p>
                  </div>
              </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;