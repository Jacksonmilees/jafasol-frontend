// API Configuration for Jafasol Frontend
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = this.getBaseURL();
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  getToken(): string | null {
    return this.token;
  }

  // Get base URL with multi-tenant support
  private getBaseURL(): string {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === 'jafasol.com') {
      // For development or main domain, use a default subdomain
      return 'https://test.jafasol.com/api';
    }
    // Extract subdomain from hostname
    const subdomain = hostname.split('.')[0];
    return `https://${subdomain}.jafasol.com/api`;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    // Add custom headers from options
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async verifyToken() {
    return this.request('/auth/verify');
  }

  // Dashboard endpoints
  async getDashboardStats() {
    return this.request('/dashboard');
  }

  async getDashboardAnalytics(params?: {
    period?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.period) queryParams.append('period', params.period);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/dashboard/analytics?${queryString}` : '/dashboard/analytics';
    return this.request(endpoint);
  }

  // User management endpoints
  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.role) queryParams.append('role', params.role);
    if (params?.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/users?${queryString}` : '/users';
    return this.request(endpoint);
  }

  async createUser(userData: any) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: any) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Student management endpoints
  async getStudents(params?: {
    page?: number;
    limit?: number;
    search?: string;
    formClass?: string;
    stream?: string;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.formClass) queryParams.append('formClass', params.formClass);
    if (params?.stream) queryParams.append('stream', params.stream);
    if (params?.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/students?${queryString}` : '/students';
    return this.request(endpoint);
  }

  async createStudent(studentData: {
    admissionNumber: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: 'Male' | 'Female';
    formClass: string;
    stream: string;
    enrollmentDate: string;
    guardianName?: string;
    guardianPhone?: string;
    guardianEmail?: string;
    address?: string;
    emergencyContact?: string;
    medicalConditions?: string;
  }) {
    return this.request('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  }

  async updateStudent(id: string, studentData: Partial<{
    admissionNumber: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: 'Male' | 'Female';
    formClass: string;
    stream: string;
    status: string;
    guardianName: string;
    guardianPhone: string;
    guardianEmail: string;
    address: string;
    emergencyContact: string;
    medicalConditions: string;
  }>) {
    return this.request(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
  }

  async deleteStudent(id: string) {
    return this.request(`/students/${id}`, {
      method: 'DELETE',
    });
  }

  async bulkUploadStudents(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${this.baseURL}/students/bulk-upload`;
    const token = this.getToken();

    const config: RequestInit = {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Bulk upload failed:', error);
      throw error;
    }
  }

  // Teacher management endpoints
  async getTeachers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/teachers?${queryString}` : '/teachers';
    return this.request(endpoint);
  }

  async getTeacher(id: string) {
    return this.request(`/teachers/${id}`);
  }

  async createTeacher(teacherData: {
    name: string;
    email: string;
    subjects: string[];
    classes: string[];
    phone?: string;
    address?: string;
    qualification?: string;
    employmentDate?: string;
  }) {
    return this.request('/teachers', {
      method: 'POST',
      body: JSON.stringify(teacherData),
    });
  }

  async updateTeacher(id: string, teacherData: Partial<{
    name: string;
    email: string;
    subjects: string[];
    classes: string[];
    status: string;
    phone: string;
    address: string;
    qualification: string;
    employmentDate: string;
  }>) {
    return this.request(`/teachers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(teacherData),
    });
  }

  async deleteTeacher(id: string) {
    return this.request(`/teachers/${id}`, {
      method: 'DELETE',
    });
  }

  // Academics endpoints
  async getClasses(params?: {
    page?: number;
    limit?: number;
    search?: string;
    formLevel?: string;
    stream?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.formLevel) queryParams.append('formLevel', params.formLevel);
    if (params?.stream) queryParams.append('stream', params.stream);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/academics/classes?${queryString}` : '/academics/classes';
    return this.request(endpoint);
  }

  async createClass(classData: {
    name: string;
    formLevel: number;
    stream: string;
    teacher: string;
    capacity: number;
  }) {
    return this.request('/academics/classes', {
      method: 'POST',
      body: JSON.stringify(classData),
    });
  }

  async updateClass(id: string, classData: Partial<{
    name: string;
    formLevel: number;
    stream: string;
    teacher: string;
    capacity: number;
  }>) {
    return this.request(`/academics/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(classData),
    });
  }

  async deleteClass(id: string) {
    return this.request(`/academics/classes/${id}`, {
      method: 'DELETE',
    });
  }

  async getSubjects(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/academics/subjects?${queryString}` : '/academics/subjects';
    return this.request(endpoint);
  }

  async createSubject(subjectData: {
    name: string;
    code: string;
    description?: string;
  }) {
    return this.request('/academics/subjects', {
      method: 'POST',
      body: JSON.stringify(subjectData),
    });
  }

  async updateSubject(id: string, subjectData: Partial<{
    name: string;
    code: string;
    description: string;
  }>) {
    return this.request(`/academics/subjects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(subjectData),
    });
  }

  async deleteSubject(id: string) {
    return this.request(`/academics/subjects/${id}`, {
      method: 'DELETE',
    });
  }

  // Attendance endpoints
  async getAttendance(params?: {
    date?: string;
    classId?: string;
    studentId?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.date) queryParams.append('date', params.date);
    if (params?.classId) queryParams.append('classId', params.classId);
    if (params?.studentId) queryParams.append('studentId', params.studentId);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/attendance?${queryString}` : '/attendance';
    return this.request(endpoint);
  }

  async markAttendance(attendanceData: {
    date: string;
    classId: string;
    records: {
      studentId: string;
      status: 'Present' | 'Absent' | 'Late';
      remarks?: string;
    }[];
  }) {
    return this.request('/attendance', {
      method: 'POST',
      body: JSON.stringify(attendanceData),
    });
  }

  // Fees endpoints
  async getFeeStructures(params?: {
    page?: number;
    limit?: number;
    formLevel?: string;
    type?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.formLevel) queryParams.append('formLevel', params.formLevel);
    if (params?.type) queryParams.append('type', params.type);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/fees/structures?${queryString}` : '/fees/structures';
    return this.request(endpoint);
  }

  async createFeeStructure(feeData: {
    formLevel: string;
    amount: number;
    type: 'Tuition' | 'Boarding' | 'Transport';
    term: string;
    dueDate: string;
  }) {
    return this.request('/fees/structures', {
      method: 'POST',
      body: JSON.stringify(feeData),
    });
  }

  async updateFeeStructure(id: string, feeData: Partial<{
    formLevel: string;
    amount: number;
    type: string;
    term: string;
    dueDate: string;
  }>) {
    return this.request(`/fees/structures/${id}`, {
      method: 'PUT',
      body: JSON.stringify(feeData),
    });
  }

  async deleteFeeStructure(id: string) {
    return this.request(`/fees/structures/${id}`, {
      method: 'DELETE',
    });
  }

  async getFeeInvoices(params?: {
    page?: number;
    limit?: number;
    studentId?: string;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.studentId) queryParams.append('studentId', params.studentId);
    if (params?.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/fees/invoices?${queryString}` : '/fees/invoices';
    return this.request(endpoint);
  }

  async createFeeInvoice(invoiceData: {
    studentId: string;
    description: string;
    amount: number;
    date: string;
  }) {
    return this.request('/fees/invoices', {
      method: 'POST',
      body: JSON.stringify(invoiceData),
    });
  }

  async getFeePayments(params?: {
    page?: number;
    limit?: number;
    studentId?: string;
    method?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.studentId) queryParams.append('studentId', params.studentId);
    if (params?.method) queryParams.append('method', params.method);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/fees/payments?${queryString}` : '/fees/payments';
    return this.request(endpoint);
  }

  async createFeePayment(paymentData: {
    studentId: string;
    amount: number;
    method: 'Mpesa' | 'Bank' | 'Cash';
    date: string;
    reference?: string;
  }) {
    return this.request('/fees/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async getStudentFeeStatement(studentId: string) {
    return this.request(`/fees/students/${studentId}/statement`);
  }

  async bulkCreatePayments(payments: {
    studentId: string;
    amount: number;
    method: 'Mpesa' | 'Bank' | 'Cash';
    date: string;
    reference?: string;
  }[]) {
    return this.request('/fees/payments/bulk', {
      method: 'POST',
      body: JSON.stringify({ payments }),
    });
  }

  // Exams endpoints
  async getExams(params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.type) queryParams.append('type', params.type);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/exams?${queryString}` : '/exams';
    return this.request(endpoint);
  }

  async getExam(id: string) {
    return this.request(`/exams/${id}`);
  }

  async createExam(examData: {
    name: string;
    type: 'CAT' | 'Mid-Term' | 'End-Term' | 'Mock';
    term: string;
    startDate: string;
    subjects: string[];
  }) {
    return this.request('/exams', {
      method: 'POST',
      body: JSON.stringify(examData),
    });
  }

  async updateExam(id: string, examData: Partial<{
    name: string;
    type: string;
    term: string;
    startDate: string;
    status: string;
    subjects: string[];
    marksLocked: boolean;
  }>) {
    return this.request(`/exams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(examData),
    });
  }

  async deleteExam(id: string) {
    return this.request(`/exams/${id}`, {
      method: 'DELETE',
    });
  }

  async getExamResults(examId: string, params?: {
    page?: number;
    limit?: number;
    studentId?: string;
    subjectId?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.studentId) queryParams.append('studentId', params.studentId);
    if (params?.subjectId) queryParams.append('subjectId', params.subjectId);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/exams/${examId}/results?${queryString}` : `/exams/${examId}/results`;
    return this.request(endpoint);
  }

  async submitExamResults(examId: string, results: {
    studentId: string;
    subjectId: string;
    score: number;
    comment?: string;
  }[]) {
    return this.request(`/exams/${examId}/results`, {
      method: 'POST',
      body: JSON.stringify({ results }),
    });
  }

  async bulkUploadExamResults(examId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${this.baseURL}/exams/${examId}/results/bulk`;
    const token = this.getToken();

    const config: RequestInit = {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Bulk upload failed:', error);
      throw error;
    }
  }

  // Transport endpoints
  async getVehicles(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    vehicleType?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.vehicleType) queryParams.append('vehicleType', params.vehicleType);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/transport/vehicles?${queryString}` : '/transport/vehicles';
    return this.request(endpoint);
  }

  async createVehicle(vehicleData: {
    vehicleNumber: string;
    vehicleType: string;
    capacity: number;
    driverName: string;
    driverPhone: string;
    status?: string;
    route?: string;
  }) {
    return this.request('/transport/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  }

  async updateVehicle(id: string, vehicleData: Partial<{
    vehicleNumber: string;
    vehicleType: string;
    capacity: number;
    driverName: string;
    driverPhone: string;
    status: string;
    route: string;
  }>) {
    return this.request(`/transport/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData),
    });
  }

  async deleteVehicle(id: string) {
    return this.request(`/transport/vehicles/${id}`, {
      method: 'DELETE',
    });
  }

  async getRoutes(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/transport/routes?${queryString}` : '/transport/routes';
    return this.request(endpoint);
  }

  async createRoute(routeData: {
    routeName: string;
    startPoint: string;
    endPoint: string;
    stops: string[];
    estimatedTime: string;
    vehicleId?: string;
    status?: string;
  }) {
    return this.request('/transport/routes', {
      method: 'POST',
      body: JSON.stringify(routeData),
    });
  }

  async updateRoute(id: string, routeData: Partial<{
    routeName: string;
    startPoint: string;
    endPoint: string;
    stops: string[];
    estimatedTime: string;
    vehicleId: string;
    status: string;
  }>) {
    return this.request(`/transport/routes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(routeData),
    });
  }

  async deleteRoute(id: string) {
    return this.request(`/transport/routes/${id}`, {
      method: 'DELETE',
    });
  }

  // Timetable endpoints
  async getTimetables(params?: {
    page?: number;
    limit?: number;
    classId?: string;
    day?: string;
    subject?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.classId) queryParams.append('classId', params.classId);
    if (params?.day) queryParams.append('day', params.day);
    if (params?.subject) queryParams.append('subject', params.subject);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/timetables?${queryString}` : '/timetables';
    return this.request(endpoint);
  }

  async createTimetable(timetableData: {
    classId: string;
    day: string;
    startTime: string;
    endTime: string;
    subject: string;
    teacherId: string;
    room?: string;
  }) {
    return this.request('/timetables', {
      method: 'POST',
      body: JSON.stringify(timetableData),
    });
  }

  async updateTimetable(id: string, timetableData: Partial<{
    classId: string;
    day: string;
    startTime: string;
    endTime: string;
    subject: string;
    teacherId: string;
    room: string;
  }>) {
    return this.request(`/timetables/${id}`, {
      method: 'PUT',
      body: JSON.stringify(timetableData),
    });
  }

  async deleteTimetable(id: string) {
    return this.request(`/timetables/${id}`, {
      method: 'DELETE',
    });
  }

  // Library endpoints
  async getBooks(params?: {
    page?: number;
    limit?: number;
    title?: string;
    author?: string;
    category?: string;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.title) queryParams.append('title', params.title);
    if (params?.author) queryParams.append('author', params.author);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/library/books?${queryString}` : '/library/books';
    return this.request(endpoint);
  }

  async createBook(bookData: {
    title: string;
    author: string;
    isbn: string;
    category: string;
    copies: number;
    description?: string;
  }) {
    return this.request('/library/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
  }

  async updateBook(id: string, bookData: Partial<{
    title: string;
    author: string;
    isbn: string;
    category: string;
    copies: number;
    description: string;
  }>) {
    return this.request(`/library/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData),
    });
  }

  async deleteBook(id: string) {
    return this.request(`/library/books/${id}`, {
      method: 'DELETE',
    });
  }

  async issueBook(issueData: {
    bookId: string;
    studentId: string;
    issueDate: string;
    dueDate: string;
  }) {
    return this.request('/library/issues', {
      method: 'POST',
      body: JSON.stringify(issueData),
    });
  }

  async returnBook(issueId: string, returnData: {
    returnDate: string;
    remarks?: string;
  }) {
    return this.request(`/library/issues/${issueId}/return`, {
      method: 'PUT',
      body: JSON.stringify(returnData),
    });
  }

  // Communication endpoints
  async getMessages(params?: {
    page?: number;
    limit?: number;
    senderId?: string;
    recipientId?: string;
    type?: string;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.senderId) queryParams.append('senderId', params.senderId);
    if (params?.recipientId) queryParams.append('recipientId', params.recipientId);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/communication?${queryString}` : '/communication';
    return this.request(endpoint);
  }

  async sendMessage(messageData: {
    recipientId: string;
    subject: string;
    content: string;
    type?: string;
  }) {
    return this.request('/communication', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  // Learning Resources endpoints
  async getLearningResources(params?: {
    page?: number;
    limit?: number;
    title?: string;
    subject?: string;
    type?: string;
    grade?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.title) queryParams.append('title', params.title);
    if (params?.subject) queryParams.append('subject', params.subject);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.grade) queryParams.append('grade', params.grade);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/learning-resources?${queryString}` : '/learning-resources';
    return this.request(endpoint);
  }

  async createLearningResource(resourceData: {
    title: string;
    description: string;
    subject: string;
    type: string;
    grade: string;
    fileUrl?: string;
    tags?: string[];
  }) {
    return this.request('/learning-resources', {
      method: 'POST',
      body: JSON.stringify(resourceData),
    });
  }

  async updateLearningResource(id: string, resourceData: Partial<{
    title: string;
    description: string;
    subject: string;
    type: string;
    grade: string;
    fileUrl: string;
    tags: string[];
  }>) {
    return this.request(`/learning-resources/${id}`, {
      method: 'PUT',
      body: JSON.stringify(resourceData),
    });
  }

  async deleteLearningResource(id: string) {
    return this.request(`/learning-resources/${id}`, {
      method: 'DELETE',
    });
  }

  // Reports endpoints
  async getAcademicPerformanceReport(params?: {
    classId?: string;
    subjectId?: string;
    examId?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.classId) queryParams.append('classId', params.classId);
    if (params?.subjectId) queryParams.append('subjectId', params.subjectId);
    if (params?.examId) queryParams.append('examId', params.examId);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/reports/academic-performance?${queryString}` : '/reports/academic-performance';
    return this.request(endpoint);
  }

  async getAttendanceReport(params?: {
    classId?: string;
    studentId?: string;
    startDate?: string;
    endDate?: string;
    type?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.classId) queryParams.append('classId', params.classId);
    if (params?.studentId) queryParams.append('studentId', params.studentId);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.type) queryParams.append('type', params.type);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/reports/attendance?${queryString}` : '/reports/attendance';
    return this.request(endpoint);
  }

  async getFinancialReport(params?: {
    startDate?: string;
    endDate?: string;
    type?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.type) queryParams.append('type', params.type);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/reports/financial?${queryString}` : '/reports/financial';
    return this.request(endpoint);
  }

  // Settings endpoints
  async getSettings() {
    return this.request('/settings');
  }

  async updateSettings(settingsData: {
    schoolName?: string;
    schoolMotto?: string;
    schoolLogo?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
  }) {
    return this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    });
  }

  // Audit logs endpoints
  async getAuditLogs(params?: {
    page?: number;
    limit?: number;
    userId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.userId) queryParams.append('userId', params.userId);
    if (params?.action) queryParams.append('action', params.action);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/audit-logs?${queryString}` : '/audit-logs';
    return this.request(endpoint);
  }

  // Notifications endpoints
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    type?: string;
    priority?: string;
    isRead?: boolean;
    sort?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.type) queryParams.append('type', params.type);
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.isRead !== undefined) queryParams.append('isRead', params.isRead.toString());
    if (params?.sort) queryParams.append('sort', params.sort);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/notifications?${queryString}` : '/notifications';
    return this.request(endpoint);
  }

  async markNotificationAsRead(id: string) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', {
      method: 'PUT',
    });
  }

  // Documents endpoints
  async getDocuments(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    subcategory?: string;
    uploadedBy?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.subcategory) queryParams.append('subcategory', params.subcategory);
    if (params?.uploadedBy) queryParams.append('uploadedBy', params.uploadedBy);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/documents?${queryString}` : '/documents';
    return this.request(endpoint);
  }

  async uploadDocument(file: File, documentData: {
    title: string;
    description: string;
    category: string;
    subcategory: string;
    tags: string[];
  }) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', documentData.title);
    formData.append('description', documentData.description);
    formData.append('category', documentData.category);
    formData.append('subcategory', documentData.subcategory);
    formData.append('tags', JSON.stringify(documentData.tags));

    const url = `${this.baseURL}/documents/upload`;
    const token = this.getToken();

    const config: RequestInit = {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Document upload failed:', error);
      throw error;
    }
  }

  async deleteDocument(id: string) {
    return this.request(`/documents/${id}`, {
      method: 'DELETE',
    });
  }

  // AI endpoints
  async generateTimetable(aiData: {
    classId: string;
    subjects: string[];
    teachers: string[];
    constraints?: any;
  }) {
    return this.request('/ai/generate-timetable', {
      method: 'POST',
      body: JSON.stringify(aiData),
    });
  }

  async chatWithAI(message: string, context?: any, history?: any[]) {
    return this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context, history }),
    });
  }

  async getAIStatus() {
    return this.request('/ai/status');
  }

  // School modules endpoints
  async getSchoolModules() {
    return this.request('/school/modules');
  }

  // Generic request method for custom endpoints
  async customRequest(endpoint: string, options: RequestInit = {}) {
    return this.request(endpoint, options);
  }
}

// Create API instance
export const apiClient = new ApiClient();

// Export for use in components
export default apiClient;