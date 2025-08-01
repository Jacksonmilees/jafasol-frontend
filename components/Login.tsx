import React, { useState } from 'react';
import { User } from '../types';
import { LogoIcon } from './icons';

interface LoginProps {
  users: User[];
  onCredentialsSuccess: (user: User) => void;
  onFailure: (email: string) => void;
  onSwitchToRegister: () => void;
}

/*
  In a real application, password verification would happen on a secure backend server 
  using a strong hashing algorithm like BCrypt or Argon2. 
  This frontend simulation uses a plain email check for demonstration purposes.
*/
const Login: React.FC<LoginProps> = ({ users, onCredentialsSuccess, onFailure, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    // In this demo, any password works for a valid email
    if (user) {
      setError('');
      onCredentialsSuccess(user);
    } else {
      const message = 'Invalid email or password. Please try again.';
      setError(message);
      onFailure(email);
    }
  };

  const quickLogin = (userEmail: string) => {
      const user = users.find(u => u.email === userEmail);
      if (user) {
          onCredentialsSuccess(user);
      }
  }

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
                          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
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
                          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                          placeholder="Password (any password works)"
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
              </div>

              <div>
                  <button
                      type="submit"
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                      Sign in
                  </button>
              </div>
          </form>
          <div className="text-center text-sm text-gray-500 space-y-2">
              <p>Or quick login as:</p>
              <div className="flex justify-center gap-2 flex-wrap">
                  <button onClick={() => quickLogin('admin@edusys.com')} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors text-xs">Admin</button>
                  <button onClick={() => quickLogin('m.wanjiku@edusys.com')} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors text-xs">Class Teacher</button>
                  <button onClick={() => quickLogin('jane.d@email.com')} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors text-xs">Guardian</button>
              </div>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-600">
            <p>
                Student or new Guardian?{' '}
                <button onClick={onSwitchToRegister} className="font-medium text-teal-600 hover:text-teal-500">
                    Register here
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;