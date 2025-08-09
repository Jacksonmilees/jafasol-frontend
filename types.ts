


export enum Page {
  Dashboard = 'Dashboard',
  UserManagement = 'User Management',
  AuditLogs = 'Audit Logs',
  Students = 'Students',
  Teachers = 'Teachers',
  Academics = 'Academics',
  Exams = 'Exams',
  Fees = 'Fees',
  Reports = 'Reports',
  Attendance = 'Attendance',
  Timetable = 'Timetable',
  Communication = 'Communication',
  Library = 'Library',
  LearningResources = 'Learning Resources',
  Transport = 'Transport',
  DocumentStore = 'Documents',
  Settings = 'Settings',
  ParentStudentPortal = 'Parent Student Portal',
  Logout = 'Logout'
}

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete';

export type ModulePermissions = {
  [key in PermissionAction]?: boolean;
};

export interface Role {
  id: string;
  name: 'Admin' | 'Class Teacher' | 'Subject Teacher' | 'Student' | 'Guardian' | 'Treasurer' | 'Timetable Manager';
  permissions: {
    [key in Page]?: ModulePermissions;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'Active' | 'Inactive' | 'On-leave';
  avatarUrl: string;
  studentId?: string; // Link user to a student record
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  modules?: string[]; // School modules assigned to this user
}

export type AuditLogAction = 'Login Success' | 'Login Failure' | 'User Created' | 'User Updated' | 'Role Updated' | 'Student Deleted' | 'System Settings Changed' | 'DB Backup';

export interface AuditLog {
  id: string;
  timestamp: string;
  userId?: string; // User who performed the action
  userName?: string;
  action: AuditLogAction;
  target: {
    type: 'User' | 'Student' | 'System' | 'Role' | 'DB' | 'Auth';
    id?: string;
    name?: string;
  };
  details: string; // e.g., IP Address for login, or what changed.
}

export type ExamResult = { [subjectId: string]: number | null };

export type StudentExamRecord = {
  results: ExamResult;
  comment?: string;
};

export interface Student {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  formClass: string;
  stream: string;
  status: 'Active' | 'Inactive';
  enrollmentDate: string;
  avatarUrl: string;
  examResults?: { [examId: string]: StudentExamRecord };
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  address?: string;
  emergencyContact?: string;
  medicalConditions?: string;
  isRegistered?: boolean;
  registrationDate?: string;
}

export interface Teacher {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  qualification?: string;
  employmentDate?: string;
  email: string;
  avatarUrl: string;
  subjects: string[];
  classes: string[];
  status: 'Active' | 'On-leave' | 'Terminated';
}

export interface DashboardStats {
  totalStudents: number;
  averageAttendance: number;
  newAdmissions: number;
  feeCollectionPercentage: number;
}

export interface PerformanceData {
    name: string;
    'Average Score': number;
}

export interface AttendanceTrendData {
    name: string;
    'Attendance': number;
}

export interface EnrollmentData {
    'Form 1': number;
    'Form 2': number;
    'Form 3': number;
    'Form 4': number;
}

export interface AIReport {
    title: string;
    summary: string;
    keyInsights: string[];
    actionItems: string[];
}

export interface AcademicYear {
  year: string;
  currentTerm: string;
  termStartDate: string;
  termEndDate: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  curriculum: '8-4-4' | 'International';
  formLevels: number[];
}

export interface SchoolClass {
    id:string;
    name: string;
    formLevel: number;
    stream: string;
    teacher: string; // Display name of class teacher
    students: number;
    classTeacherId?: string; // Formal ID of the class teacher (User ID)
}

export interface Exam {
    id: string;
    name: string;
    type: 'CAT' | 'Mid-Term' | 'End-Term' | 'Mock';
    term: string;
    startDate: string;
    status: 'Upcoming' | 'Ongoing' | 'Completed';
    subjects: string[]; // e.g., ['SUB01', 'SUB02', 'SUB03']
    marksLocked?: boolean;
}

export interface Grade {
    name: string;
    minScore: number;
    maxScore: number;
    comment: string;
}

export interface FeeStructure {
    id: string;
    formLevel: string;
    amount: number;
    type: 'Tuition' | 'Boarding' | 'Transport';
    term: string;
    dueDate: string;
}

export interface FeeInvoice {
    id: string;
    studentId: string;
    description: string;
    amount: number;
    date: string;
}

export interface FeePayment {
    id: string;
    studentId: string;
    amount: number;
    date: string;
    method: 'Mpesa' | 'Bank' | 'Cash';
}

export interface ReportTemplate {
    id: string;
    title: string;
    description: string;
    iconName: string;
}

export interface AttendanceRecord {
    studentId: string;
    studentName: string;
    avatarUrl: string;
    status: 'Present' | 'Absent' | 'Late' | 'Unmarked';
}

export interface TimetableEntry {
    time: string;
    monday: { subject: string; teacher: string; } | null;
    tuesday: { subject: string; teacher: string; } | null;
    wednesday: { subject: string; teacher: string; } | null;
    thursday: { subject: string; teacher: string; } | null;
    friday: { subject: string; teacher: string; } | null;
}

export interface TimetableCellData {
    line1: string;
    line2: string;
}

export interface Message {
    id: string;
    sender: string;
    subject: string;
    preview: string;
    timestamp: string;
    isRead: boolean;
}

export interface Book {
    id: string;
    isbn: string;
    title: string;
    author: string;
    category: string;
    totalCopies: number;
    availableCopies: number;
}

export interface BookIssue {
    id: string;
    bookTitle: string;
    studentName: string;
    issueDate: string;
    dueDate: string;
    status: 'Issued' | 'Overdue';
}

export interface Vehicle {
    id: string;
    registrationNumber: string;
    capacity: number;
    driverName: string;
    routeName: string;
}

export interface Route {
    id: string;
    name: string;
    stops: number;
    fare: number;
}

export interface Document {
  id: string;
  name: string;
  studentId: string;
  studentName: string;
  type: 'Admission Letter' | 'Transcript' | 'Birth Certificate' | 'Medical Report';
  uploadDate: string;
  fileUrl: string; // This would be a real URL in a production app
}

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  subject: string;
  formClass: string;
  resourceType: 'Notes (PDF)' | 'Assignment (DOC)' | 'Video Link';
  fileUrl: string; // URL for download or video link
  uploaderName: string;
  uploadDate: string;
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}
