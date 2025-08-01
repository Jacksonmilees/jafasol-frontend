import React, { useMemo } from 'react';
import { DASHBOARD_STATS, MOCK_FEE_INVOICES, MOCK_FEE_PAYMENTS } from '../constants';
import { User, Page } from '../types';
import { DollarSignIcon, TrendingUpIcon, UsersIcon } from './icons';
import { StatCard } from './dashboard/StatCard';
import { AcademicPerformanceChart } from './dashboard/AcademicPerformanceChart';
import { FeeCollectionChart } from './dashboard/FeeCollectionChart';
import { AttendanceTrendChart } from './dashboard/AttendanceTrendChart';
import { QuickActionsCard } from './dashboard/QuickActionsCard';
import { TeacherDashboard } from './TeacherDashboard';

interface DashboardProps {
    currentUser: User;
    setCurrentPage: (page: Page) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, setCurrentPage }) => {
  const feeData = useMemo(() => {
        const totalBilled = MOCK_FEE_INVOICES.reduce((acc, inv) => acc + inv.amount, 0);
        const totalCollected = MOCK_FEE_PAYMENTS.reduce((acc, pay) => acc + pay.amount, 0);
        const totalOutstanding = totalBilled - totalCollected;
        return { totalCollected, totalOutstanding };
    }, []);

  const isTeacher = ['Class Teacher', 'Subject Teacher'].includes(currentUser.role.name);

  if (isTeacher) {
    return <TeacherDashboard currentUser={currentUser} setCurrentPage={setCurrentPage} />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Welcome back, {currentUser.name.split(' ')[0]}!</h2>
        <p className="text-gray-500 mt-1">Here's a snapshot of your school's performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<UsersIcon className="h-6 w-6 text-teal-500" />} title="Total Students" value={DASHBOARD_STATS.totalStudents.toLocaleString()} change="+2.5%" changeType="increase" />
        <StatCard icon={<TrendingUpIcon className="h-6 w-6 text-green-500" />} title="Average Attendance" value={`${DASHBOARD_STATS.averageAttendance}%`} change="-0.5%" changeType="decrease" />
        <StatCard icon={<UsersIcon className="h-6 w-6 text-blue-500" />} title="New Admissions" value={DASHBOARD_STATS.newAdmissions.toString()} change="+10%" changeType="increase"/>
        <StatCard icon={<DollarSignIcon className="h-6 w-6 text-amber-500" />} title="Fees Collected" value={`${DASHBOARD_STATS.feeCollectionPercentage}%`} change="+5%" changeType="increase"/>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AcademicPerformanceChart />
        </div>
        <FeeCollectionChart collected={feeData.totalCollected} outstanding={feeData.totalOutstanding} />
        <div className="lg:col-span-2">
          <AttendanceTrendChart />
        </div>
        <QuickActionsCard />
      </div>

    </div>
  );
};

export default Dashboard;