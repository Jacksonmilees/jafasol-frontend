import React, { useState } from 'react';
import { Page, User, Student, Role, AuditLog } from './types';
import { MOCK_STUDENTS, MOCK_USERS, MOCK_ROLES, MOCK_AUDIT_LOGS } from './constants';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import StudentManagement from './components/StudentManagement';
import UserManagement from './components/UserManagement';
import TeacherManagement from './components/TeacherManagement';
import Academics from './components/Academics';
import Exams from './components/Exams';
import Fees from './components/Fees';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Attendance from './components/Attendance';
import Timetable from './components/Timetable';
import Communication from './components/Communication';
import Library from './components/Library';
import Transport from './components/Transport';
import DocumentStore from './components/DocumentStore';
import LearningResources from './components/LearningResources';
import ParentStudentPortal from './components/portal/ParentStudentPortal';
import Login from './components/Login';
import { Register } from './components/Register';
import AuditLogs from './components/AuditLogs';
import TwoFactorSetup from './components/security/TwoFactorSetup';
import TwoFactorVerification from './components/security/TwoFactorVerification';


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authScreen, setAuthScreen] = useState<'login' | 'register' | '2fa' | '2fa-setup'>('login');
  const [userFor2FA, setUserFor2FA] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Lifted state
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);


  const addAuditLog = (user: User | null, action: AuditLog['action'], target: AuditLog['target'], details: string) => {
      const newLog: AuditLog = {
          id: `LOG${Date.now()}`,
          userId: user?.id,
          userName: user?.name,
          action,
          target,
          timestamp: new Date().toISOString(),
          details,
      };
      setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserFor2FA(null);
    setAuthScreen('login');
    setCurrentPage(Page.Dashboard); // Reset to default page for next login
  };
  
  const handleRegisterSuccess = () => {
      setAuthScreen('login');
      // Potentially show a success message on the login screen
  };

  const handleCredentialsSuccess = (user: User) => {
    addAuditLog(user, 'Login Success', { type: 'Auth', name: user.email }, `IP: 192.168.1.${Math.floor(Math.random() * 254) + 1}`);
    if (user.role.name === 'Admin' && user.twoFactorEnabled) {
        setUserFor2FA(user);
        setAuthScreen('2fa');
    } else if (user.role.name === 'Admin' && !user.twoFactorEnabled) {
        setUserFor2FA(user);
        setAuthScreen('2fa-setup');
    } else {
        setCurrentUser(user);
    }
  };

  const handleLoginFailure = (email: string) => {
      addAuditLog(null, 'Login Failure', { type: 'Auth', name: email }, `IP: 192.168.1.${Math.floor(Math.random() * 254) + 1}`);
  };

  const handle2FASuccess = () => {
    if(userFor2FA) {
      setCurrentUser(userFor2FA);
      setUserFor2FA(null);
      setAuthScreen('login');
    }
  }

  const handle2FASetupSuccess = () => {
    if(userFor2FA) {
        const userWith2FA = { ...userFor2FA, twoFactorEnabled: true };
        const updatedUsers = users.map(u => u.id === userWith2FA.id ? userWith2FA : u);
        setUsers(updatedUsers);
        setCurrentUser(userWith2FA);
        setUserFor2FA(null);
        setAuthScreen('login');
    }
  };

  const handleAuthCancel = () => {
      setUserFor2FA(null);
      setAuthScreen('login');
  }

  const renderContent = () => {
    if (!currentUser) return null;

    switch (currentPage) {
      case Page.Dashboard:
        return <Dashboard currentUser={currentUser} setCurrentPage={setCurrentPage} />;
      case Page.UserManagement:
        return <UserManagement currentUser={currentUser} users={users} setUsers={setUsers} roles={roles} />;
      case Page.AuditLogs:
        return <AuditLogs logs={auditLogs} />;
      case Page.Students:
        return <StudentManagement currentUser={currentUser}/>;
      case Page.Teachers:
        return <TeacherManagement currentUser={currentUser} />;
      case Page.Academics:
        return <Academics currentUser={currentUser} />;
      case Page.Attendance:
        return <Attendance />;
      case Page.Timetable:
        return <Timetable />;
      case Page.Exams:
        return <Exams currentUser={currentUser} />;
      case Page.Fees:
        return <Fees />;
      case Page.Communication:
        return <Communication />;
      case Page.Library:
        return <Library />;
      case Page.LearningResources:
        return <LearningResources currentUser={currentUser} />;
      case Page.Transport:
        return <Transport />;
      case Page.DocumentStore:
        return <DocumentStore />;
      case Page.Reports:
        return <Reports currentUser={currentUser}/>;
      case Page.Settings:
        return <Settings currentUser={currentUser} users={users} setUsers={setUsers} roles={roles} setRoles={setRoles} auditLogs={auditLogs} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold">{currentPage}</h2>
            <p>This module is under construction.</p>
          </div>
        );
    }
  };

  if (!currentUser) {
    switch(authScreen) {
        case 'login':
            return <Login users={users} onCredentialsSuccess={handleCredentialsSuccess} onFailure={handleLoginFailure} onSwitchToRegister={() => setAuthScreen('register')} />;
        case 'register':
            return <Register 
                students={students}
                setStudents={setStudents}
                users={users}
                setUsers={setUsers}
                onSwitchToLogin={() => setAuthScreen('login')} 
                onRegisterSuccess={handleRegisterSuccess}
                />;
        case '2fa':
            if (!userFor2FA) { setAuthScreen('login'); return null; }
            return <TwoFactorVerification user={userFor2FA} onSuccess={handle2FASuccess} onCancel={handleAuthCancel} />;
        case '2fa-setup':
            if (!userFor2FA) { setAuthScreen('login'); return null; }
            return <TwoFactorSetup user={userFor2FA} onSuccess={handle2FASetupSuccess} onCancel={handleAuthCancel} />;
        default:
             setAuthScreen('login');
             return null;
    }
  }

  const isPortalUser = currentUser.role.name === 'Student' || currentUser.role.name === 'Guardian';
  if (isPortalUser) {
    return <ParentStudentPortal user={currentUser} users={users} onSetCurrentUser={setCurrentUser} onLogout={handleLogout} />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        currentUser={currentUser}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          currentPage={currentPage} 
          currentUser={currentUser} 
          users={users}
          onSetCurrentUser={setCurrentUser} 
          onLogout={handleLogout} 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;