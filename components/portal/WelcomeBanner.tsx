import React from 'react';
import { User, Student } from '../../types';
import { GraduationCapIcon } from '../icons';

interface WelcomeBannerProps {
    user: User;
    student: Student;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ user, student }) => {
    return (
        <div className="bg-teal-700 rounded-xl p-8 text-white flex flex-col md:flex-row items-start justify-between shadow-lg">
            <div className="flex items-center">
                <GraduationCapIcon className="h-12 w-12 mr-6 hidden md:block" />
                <div>
                    <h2 className="text-2xl font-bold">Welcome back, {user.name.split(' ')[0]}!</h2>
                    <p className="opacity-80 mt-1 max-w-2xl">
                        This is the portal for {student.firstName} {student.lastName}. 
                        Here you can find updates on academic performance, fee status, and class schedules.
                    </p>
                </div>
            </div>
        </div>
    );
};