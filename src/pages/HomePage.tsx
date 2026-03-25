import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { taskService } from '../services/api';
import type { Task } from '../types';

// Mock 数据 (后端 API 未就绪时使用)
const mockTasks: Task[] = [
  {
    id: '1',
    title: '企业官网 redesign',
    description: '需要重新设计我们公司官网，包括首页、关于我们、产品展示等页面。希望有现代化的设计风格，响应式布局。',
    budget: 8000,
    deadline: '2024-04-15',
    status: 'open',
    publisherId: '101',
    publisherName: '科技创新公司',
    skills: ['UI 设计', 'React', '响应式设计'],
    createdAt: '2024-03-18T10:00:00Z',
    updatedAt: '2024-03-18T10:00:00Z',
  },
  {
    id: '2',
    title: '微信小程序开发',
    description: '开发一个电商类微信小程序，包含商品展示、购物车、订单管理等功能。需要有类似项目经验。',
    budget: 15000,
    deadline: '2024-04-30',
    status: 'open',
    publisherId: '102',
    publisherName: '电商平台',
    skills: ['微信小程序', 'JavaScript', '云服务'],
    createdAt: '2024-03-17T14:30:00Z',
    updatedAt: '2024-03-17T14:30:00Z',
  },
  {
    id: '3',
    title: '数据可视化大屏',
    description: '为公司内部管理系统开发数据可视化大屏，需要展示实时业务数据，使用 ECharts 或 D3.js。',
    budget: 12000,
    deadline: '2024-04-20',
    status: 'open',
    publisherId: '103',
    publisherName: '数据科技公司',
    skills: ['数据可视化', 'ECharts', 'Vue'],
    createdAt: '2024-03-16T09:15:00Z',
    updatedAt: '2024-03-16T09:15:00Z',
  },
  {
    id: '4',
    title: '移动端 H5 活动页面',
    description: '制作一个营销活动的 H5 页面，包含动画效果、互动游戏、分享功能等。需要适配各种手机型号。',
    budget: 5000,
    deadline: '2024-04-10',
    status: 'open',
    publisherId: '104',
    publisherName: '营销广告公司',
    skills: ['H5 开发', '动画效果', '移动端适配'],
    createdAt: '2024-03-15T16:45:00Z',
    updatedAt: '2024-03-15T16:45:00Z',
  },
  {
    id: '5',
    title: '后台管理系统开发',
    description: '开发一个完整的后台管理系统，包含用户管理、权限控制、数据报表等模块。使用 React + Ant Design。',
    budget: 20000,
    deadline: '2024-05-15',
    status: 'open',
    publisherId: '105',
    publisherName: '企业管理软件公司',
    skills: ['React', 'Ant Design', 'TypeScript'],
    createdAt: '2024-03-14T11:20:00Z',
    updatedAt: '2024-03-14T11:20:00Z',
  },
  {
    id: '6',
    title: 'WordPress 主题定制',
    description: '基于现有 WordPress 模板进行定制开发，修改样式、添加自定义功能模块。',
    budget: 3000,
    deadline: '2024-04-05',
    status: 'open',
    publisherId: '106',
    publisherName: '内容媒体公司',
    skills: ['WordPress', 'PHP', 'CSS'],
    createdAt: '2024-03-13T13:00:00Z',
    updatedAt: '2024-03-13T13:00:00Z',
  },
];

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      // 优先尝试从 API 获取，失败则使用 mock 数据
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('加载任务失败，使用 mock 数据:', error);
      setTasks(mockTasks);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesKeyword = !keyword || 
      task.title.toLowerCase().includes(keyword.toLowerCase()) ||
      task.description.toLowerCase().includes(keyword.toLowerCase());
    return matchesFilter && matchesKeyword;
  });

  const getStatusText = (status: Task['status']) => {
    const statusMap = {
      open: '招募中',
      in_progress: '进行中',
      completed: '已完成',
      closed: '已关闭',
    };
    return statusMap[status];
  };

  const getStatusColor = (status: Task['status']) => {
    const colorMap = {
      open: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-purple-100 text-purple-800',
      closed: 'bg-gray-100 text-gray-800',
    };
    return colorMap[status];
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 头部 Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">找到理想的灵活用工机会</h1>
        <p className="text-primary-100 text-lg mb-6">
          连接企业与自由职业者，打造高效、透明、共赢的任务对接平台
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
            <div className="text-2xl font-bold">{tasks.length}</div>
            <div className="text-sm text-primary-100">在招任务</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
            <div className="text-2xl font-bold">500+</div>
            <div className="text-sm text-primary-100">注册用户</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
            <div className="text-2xl font-bold">98%</div>
            <div className="text-sm text-primary-100">满意度</div>
          </div>
        </div>
      </div>

      {/* 筛选和搜索 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {['all', 'open', 'in_progress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status === 'all' ? '全部' : getStatusText(status as Task['status'])}
            </button>
          ))}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="搜索任务..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="input-field pl-10 w-full md:w-64"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* 任务列表 */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">暂无任务</h3>
          <p className="text-gray-500">请稍后再来查看新任务</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <Link key={task.id} to={`/task/${task.id}`} className="card block group">
              <div className="flex items-start justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                  {getStatusText(task.status)}
                </span>
                <span className="text-gray-500 text-sm">
                  {new Date(task.createdAt).toLocaleDateString('zh-CN')}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                {task.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {task.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {(() => {
                  // 后端返回的 skills 可能是字符串 "UI 设计，Figma,Sketch" 或数组
                  const skillsArray = typeof task.skills === 'string' 
                    ? task.skills.split(',').filter(s => s.trim()) 
                    : (Array.isArray(task.skills) ? task.skills : []);
                  return skillsArray.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded"
                    >
                      {skill}
                    </span>
                  ));
                })()}
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium text-sm">
                      {task.publisherName ? task.publisherName.charAt(0) : '用'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">{task.publisherName || '匿名用户'}</span>
                </div>
                <div className="text-primary-600 font-bold">
                  ¥{task.budget.toLocaleString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}