// 用户类型
export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  userType: 'enterprise' | 'freelancer';
  companyName?: string;
  skills?: string[];
  createdAt: string;
}

// 任务类型
export interface Task {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  status: 'open' | 'in_progress' | 'completed' | 'closed';
  publisherId: string;
  publisherName: string;
  publisherAvatar?: string;
  skills: string[];
  submitterId?: string;
  submitterName?: string;
  createdAt: string;
  updatedAt: string;
}

// 任务提交
export interface TaskSubmission {
  id: string;
  taskId: string;
  submitterId: string;
  submitterName: string;
  content: string;
  attachmentUrls?: string[];
  status: 'pending' | 'accepted' | 'rejected';
  submittedAt: string;
}

// 雇主任务（包含申请数量）
export interface EmployerTask extends Task {
  submissionCount: number;
}

// 自由职业者信息
export interface FreelancerProfile {
  id: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  skills?: string[];
  rating?: number;
  completedTasks?: number;
}

// 登录注册接口
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  userType: 'enterprise' | 'freelancer';
  companyName?: string;
  skills?: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

// API 响应类型
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}