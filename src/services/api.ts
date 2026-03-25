import axios from 'axios';
import type { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  Task, 
  TaskSubmission,
  User
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加 token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器 - 统一解包 ApiResponse
apiClient.interceptors.response.use(
  (response) => {
    // 响应格式：{ code, message, data }
    // 直接返回 data 字段
    const responseData = response.data;
    if (responseData && typeof responseData === 'object' && 'data' in responseData) {
      return responseData.data;
    }
    return responseData;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 后端任务类型（与数据库对应）
interface BackendTask {
  id: number;
  title: string;
  description: string;
  budget_min?: number;
  budget_max?: number;
  deadline?: string;
  status: string;
  enterprise_id: number;
  enterprise_name?: string;
  company_name?: string;
  skills?: string;
  created_at: string;
  updated_at: string;
  submission_count?: number;
}

// 后端用户类型
interface BackendUser {
  id: number;
  username: string;
  email: string;
  token: string;
}

// 认证服务
export const authService = {
  login: async (data: LoginRequest): Promise<{ token: string; user: User }> => {
    const response = await apiClient.post<{ token: string; user: BackendUser }>('/auth/login', data);
    const result = response.data ?? response;
    
    const backendUser = result.user;
    return {
      token: result.token || '',
      user: {
        id: String(backendUser.id),
        username: backendUser.username,
        email: backendUser.email,
        userType: 'enterprise' as const,
        createdAt: new Date().toISOString(),
      },
    };
  },
  
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    // 后端返回格式：{ success: true, data: { id, username, email, role, token }, message }
    const result: any = response.data ?? response;
    const userData = result.data || result;
    
    return {
      token: userData.token || '',
      user: {
        id: String(userData.id),
        username: userData.username,
        email: userData.email,
        userType: userData.role || data.userType,
        createdAt: new Date().toISOString(),
      },
    };
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

// 任务服务
export const taskService = {
  getTasks: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    keyword?: string;
  }): Promise<Task[]> => {
    const response = await apiClient.get<any>('/tasks', { params });
    const result = response.data ?? response;
    
    // 兼容两种格式
    const rawTasks: BackendTask[] = Array.isArray(result) ? result : (result.tasks ?? []);
    
    // 转换后端格式 → 前端格式
    return rawTasks.map((task: BackendTask) => ({
      id: String(task.id),
      title: task.title,
      description: task.description,
      budget: task.budget_min ?? task.budget_max ?? 0,
      deadline: task.deadline ?? '',
      status: task.status as Task['status'],
      publisherId: String(task.enterprise_id),
      publisherName: task.enterprise_name ?? task.company_name ?? '未知企业',
      skills: [],
      createdAt: task.created_at,
      updatedAt: task.updated_at,
    }));
  },
  
  getTaskById: async (id: string): Promise<Task> => {
    const response = await apiClient.get<any>(`/tasks/${id}`);
    const rawTask: BackendTask = response.data ?? response;
    
    return {
      id: String(rawTask.id),
      title: rawTask.title,
      description: rawTask.description,
      budget: rawTask.budget_min ?? rawTask.budget_max ?? 0,
      deadline: rawTask.deadline ?? '',
      status: rawTask.status as Task['status'],
      publisherId: String(rawTask.enterprise_id),
      publisherName: rawTask.enterprise_name ?? rawTask.company_name ?? '未知企业',
      skills: rawTask.skills ? rawTask.skills.split(',').map((s: string) => s.trim()).filter(s => s) : [],
      createdAt: rawTask.created_at,
      updatedAt: rawTask.updated_at,
    };
  },
  
  createTask: async (data: Partial<Task>): Promise<Task> => {
    const response = await apiClient.post<any>('/tasks', data);
    return response.data ?? response;
  },
  
  updateTask: async (id: string, data: Partial<Task>): Promise<Task> => {
    const response = await apiClient.put<any>(`/tasks/${id}`, data);
    return response.data ?? response;
  },
  
  deleteTask: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },
  
  submitTask: async (taskId: string, content: string, attachmentUrls?: string[]): Promise<TaskSubmission> => {
    const response = await apiClient.post<any>(`/tasks/${taskId}/submissions`, {
      content,
      attachmentUrls,
    });
    return response.data ?? response;
  },
};

// 雇主服务
export const employerService = {
  getMyTasks: async (): Promise<Task[]> => {
    const response = await apiClient.get<any>('/my/tasks');
    const result = response.data ?? response;
    
    const rawTasks: BackendTask[] = Array.isArray(result) ? result : (result.data ?? []);
    return rawTasks.map((task: BackendTask) => ({
      id: String(task.id),
      title: task.title,
      description: task.description,
      budget: task.budget_min ?? task.budget_max ?? 0,
      deadline: task.deadline ?? '',
      status: task.status as Task['status'],
      publisherId: String(task.enterprise_id),
      publisherName: task.enterprise_name ?? task.company_name ?? '未知企业',
      skills: task.skills ? task.skills.split(',').map((s: string) => s.trim()).filter(s => s) : [],
      createdAt: task.created_at,
      updatedAt: task.updated_at,
    }));
  },
  
  getTaskById: async (id: string): Promise<Task> => {
    const response = await apiClient.get<any>(`/tasks/${id}`);
    const rawTask: BackendTask = response.data ?? response;
    
    return {
      id: String(rawTask.id),
      title: rawTask.title,
      description: rawTask.description,
      budget: rawTask.budget_min ?? rawTask.budget_max ?? 0,
      deadline: rawTask.deadline ?? '',
      status: rawTask.status as Task['status'],
      publisherId: String(rawTask.enterprise_id),
      publisherName: rawTask.enterprise_name ?? rawTask.company_name ?? '未知企业',
      skills: rawTask.skills ? rawTask.skills.split(',').map((s: string) => s.trim()).filter(s => s) : [],
      createdAt: rawTask.created_at,
      updatedAt: rawTask.updated_at,
    };
  },
  
  getTaskSubmissions: async (taskId: string): Promise<any[]> => {
    const response = await apiClient.get<any>(`/tasks/${taskId}/submissions`);
    const rawSubmissions: any[] = Array.isArray(response.data) ? response.data : (response.data?.data ?? []);
    
    return rawSubmissions.map((sub: any) => ({
      id: String(sub.id),
      content: sub.content,
      status: sub.status,
      freelancer: {
        id: String(sub.freelancer_id),
        username: sub.freelancer_name ?? sub.freelancer?.username ?? '自由职业者',
        email: sub.freelancer_email ?? sub.freelancer?.email ?? '',
        avatar: sub.freelancer_avatar ?? sub.freelancer?.avatar ?? undefined,
        skills: sub.freelancer_skills ? sub.freelancer_skills.split(',').map((s: any) => String(s).trim()).filter((s: any) => s) : [],
        rating: sub.freelancer_rating ?? sub.freelancer?.rating ?? undefined,
        completedTasks: sub.freelancer_completed_tasks ?? 0,
      },
      attachmentUrls: sub.attachment_urls ?? sub.attachmentUrls ?? [],
      submittedAt: sub.submitted_at ?? new Date().toISOString(),
    }));
  },
  
  approveSubmission: async (submissionId: string): Promise<void> => {
    await apiClient.post(`/submissions/${submissionId}/review`, {
      status: 'approved',
    });
  },
  
  rejectSubmission: async (submissionId: string): Promise<void> => {
    await apiClient.post(`/submissions/${submissionId}/review`, {
      status: 'rejected',
    });
  },
};

export default apiClient;