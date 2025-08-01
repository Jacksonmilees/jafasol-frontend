


import { Page, Student, Teacher, DashboardStats, AcademicYear, Subject, SchoolClass, Exam, FeeStructure, ReportTemplate, AttendanceRecord, TimetableEntry, Message, Book, BookIssue, Vehicle, Route, User, Role, ModulePermissions, PermissionAction, Grade, FeeInvoice, FeePayment, Document, LearningResource, PerformanceData, AttendanceTrendData, EnrollmentData, AuditLog } from './types';

export const NAV_ITEMS = [
  { id: Page.Dashboard, label: 'Dashboard' },
  { id: Page.UserManagement, label: 'User Management' },
  { id: Page.AuditLogs, label: 'Audit Logs' },
  { id: Page.Students, label: 'Students' },
  { id: Page.Teachers, label: 'Teachers' },
  { id: Page.Academics, label: 'Academics' },
  { id: Page.Attendance, label: 'Attendance' },
  { id: Page.Timetable, label: 'Timetable' },
  { id: Page.Exams, label: 'Exams' },
  { id: Page.Fees, label: 'Fees' },
  { id: Page.Communication, label: 'Communication' },
  { id: Page.Library, label: 'Library' },
  { id: Page.LearningResources, label: 'Learning Resources' },
  { id: Page.Transport, label: 'Transport' },
  { id: Page.DocumentStore, label: 'Documents' },
  { id: Page.Reports, label: 'Reports' },
];

export const PERMISSION_MODULES: Page[] = [
    Page.Dashboard,
    Page.UserManagement,
    Page.AuditLogs,
    Page.Students,
    Page.Teachers,
    Page.Academics,
    Page.Exams,
    Page.Fees,
    Page.Reports,
    Page.Attendance,
    Page.Timetable,
    Page.Communication,
    Page.Library,
    Page.LearningResources,
    Page.Transport,
    Page.DocumentStore,
    Page.Settings,
];

export const PERMISSION_ACTIONS: PermissionAction[] = ['view', 'create', 'edit', 'delete'];

const allPermissions = PERMISSION_MODULES.reduce((acc, module) => {
    acc[module] = { view: true, create: true, edit: true, delete: true };
    return acc;
}, {} as { [key in Page]?: ModulePermissions });

// Class Teacher: Full class stats, student profiles, see timetable, view subject teachers for class
const classTeacherPermissions: { [key in Page]?: ModulePermissions } = {
    [Page.Dashboard]: { view: true },
    [Page.Students]: { view: true, edit: true }, // Can view and edit their own students
    [Page.Teachers]: { view: true }, // Can view other teachers
    [Page.Academics]: { view: true }, // Can view subjects and classes
    [Page.Attendance]: { view: true, create: true, edit: true }, // Can mark attendance for their class
    [Page.Timetable]: { view: true },
    [Page.Exams]: { view: true, create: true, edit: true }, // Can enter marks
    [Page.Communication]: { view: true, create: true }, // Can communicate with parents/students
    [Page.LearningResources]: { view: true, create: true, edit: true, delete: true },
    [Page.Reports]: { view: true },
};

// Subject Teacher: Submit marks, view timetable, view own subjects
const subjectTeacherPermissions: { [key in Page]?: ModulePermissions } = {
    [Page.Dashboard]: { view: true },
    [Page.Academics]: { view: true }, // Can see subjects
    [Page.Timetable]: { view: true },
    [Page.Exams]: { view: true, create: true, edit: true }, // Primary role: submit marks
    [Page.LearningResources]: { view: true, create: true, edit: true, delete: true },
};

// Treasurer: Manage school fees, fee reports, balances, receipts
const treasurerPermissions: { [key in Page]?: ModulePermissions } = {
    [Page.Dashboard]: { view: true },
    [Page.Students]: { view: true }, // View student details for fee purposes
    [Page.Fees]: { view: true, create: true, edit: true, delete: true }, // Full control over fees
    [Page.Reports]: { view: true }, // For fee reports
};

// Student & Guardian (Parent) have the same read-only access to relevant data
const studentGuardianPermissions: { [key in Page]?: ModulePermissions } = {
    [Page.Dashboard]: { view: true }, // Will see their own portal dashboard
    [Page.Academics]: { view: true }, // View subjects
    [Page.Exams]: { view: true }, // View results
    [Page.Fees]: { view: true }, // View fee balance
    [Page.Timetable]: { view: true },
    [Page.LearningResources]: { view: true },
    [Page.Attendance]: { view: true },
};


export const MOCK_ROLES: Role[] = [
    { id: 'R01', name: 'Admin', permissions: allPermissions },
    { id: 'R02', name: 'Class Teacher', permissions: classTeacherPermissions },
    { id: 'R03', name: 'Subject Teacher', permissions: subjectTeacherPermissions },
    { id: 'R04', name: 'Treasurer', permissions: treasurerPermissions },
    { id: 'R05', name: 'Student', permissions: studentGuardianPermissions },
    { id: 'R06', name: 'Guardian', permissions: studentGuardianPermissions },
    { id: 'R07', name: 'Timetable Manager', permissions: { [Page.Timetable]: { view: true, create: true, edit: true, delete: true }} },
];

export const MOCK_USERS: User[] = [
    { id: 'U001', name: 'Admin User', email: 'admin@edusys.com', role: MOCK_ROLES.find(r => r.name === 'Admin')!, status: 'Active', avatarUrl: 'https://picsum.photos/seed/U001/40/40', twoFactorEnabled: false, twoFactorSecret: 'JBSWY3DPEHPK3PXP' },
    { id: 'U002', name: 'John Kamau', email: 'j.kamau@edusys.com', role: MOCK_ROLES.find(r => r.name === 'Subject Teacher')!, status: 'Active', avatarUrl: 'https://picsum.photos/seed/U002/40/40' },
    { id: 'U003', name: 'Mary Wanjiku', email: 'm.wanjiku@edusys.com', role: MOCK_ROLES.find(r => r.name === 'Class Teacher')!, status: 'Active', avatarUrl: 'https://picsum.photos/seed/U003/40/40' },
    { id: 'T003', name: 'David Otieno', email: 'd.otieno-teacher@edusys.com', role: MOCK_ROLES.find(r => r.name === 'Class Teacher')!, status: 'Active', avatarUrl: 'https://picsum.photos/seed/U004/40/40' },
    { id: 'T004', name: 'Susan Kimani', email: 's.kimani@edusys.com', role: MOCK_ROLES.find(r => r.name === 'Subject Teacher')!, status: 'On-leave', avatarUrl: 'https://picsum.photos/seed/T004/40/40' },
    { id: 'U004', name: 'David Otieno (Finance)', email: 'd.otieno@edusys.com', role: MOCK_ROLES.find(r => r.name === 'Treasurer')!, status: 'Active', avatarUrl: 'https://picsum.photos/seed/U004/40/40' },
    { id: 'U005', name: 'Jane Doe (Guardian)', email: 'jane.d@email.com', role: MOCK_ROLES.find(r => r.name === 'Guardian')!, status: 'Inactive', avatarUrl: 'https://picsum.photos/seed/U005/40/40', studentId: 'S001' },
    { id: 'U006', name: 'Peter Jones (Student)', email: 'p.jones@student.edusys.com', role: MOCK_ROLES.find(r => r.name === 'Student')!, status: 'Active', avatarUrl: 'https://picsum.photos/seed/S003/40/40', studentId: 'S003' },
    { id: 'U007', name: 'Mr. Smith (Guardian)', email: 'mr.smith@email.com', role: MOCK_ROLES.find(r => r.name === 'Guardian')!, status: 'Active', avatarUrl: 'https://picsum.photos/seed/U007/40/40', studentId: 'S002' },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
    { id: 'LOG001', userId: 'U002', userName: 'John Kamau', action: 'Login Success', target: { type: 'Auth', name: 'j.kamau@edusys.com' }, timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), details: 'IP: 192.168.1.15' },
    { id: 'LOG002', userId: 'U001', userName: 'Admin User', action: 'User Updated', target: { type: 'User', id: 'T004', name: 'Susan Kimani' }, timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), details: 'Status changed to On-leave' },
    { id: 'LOG003', userId: 'U005', userName: 'Jane Doe (Guardian)', action: 'Login Success', target: { type: 'Auth', name: 'jane.d@email.com' }, timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString(), details: 'IP: 10.0.0.8' },
    { id: 'LOG004', action: 'Login Failure', target: { type: 'Auth', name: 'badactor@email.com' }, timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(), details: 'IP: 203.0.113.45' },
    { id: 'LOG005', userId: 'U001', userName: 'Admin User', action: 'System Settings Changed', target: { type: 'System', name: 'Grading System' }, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), details: 'Updated grade C+ minScore to 55' },
];


export const MOCK_STUDENTS: Student[] = [
  { id: 'S001', admissionNumber: 'ADM1001', firstName: 'John', lastName: 'Doe', dateOfBirth: '2008-05-12', gender: 'Male', formClass: 'Form 3', stream: 'C', status: 'Active', enrollmentDate: '2022-01-15', avatarUrl: 'https://picsum.photos/seed/S001/40/40', examResults: { 'EX02': { results: { 'SUB01': 85, 'SUB02': 72, 'SUB06': 65 }, comment: 'Excellent work in Maths and English.' }, 'EX03': { results: { 'SUB01': 78, 'SUB02': 68, 'SUB05': 71, 'SUB07': 75 }, comment: 'Good progress, keep it up.' } }, guardianName: 'Jane Doe', guardianPhone: '0711223344', isRegistered: true },
  { id: 'S002', admissionNumber: 'ADM1002', firstName: 'Jane', lastName: 'Smith', dateOfBirth: '2007-09-20', gender: 'Female', formClass: 'Form 4', stream: 'B', status: 'Active', enrollmentDate: '2021-01-18', avatarUrl: 'https://picsum.photos/seed/S002/40/40', examResults: { 'EX03': { results: { 'SUB01': 90, 'SUB02': 88, 'SUB05': 78, 'SUB07': 82 }, comment: 'Top of the class. Keep it up.' } }, guardianName: 'Mr. Smith', guardianPhone: '0755667788', isRegistered: true },
  { id: 'S003', admissionNumber: 'ADM1003', firstName: 'Peter', lastName: 'Jones', dateOfBirth: '2009-02-25', gender: 'Male', formClass: 'Form 2', stream: 'A', status: 'Active', enrollmentDate: '2023-01-12', avatarUrl: 'https://picsum.photos/seed/S003/40/40', examResults: { 'EX02': { results: { 'SUB01': 55, 'SUB02': 61, 'SUB06': 58 }, comment: 'Consistent effort shown.' } }, guardianName: 'Mr. Jones', guardianPhone: '0712345678', isRegistered: true },
  { id: 'S004', admissionNumber: 'ADM1004', firstName: 'Mary', lastName: 'Williams', dateOfBirth: '2008-11-30', gender: 'Female', formClass: 'Form 3', stream: 'C', status: 'Active', enrollmentDate: '2022-01-15', avatarUrl: 'https://picsum.photos/seed/S004/40/40', examResults: { 'EX02': { results: { 'SUB01': 60, 'SUB02': 55, 'SUB06': 48 }, comment: 'Needs to put more effort in History.' }, 'EX03': { results: { 'SUB01': 65, 'SUB02': 60, 'SUB05': 55, 'SUB07': 58 }, comment: 'Improvement needed in sciences.' } }, guardianName: 'Mrs. Williams', guardianPhone: '0723456789', isRegistered: false },
  { id: 'S005', admissionNumber: 'ADM1005', firstName: 'David', lastName: 'Brown', dateOfBirth: '2010-03-10', gender: 'Male', formClass: 'Form 1', stream: 'A', status: 'Active', enrollmentDate: '2024-01-20', avatarUrl: 'https://picsum.photos/seed/S005/40/40', examResults: {}, guardianName: 'Mr. Brown', guardianPhone: '0734567890', isRegistered: false },
  { id: 'S006', admissionNumber: 'ADM1006', firstName: 'Susan', lastName: 'Miller', dateOfBirth: '2007-07-07', gender: 'Female', formClass: 'Form 4', stream: 'B', status: 'Inactive', enrollmentDate: '2021-01-18', avatarUrl: 'https://picsum.photos/seed/S006/40/40', examResults: {}, guardianName: 'Mr. Miller', guardianPhone: '0745678901', isRegistered: false },
  { id: 'S007', admissionNumber: 'ADM1007', firstName: 'Michael', lastName: 'Davis', dateOfBirth: '2009-08-15', gender: 'Male', formClass: 'Form 2', stream: 'A', status: 'Active', enrollmentDate: '2023-01-12', avatarUrl: 'https://picsum.photos/seed/S007/40/40', examResults: { 'EX02': { results: { 'SUB01': 78, 'SUB02': 82, 'SUB06': 75 }, comment: 'Great work, a pleasure to have in class.' } }, guardianName: 'Laura Davis', guardianPhone: '0798765432', isRegistered: false },
  { id: 'S008', admissionNumber: 'ADM1008', firstName: 'Linda', lastName: 'Garcia', dateOfBirth: '2010-01-05', gender: 'Female', formClass: 'Form 1', stream: 'A', status: 'Active', enrollmentDate: '2024-01-20', avatarUrl: 'https://picsum.photos/seed/S008/40/40', examResults: {}, guardianName: 'Mrs. Garcia', guardianPhone: '0787654321', isRegistered: true },
];

export const MOCK_TEACHERS: Teacher[] = [
    { id: 'U002', name: 'John Kamau', email: 'j.kamau@edusys.com', avatarUrl: 'https://picsum.photos/seed/U002/40/40', subjects: ['Mathematics', 'Physics'], classes: ['Form 2A', 'Form 4B', 'Form 3C'], status: 'Active' },
    { id: 'U003', name: 'Mary Wanjiku', email: 'm.wanjiku@edusys.com', avatarUrl: 'https://picsum.photos/seed/U003/40/40', subjects: ['Kiswahili', 'History'], classes: ['Form 3C', 'Form 1A', 'Form 2A'], status: 'Active' },
    { id: 'T003', name: 'David Otieno', email: 'd.otieno-teacher@edusys.com', avatarUrl: 'https://picsum.photos/seed/U004/40/40', subjects: ['Biology', 'Chemistry'], classes: ['Form 1A', 'Form 1B', 'Form 4B'], status: 'Active' },
    { id: 'T004', name: 'Susan Kimani', email: 's.kimani@edusys.com', avatarUrl: 'https://picsum.photos/seed/T004/40/40', subjects: ['English', 'Literature'], classes: ['Form 3C', 'Form 4B', 'Form 2A', 'Form 1A'], status: 'On-leave' },
];


export const DASHBOARD_STATS: DashboardStats = {
  totalStudents: 1256,
  averageAttendance: 92.5,
  newAdmissions: 48,
  feeCollectionPercentage: 85,
};

export const ACADEMIC_PERFORMANCE_DATA: PerformanceData[] = [
    { name: 'T1 CAT', 'Average Score': 68 },
    { name: 'T1 Mid', 'Average Score': 72 },
    { name: 'T1 End', 'Average Score': 75 },
    { name: 'T2 CAT', 'Average Score': 71 },
    { name: 'T2 Mid', 'Average Score': 78 },
];

export const ATTENDANCE_TREND_DATA: AttendanceTrendData[] = [
    { name: 'Mon', Attendance: 95 },
    { name: 'Tue', Attendance: 92 },
    { name: 'Wed', Attendance: 93 },
    { name: 'Thu', Attendance: 89 },
    { name: 'Fri', Attendance: 91 },
    { name: 'Mon', Attendance: 94 },
    { name: 'Tue', Attendance: 96 },
];

export const ENROLLMENT_DATA: EnrollmentData[] = [
    { 'Form 1': 310, 'Form 2': 305, 'Form 3': 325, 'Form 4': 316 },
];

export const MOCK_ACADEMIC_YEAR: AcademicYear = {
    year: '2024',
    currentTerm: 'Term 2',
    termStartDate: '2024-05-06',
    termEndDate: '2024-08-02',
};

export const MOCK_SUBJECTS: Subject[] = [
    { id: 'SUB01', name: 'Mathematics', code: '121', curriculum: '8-4-4', formLevels: [1, 2, 3, 4] },
    { id: 'SUB02', name: 'English', code: '101', curriculum: '8-4-4', formLevels: [1, 2, 3, 4] },
    { id: 'SUB03', name: 'Kiswahili', code: '102', curriculum: '8-4-4', formLevels: [1, 2, 3, 4] },
    { id: 'SUB04', name: 'Biology', code: '231', curriculum: '8-4-4', formLevels: [2, 3, 4] },
    { id: 'SUB05', name: 'Physics', code: '232', curriculum: '8-4-4', formLevels: [2, 3, 4] },
    { id: 'SUB06', name: 'History', code: '311', curriculum: '8-4-4', formLevels: [1, 2, 3, 4] },
    { id: 'SUB07', name: 'Chemistry', code: '233', curriculum: '8-4-4', formLevels: [2, 3, 4] },
    { id: 'SUB08', name: 'Literature', code: '204', curriculum: '8-4-4', formLevels: [3, 4] },
];

export const MOCK_CLASSES: SchoolClass[] = [
    { id: 'CLS01', name: 'Form 1A', formLevel: 1, stream: 'A', teacher: 'David Otieno', students: 45, classTeacherId: 'T003' },
    { id: 'CLS02', name: 'Form 1B', formLevel: 1, stream: 'B', teacher: 'Ms. Cherono', students: 48 },
    { id: 'CLS03', name: 'Form 2A', formLevel: 2, stream: 'A', teacher: 'John Kamau', students: 42, classTeacherId: 'U002' },
    { id: 'CLS04', name: 'Form 3C', formLevel: 3, stream: 'C', teacher: 'Mary Wanjiku', students: 46, classTeacherId: 'U003' },
    { id: 'CLS05', name: 'Form 4B', formLevel: 4, stream: 'B', teacher: 'Susan Kimani', students: 40, classTeacherId: 'T004' },
];

export const MOCK_EXAMS: Exam[] = [
    { id: 'EX01', name: 'Mid-Term Exams', type: 'Mid-Term', term: 'Term 2, 2024', startDate: '2024-06-15', status: 'Upcoming', subjects: ['SUB01', 'SUB02', 'SUB03', 'SUB05', 'SUB07'] },
    { id: 'EX02', name: 'CAT 1', type: 'CAT', term: 'Term 2, 2024', startDate: '2024-05-20', status: 'Completed', subjects: ['SUB01', 'SUB02', 'SUB06'], marksLocked: false },
    { id: 'EX03', name: 'End of Term 1 Exams', type: 'End-Term', term: 'Term 1, 2024', startDate: '2024-04-01', status: 'Completed', subjects: ['SUB01', 'SUB02', 'SUB05', 'SUB07'], marksLocked: true },
    { id: 'EX04', name: 'Form 4 Mock Exams', type: 'Mock', term: 'Term 2, 2024', startDate: '2024-07-01', status: 'Upcoming', subjects: ['SUB01', 'SUB02', 'SUB03', 'SUB04', 'SUB05', 'SUB06', 'SUB07', 'SUB08'] },
];

export const MOCK_GRADING_SYSTEM: Grade[] = [
    { name: 'A', minScore: 80, maxScore: 100, comment: 'Excellent' },
    { name: 'A-', minScore: 75, maxScore: 79, comment: 'Very Good' },
    { name: 'B+', minScore: 70, maxScore: 74, comment: 'Good' },
    { name: 'B', minScore: 65, maxScore: 69, comment: 'Good' },
    { name: 'B-', minScore: 60, maxScore: 64, comment: 'Above Average' },
    { name: 'C+', minScore: 55, maxScore: 59, comment: 'Average' },
    { name: 'C', minScore: 50, maxScore: 54, comment: 'Average' },
    { name: 'C-', minScore: 45, maxScore: 49, comment: 'Below Average' },
    { name: 'D+', minScore: 40, maxScore: 44, comment: 'Needs Improvement' },
    { name: 'D', minScore: 35, maxScore: 39, comment: 'Needs Improvement' },
    { name: 'D-', minScore: 30, maxScore: 34, comment: 'Needs Improvement' },
    { name: 'E', minScore: 0, maxScore: 29, comment: 'Unsatisfactory' },
];

export const MOCK_FEE_STRUCTURE: FeeStructure[] = [
    { id: 'FS01', formLevel: 'Form 1', amount: 53554, type: 'Tuition', term: 'Annual', dueDate: '2024-01-31'},
    { id: 'FS02', formLevel: 'Form 2', amount: 53554, type: 'Tuition', term: 'Annual', dueDate: '2024-01-31'},
    { id: 'FS03', formLevel: 'All Forms', amount: 20000, type: 'Boarding', term: 'Term 1', dueDate: '2024-01-31'},
    { id: 'FS04', formLevel: 'All Forms', amount: 5000, type: 'Transport', term: 'Term 1', dueDate: '2024-01-31'},
];

export const MOCK_FEE_INVOICES: FeeInvoice[] = MOCK_STUDENTS.flatMap(student => {
    const invoices = [];
    invoices.push({ id: `INV-${student.id}-T1`, studentId: student.id, description: 'Term 1 Fees', amount: 28000, date: '2024-01-10' });
    if (new Date() > new Date('2024-05-01')) {
        invoices.push({ id: `INV-${student.id}-T2`, studentId: student.id, description: 'Term 2 Fees', amount: 25554, date: '2024-05-01' });
    }
    return invoices;
});

export const MOCK_FEE_PAYMENTS: FeePayment[] = [
    // Student S001 (John Doe) - Partial payment for T1, full for T2
    { id: 'PAY-001', studentId: 'S001', amount: 20000, date: '2024-01-20', method: 'Mpesa' },
    { id: 'PAY-002', studentId: 'S001', amount: 25554, date: '2024-05-15', method: 'Bank' },
    // Student S002 (Jane Smith) - Fully paid
    { id: 'PAY-003', studentId: 'S002', amount: 28000, date: '2024-01-15', method: 'Mpesa' },
    { id: 'PAY-004', studentId: 'S002', amount: 25554, date: '2024-05-10', method: 'Cash' },
    // Student S003 (Peter Jones) - No payments yet
    // Student S004 (Mary Williams) - Paid T1, partial T2
    { id: 'PAY-005', studentId: 'S004', amount: 28000, date: '2024-01-30', method: 'Bank' },
    { id: 'PAY-006', studentId: 'S004', amount: 10000, date: '2024-05-20', method: 'Mpesa' },
    // Student S005 (David Brown) - Paid T1
    { id: 'PAY-007', studentId: 'S005', amount: 28000, date: '2024-02-01', method: 'Mpesa' },
];

export const MOCK_REPORT_TEMPLATES: ReportTemplate[] = [
    { id: 'REP01', title: 'Student Report Cards', description: 'Generate individual student report cards for a specific exam or term.', iconName: 'FileTextIcon' },
    { id: 'REP02', title: 'Class Performance Analysis', description: 'Analyze and compare the performance of different classes.', iconName: 'TrendingUpIcon' },
    { id: 'REP03', title: 'Fee Balance Summary', description: 'Get a summary of outstanding fee balances for all students.', iconName: 'DollarSignIcon' },
    { id: 'REP04', title: 'Attendance Report', description: 'Generate daily, weekly, or monthly attendance reports for classes.', iconName: 'ClipboardListIcon' },
    { id: 'REP05', title: 'Subject Analysis', description: 'View performance breakdown by subject across different forms.', iconName: 'BookOpenIcon' },
    { id: 'REP06', title: 'Enrollment Statistics', description: 'Report on student enrollment numbers and demographics.', iconName: 'UsersIcon' },
];

export const MOCK_ATTENDANCE_RECORDS: AttendanceRecord[] = MOCK_STUDENTS.slice(0, 5).map(s => ({
    studentId: s.id,
    studentName: `${s.firstName} ${s.lastName}`,
    avatarUrl: s.avatarUrl,
    status: 'Unmarked'
}));

const MOCK_TIMETABLE_FORM_3C: TimetableEntry[] = [
  { time: '08:00 - 08:40', monday: { subject: 'Mathematics', teacher: 'John Kamau' }, tuesday: { subject: 'English', teacher: 'Susan Kimani' }, wednesday: { subject: 'Mathematics', teacher: 'John Kamau' }, thursday: { subject: 'English', teacher: 'Susan Kimani' }, friday: { subject: 'Physics', teacher: 'John Kamau' } },
  { time: '08:40 - 09:20', monday: { subject: 'Mathematics', teacher: 'John Kamau' }, tuesday: { subject: 'English', teacher: 'Susan Kimani' }, wednesday: { subject: 'Mathematics', teacher: 'John Kamau' }, thursday: { subject: 'English', teacher: 'Susan Kimani' }, friday: { subject: 'Physics', teacher: 'John Kamau' } },
  { time: '09:20 - 10:00', monday: { subject: 'Kiswahili', teacher: 'Mary Wanjiku' }, tuesday: { subject: 'Biology', teacher: 'David Otieno' }, wednesday: { subject: 'Kiswahili', teacher: 'Mary Wanjiku' }, thursday: { subject: 'Biology', teacher: 'David Otieno' }, friday: { subject: 'Chemistry', teacher: 'David Otieno' } },
  { time: '10:00 - 10:20', monday: null, tuesday: null, wednesday: null, thursday: null, friday: null }, // Break
  { time: '10:20 - 11:00', monday: { subject: 'History', teacher: 'Mary Wanjiku' }, tuesday: { subject: 'Geography', teacher: 'Mrs. Ann' }, wednesday: { subject: 'History', teacher: 'Mary Wanjiku' }, thursday: { subject: 'Geography', 'teacher': 'Mrs. Ann' }, friday: { subject: 'Business', teacher: 'Mr. John' } },
];

const MOCK_TIMETABLE_FORM_2A: TimetableEntry[] = [
  { time: '08:00 - 08:40', monday: { subject: 'English', teacher: 'Susan Kimani' }, tuesday: { subject: 'Mathematics', teacher: 'John Kamau' }, wednesday: { subject: 'English', teacher: 'Susan Kimani' }, thursday: { subject: 'Mathematics', teacher: 'John Kamau' }, friday: { subject: 'History', teacher: 'Mary Wanjiku' } },
  { time: '08:40 - 09:20', monday: { subject: 'English', teacher: 'Susan Kimani' }, tuesday: { subject: 'Mathematics', teacher: 'John Kamau' }, wednesday: { subject: 'English', teacher: 'Susan Kimani' }, thursday: { subject: 'Mathematics', teacher: 'John Kamau' }, friday: { subject: 'History', teacher: 'Mary Wanjiku' } },
  { time: '09:20 - 10:00', monday: { subject: 'Physics', teacher: 'John Kamau' }, tuesday: { subject: 'Kiswahili', teacher: 'Mary Wanjiku' }, wednesday: { subject: 'Physics', teacher: 'John Kamau' }, thursday: { subject: 'Kiswahili', teacher: 'Mary Wanjiku' }, friday: { subject: 'Biology', teacher: 'David Otieno' } },
  { time: '10:00 - 10:20', monday: null, tuesday: null, wednesday: null, thursday: null, friday: null }, // Break
  { time: '10:20 - 11:00', monday: { subject: 'Geography', teacher: 'Mrs. Ann' }, tuesday: { subject: 'Business', teacher: 'Mr. John' }, wednesday: { subject: 'Geography', teacher: 'Mrs. Ann' }, thursday: { subject: 'Business', teacher: 'Mr. John' }, friday: { subject: 'Chemistry', teacher: 'David Otieno' } },
];

export const MOCK_TIMETABLES: { [classId: string]: TimetableEntry[] } = {
    'CLS04': MOCK_TIMETABLE_FORM_3C, // Form 3C
    'CLS03': MOCK_TIMETABLE_FORM_2A, // Form 2A
};

export const MOCK_MESSAGES: Message[] = [
    { id: 'MSG01', sender: 'Principal\'s Office', subject: 'Upcoming Mid-Term Exams', preview: 'This is to inform all students and parents that the mid-term exams will commence', timestamp: '2 hours ago', isRead: false },
    { id: 'MSG02', sender: 'Sports Department', subject: 'Inter-House Sports Day', preview: 'The annual inter-house sports day has been scheduled for next month. All students are', timestamp: 'Yesterday', isRead: true },
    { id: 'MSG03', sender: 'Accounts Office', subject: 'Fee Payment Reminder', preview: 'A gentle reminder that the deadline for Term 2 fee payment is approaching. Please ensure', timestamp: '3 days ago', isRead: true },
];

export const MOCK_BOOKS: Book[] = [
    { id: 'B001', isbn: '978-0134685991', title: 'Effective Java', author: 'Joshua Bloch', category: 'Programming', totalCopies: 5, availableCopies: 2 },
    { id: 'B002', isbn: '978-0596007126', title: 'The C Programming Language', author: 'Brian W. Kernighan', category: 'Programming', totalCopies: 3, availableCopies: 3 },
    { id: 'B003', isbn: '978-9966498064', title: 'Betrayal in the City', author: 'Francis Imbuga', category: 'Literature', totalCopies: 10, availableCopies: 8 },
    { id: 'B004', isbn: '978-9966440261', title: 'A Doll\'s House', author: 'Henrik Ibsen', category: 'Literature', totalCopies: 12, availableCopies: 7 },
    { id: 'B005', isbn: '978-0435892540', title: 'Things Fall Apart', author: 'Chinua Achebe', category: 'Literature', totalCopies: 15, availableCopies: 10 },
];

export const MOCK_ISSUED_BOOKS: BookIssue[] = [
    { id: 'BI01', bookTitle: 'Effective Java', studentName: 'Mary Williams', issueDate: '2024-05-10', dueDate: '2024-05-24', status: 'Issued' },
    { id: 'BI02', bookTitle: 'A Doll\'s House', studentName: 'Peter Jones', issueDate: '2024-05-01', dueDate: '2024-05-15', status: 'Overdue' },
    { id: 'BI03', bookTitle: 'Things Fall Apart', studentName: 'David Brown', issueDate: '2024-05-18', dueDate: '2024-06-01', status: 'Issued' },
];

export const MOCK_VEHICLES: Vehicle[] = [
    { id: 'V01', registrationNumber: 'KDA 123B', capacity: 33, driverName: 'James Kariuki', routeName: 'Route A - Westlands' },
    { id: 'V02', registrationNumber: 'KDB 456C', capacity: 29, driverName: 'Sarah Wambui', routeName: 'Route B - Eastleigh' },
    { id: 'V03', registrationNumber: 'KDC 789D', capacity: 41, driverName: 'David Otieno', routeName: 'Route C - South B' },
];

export const MOCK_ROUTES: Route[] = [
    { id: 'R01', name: 'Route A - Westlands', stops: 12, fare: 8000 },
    { id: 'R02', name: 'Route B - Eastleigh', stops: 15, fare: 7500 },
    { id: 'R03', name: 'Route C - South B', stops: 10, fare: 8500 },
];

export const MOCK_DOCUMENTS: Document[] = [
    { id: 'DOC01', name: 'John Doe - Admission Letter.pdf', studentId: 'S001', studentName: 'John Doe', type: 'Admission Letter', uploadDate: '2022-01-10', fileUrl: '#' },
    { id: 'DOC02', name: 'Jane Smith - Birth Certificate.jpg', studentId: 'S002', studentName: 'Jane Smith', type: 'Birth Certificate', uploadDate: '2021-01-15', fileUrl: '#' },
    { id: 'DOC03', name: 'Peter Jones - Term 1 Report.pdf', studentId: 'S003', studentName: 'Peter Jones', type: 'Transcript', uploadDate: '2023-04-12', fileUrl: '#' },
    { id: 'DOC04', name: 'Mary Williams - Medical Form.pdf', studentId: 'S004', studentName: 'Mary Williams', type: 'Medical Report', uploadDate: '2022-01-15', fileUrl: '#' },
];

export const MOCK_LEARNING_RESOURCES: LearningResource[] = [
  { id: 'LR001', title: 'Chapter 1: Algebra Revision Notes', description: 'Comprehensive notes covering all topics in the first chapter.', subject: 'Mathematics', formClass: 'Form 3C', resourceType: 'Notes (PDF)', fileUrl: '#', uploaderName: 'John Kamau', uploadDate: '2024-05-20' },
  { id: 'LR002', title: 'Photosynthesis Video Explained', description: 'A 10-minute video from Khan Academy explaining photosynthesis.', subject: 'Biology', formClass: 'Form 2A', resourceType: 'Video Link', fileUrl: 'https://www.youtube.com/watch?v=prg2Z4b683Q', uploaderName: 'David Otieno', uploadDate: '2024-05-18' },
  { id: 'LR003', title: 'KCSE 2021 History Paper 1', description: 'Past paper for revision purposes.', subject: 'History', formClass: 'Form 4B', resourceType: 'Assignment (DOC)', fileUrl: '#', uploaderName: 'Mary Wanjiku', uploadDate: '2024-05-15' },
  { id: 'LR004', title: 'The Pearl - Full Text Analysis', description: "Chapter-by-chapter analysis of John Steinbeck's 'The Pearl'.", subject: 'Literature', formClass: 'Form 3C', resourceType: 'Notes (PDF)', fileUrl: '#', uploaderName: 'Susan Kimani', uploadDate: '2024-05-12' },
  { id: 'LR005', title: 'Titration Experiment Guide', description: 'Step-by-step guide for the upcoming chemistry practical.', subject: 'Chemistry', formClass: 'Form 4B', resourceType: 'Notes (PDF)', fileUrl: '#', uploaderName: 'David Otieno', uploadDate: '2024-05-10' },
];
