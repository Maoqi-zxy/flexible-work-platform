import axios from 'axios';
import type { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  Task, 
  TaskSubmission,
  ApiResponse,
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

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 认证服务
export const authService = {
  login: async (data: LoginRequest): Promise<{ token: string; user: any }> => {
    const response = await apiClient.post<ApiResponse<any>>('/auth/login', data);
    console.log('login 原始响应:', response);
    // 响应拦截器返回 response.data，即 { success, data: { token, user }, message }
    // 所以 response.data 就是 { token, user }
    const result = response.data || response;
    console.log('login 处理后:', result);
    return {
      token: result.token || result.data?.token,
      user: result.user || result.data?.user,
    };
  },
  
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    console.log('register 原始响应:', response);
    // 响应拦截器返回 response.data，即 { success, data, message }
    // 所以 response.data 是内层数据
    const result = response.data || response;
    console.log('register 处理后:', result);
    return result.data || result;
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
    const response = await apiClient.get<ApiResponse<{ tasks: any[]; pagination: any }>>('/tasks', { params });
    const rawTasks = response.data?.tasks ?? [];
    
    // 后端返回格式与前端 Task 类型不匹配，需要转换
    // 后端: { id: number, budget_min, budget_max, enterprise_name, ... }
    // 前端期望: { id: string, budget: number, publisherName: string, skills: string[], ... }
    return rawTasks.map((task: any) => ({
      id: String(task.id),
      title: task.title,
      description: task.description,
      budget: task.budget_min || task.budget_max || 0,
      deadline: task.deadline,
      status: task.status,
      publisherId: String(task.enterprise_id),
      publisherName: task.enterprise_name || task.company_name || '未知企业',
      skills: [], // 后端未返回 skills，使用空数组
      createdAt: task.created_at,
      updatedAt: task.updated_at,
      category: task.category,
    }));
  },
  
  getTaskById: async (id: string): Promise<Task> => {
    const response = await apiClient.get<ApiResponse<any>>(`/tasks/${id}`);
    const rawTask = response.data || response.data?.data;
    
    // 后端返回格式与前端 Task 类型不匹配，需要转换
    // 后端：{ id: number, budget_min, budget_max, enterprise_name, ... }
    // 前端期望：{ id: string, budget: number, publisherName: string, skills: string[], ... }
    return {
      id: String(rawTask.id),
      title: rawTask.title,
      description: rawTask.description,
      budget: rawTask.budget_min || rawTask.budget_max || 0,
      deadline: rawTask.deadline,
      status: rawTask.status,
      publisherId: String(rawTask.enterprise_id),
      publisherName: rawTask.enterprise_name || rawTask.company_name || '未知企业',
      skills: rawTask.skills ? rawTask.skills.split(',').filter((s: string) => s.trim()) : [],
      createdAt: rawTask.created_at,
      updatedAt: rawTask.updated_at,
      category: rawTask.category,
    };
  },
  
  createTask: async (data: Partial<Task>): Promise<Task> => {
    const response = await apiClient.post<ApiResponse<Task>>('/tasks', data);
    return response.data || response.data?.data;
  },
  
  updateTask: async (id: string, data: Partial<Task>): Promise<Task> => {
    const response = await apiClient.put<ApiResponse<Task>>(`/tasks/${id}`, data);
    return response.data || response.data?.data;
  },
  
  deleteTask: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },
  
  submitTask: async (taskId: string, content: string, attachmentUrls?: string[]): Promise<TaskSubmission> => {
    const response = await apiClient.post<ApiResponse<TaskSubmission>>(`/tasks/${taskId}/submissions`, {
      content,
      attachmentUrls,
    });
    console.log('submitTask 响应:', response);
    return response.data || response.data?.data;
  },
};

// 雇主服务
const employerService = {
  getMyTasks: async (): Promise<Task[]> => {
    const response = await apiClient.get('/my/tasks');
    console.log('getMyTasks 响应:', response);
    
    const rawTasks = (response as any).data?.data || (response as any).data || [];
    // 转换后端格式 → 前端格式
    return rawTasks.map((task: any) => ({
      id: String(task.id),
      title: task.title,
      description: task.description,
      budget: task.budget_min || task.budget_max || 0,
      deadline: task.deadline,
      status: task.status,
      publisherId: String(task.enterprise_id),
      publisherName: task.enterprise_name || task.company_name || '未知企业',
      skills: task.skills ? task.skills.split(',').filter((s: string) => s.trim()) : [],
      createdAt: task.created_at,
      updatedAt: task.updated_at,
      submissionCount: task.submission_count || 0,
    }));
  },
  
  getTaskById: async (id: string): Promise<Task> => {
    const response = await apiClient.get(`/tasks/${id}`);
    const rawTask = (response as any).data?.data || (response as any).data;
    
    return {
      id: String(rawTask.id),
      title: rawTask.title,
      description: rawTask.description,
      budget: rawTask.budget_min || rawTask.budget_max || 0,
      deadline: rawTask.deadline,
      status: rawTask.status,
      publisherId: String(rawTask.enterprise_id),
      publisherName: rawTask.enterprise_name || rawTask.company_name || '未知企业',
      skills: rawTask.skills ? rawTask.skills.split(',').filter((s: string) => s.trim()) : [],
      createdAt: rawTask.created_at,
      updatedAt: rawTask.updated_at,
    };
  },
  
  getTaskSubmissions: async (taskId: string): Promise<any[]> => {
    const response = await apiClient.get(`/tasks/${taskId}/submissions`);
    console.log('getTaskSubmissions 响应:', response);
    
    const rawSubmissions = (response as any).data?.data || (response as any).data || [];
    // 转换后端格式 → 前端格式，确保 freelancer 对象存在
    return rawSubmissions.map((sub: any) => ({
      id: String(sub.id),
      content: sub.content,
      status: sub.status,
      freelancer: {
        id: String(sub.freelancer_id),
        username: sub.freelancer_name || sub.freelancer?.username || '自由职业者',
        email: sub.freelancer_email || sub.freelancer?.email || '',
        avatar: sub.freelancer_avatar || sub.freelancer?.avatar || undefined,
        skills: sub.freelancer_skills ? sub.freelancer_skills.split(',').filter((s: string) => s.trim()) : [],
        rating: sub.freelancer_rating || sub.freelancer?.rating || undefined,
        completedTasks: sub.freelancer_completed_tasks || 0,
      },
      attachmentUrls: sub.attachment_urls || sub.attachmentUrls || [],
      submittedAt: sub.submitted_at || new Date().toISOString(),
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
export { employerService };