// API Configuration for Jafasol Frontend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://jafasol.com/api';
const ADMIN_API_URL = process.env.REACT_APP_ADMIN_API_URL || 'https://jafasol.com/api/admin';

// API Client with authentication
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
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

  // User management endpoints
  async getUsers() {
    return this.request('/users');
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
  async getStudents() {
    return this.request('/students');
  }

  async createStudent(studentData: any) {
    return this.request('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  }

  async updateStudent(id: string, studentData: any) {
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

  // Teacher management endpoints
  async getTeachers() {
    return this.request('/teachers');
  }

  async createTeacher(teacherData: any) {
    return this.request('/teachers', {
      method: 'POST',
      body: JSON.stringify(teacherData),
    });
  }

  async updateTeacher(id: string, teacherData: any) {
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
  async getClasses() {
    return this.request('/academics/classes');
  }

  async getSubjects() {
    return this.request('/academics/subjects');
  }

  // Attendance endpoints
  async getAttendance(date?: string) {
    const params = date ? `?date=${date}` : '';
    return this.request(`/attendance${params}`);
  }

  async markAttendance(attendanceData: any) {
    return this.request('/attendance', {
      method: 'POST',
      body: JSON.stringify(attendanceData),
    });
  }

  // Exams endpoints
  async getExams() {
    return this.request('/exams');
  }

  async createExam(examData: any) {
    return this.request('/exams', {
      method: 'POST',
      body: JSON.stringify(examData),
    });
  }

  // Fees endpoints
  async getFees() {
    return this.request('/fees');
  }

  async createFeeStructure(feeData: any) {
    return this.request('/fees/structures', {
      method: 'POST',
      body: JSON.stringify(feeData),
    });
  }

  // Reports endpoints
  async getReports() {
    return this.request('/reports');
  }

  // Settings endpoints
  async getSettings() {
    return this.request('/settings');
  }

  async updateSettings(settingsData: any) {
    return this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    });
  }

  // Audit logs endpoints
  async getAuditLogs() {
    return this.request('/audit-logs');
  }
}

// Create API instances
export const apiClient = new ApiClient(API_BASE_URL);
export const adminApiClient = new ApiClient(ADMIN_API_URL);

// Export for use in components
export default apiClient; 