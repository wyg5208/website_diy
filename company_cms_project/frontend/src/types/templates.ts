import { v4 as uuidv4 } from 'uuid';
import type { PageComponent } from './components';

// 模板定义
export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;  // 预览图或颜色标识
  category: 'default' | 'corporate' | 'tech' | 'service';
  components: PageComponent[];
}

// 生成带唯一ID的组件
const createComponent = (type: string, props: Record<string, any>): PageComponent => ({
  id: uuidv4(),
  type,
  props,
} as PageComponent);

// ========== 默认模板（系统首页风格）==========
const defaultTemplate: PageTemplate = {
  id: 'tpl-default',
  name: '默认模板',
  description: '系统默认首页风格，简洁大气，适合快速上线',
  preview: '#1677ff',
  category: 'default',
  components: [
    createComponent('hero', {
      title: '助力企业实现数字资产的高效管理',
      subtitle: '基于 Python Flask 与 React 构建的新一代企业级内容管理系统，为您提供极致的性能与灵活的扩展能力。',
      backgroundColor: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      height: 400,
      textAlign: 'center',
      buttonText: '立即开始',
    }),
    createComponent('text', {
      content: '核心优势',
      fontSize: 32,
      fontWeight: 'bold',
      textAlign: 'center',
      padding: 48,
    }),
    createComponent('cards', {
      columns: 3,
      items: [
        { title: '极致安全', description: '采用 JWT 无状态认证与 SQLite3 WAL 模式，确保数据安全与高并发读取性能。' },
        { title: '协作高效', description: '内置 RBAC 权限模型，支持多角色协同办公，让内容发布流程更清晰。' },
        { title: '部署灵活', description: '完美适配 Windows Server，利用 Nginx 反向代理提供稳定的 Web 服务环境。' },
      ],
    }),
    createComponent('divider', { style: 'solid', margin: 40 }),
    createComponent('text', {
      content: '最新动态',
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      padding: 32,
    }),
    createComponent('text', {
      content: '关注我们的最新资讯与技术分享，了解更多行业动态。',
      fontSize: 16,
      textAlign: 'center',
      padding: 16,
      color: '#666',
    }),
    createComponent('button', {
      text: '查看全部文章',
      variant: 'default',
      size: 'large',
      block: false,
    }),
  ],
};

// ========== 模板一：企业官网（稳重大气）==========
const corporateTemplate: PageTemplate = {
  id: 'tpl-corporate',
  name: '企业官网',
  description: '适合传统企业、集团公司，风格稳重大气，突出品牌实力',
  preview: '#1a365d',
  category: 'corporate',
  components: [
    createComponent('hero', {
      title: '专注品质，成就卓越',
      subtitle: '二十年行业深耕，为全球客户提供专业解决方案',
      backgroundColor: '#1a365d',
      height: 500,
      textAlign: 'center',
      buttonText: '了解更多',
    }),
    createComponent('text', {
      content: '关于我们',
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      padding: 40,
    }),
    createComponent('text', {
      content: '我们是一家专注于行业解决方案的领先企业，拥有20年的丰富经验。凭借卓越的技术实力和专业的服务团队，我们已为全球超过1000家企业提供了优质服务，赢得了客户的广泛信赖。',
      fontSize: 16,
      textAlign: 'center',
      padding: 24,
      color: '#666',
    }),
    createComponent('cards', {
      columns: 3,
      items: [
        { title: '20年', description: '行业经验积累' },
        { title: '1000+', description: '服务企业客户' },
        { title: '50+', description: '覆盖国家地区' },
      ],
    }),
    createComponent('divider', { style: 'solid', margin: 40 }),
    createComponent('text', {
      content: '核心业务',
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      padding: 40,
    }),
    createComponent('cards', {
      columns: 3,
      items: [
        { title: '战略咨询', description: '为企业提供全方位的战略规划与咨询服务' },
        { title: '技术服务', description: '专业的技术团队，提供定制化解决方案' },
        { title: '运营支持', description: '全生命周期的运营支持与售后保障' },
      ],
    }),
    createComponent('divider', { style: 'solid', margin: 40 }),
    createComponent('form', {
      title: '商务合作咨询',
      fields: [
        { name: 'company', label: '公司名称', type: 'text', required: true },
        { name: 'contact', label: '联系人', type: 'text', required: true },
        { name: 'phone', label: '联系电话', type: 'phone', required: true },
        { name: 'message', label: '合作意向', type: 'textarea', required: false },
      ],
      submitText: '提交咨询',
    }),
  ],
};

// ========== 模板二：科技公司（现代简约）==========
const techTemplate: PageTemplate = {
  id: 'tpl-tech',
  name: '科技公司',
  description: '适合互联网、科技企业，风格现代简约，强调创新与技术',
  preview: '#6366f1',
  category: 'tech',
  components: [
    createComponent('hero', {
      title: '用科技重新定义未来',
      subtitle: 'AI驱动 · 云原生 · 全球化部署',
      backgroundColor: '#6366f1',
      height: 480,
      textAlign: 'center',
      buttonText: '立即体验',
    }),
    createComponent('text', {
      content: '我们的技术优势',
      fontSize: 32,
      fontWeight: 'bold',
      textAlign: 'center',
      padding: 48,
    }),
    createComponent('cards', {
      columns: 4,
      items: [
        { title: '人工智能', description: '深度学习算法，智能决策引擎' },
        { title: '云计算', description: '弹性扩展，99.99%可用性' },
        { title: '大数据', description: 'PB级数据处理能力' },
        { title: '安全合规', description: '多重加密，全球合规认证' },
      ],
    }),
    createComponent('divider', { style: 'dashed', margin: 32, color: '#e5e7eb' }),
    createComponent('text', {
      content: '产品矩阵',
      fontSize: 32,
      fontWeight: 'bold',
      textAlign: 'center',
      padding: 48,
    }),
    createComponent('cards', {
      columns: 3,
      items: [
        { title: 'CloudOS', description: '企业级云操作系统，一站式管理所有云资源' },
        { title: 'DataHub', description: '智能数据中台，打通数据孤岛' },
        { title: 'AIStudio', description: 'AI开发平台，零代码构建模型' },
      ],
    }),
    createComponent('text', {
      content: '全球客户信赖',
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      padding: 40,
    }),
    createComponent('text', {
      content: '已服务超过 500+ 企业客户，涵盖金融、医疗、制造、零售等多个行业',
      fontSize: 16,
      textAlign: 'center',
      padding: 16,
      color: '#6b7280',
    }),
    createComponent('button', {
      text: '预约产品演示',
      variant: 'primary',
      size: 'large',
      block: false,
    }),
    createComponent('divider', { style: 'solid', margin: 48 }),
    createComponent('form', {
      title: '获取解决方案',
      fields: [
        { name: 'name', label: '姓名', type: 'text', required: true },
        { name: 'email', label: '工作邮箱', type: 'email', required: true },
        { name: 'requirement', label: '需求描述', type: 'textarea', required: true },
      ],
      submitText: '获取方案',
    }),
  ],
};

// ========== 模板三：服务机构（温馨专业）==========
const serviceTemplate: PageTemplate = {
  id: 'tpl-service',
  name: '服务机构',
  description: '适合教育、医疗、咨询等服务机构，风格温馨专业，强调信任与关怀',
  preview: '#059669',
  category: 'service',
  components: [
    createComponent('hero', {
      title: '用心服务，陪伴成长',
      subtitle: '专业团队 · 贴心服务 · 值得信赖',
      backgroundColor: '#059669',
      height: 450,
      textAlign: 'center',
      buttonText: '预约咨询',
    }),
    createComponent('text', {
      content: '为什么选择我们',
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      padding: 40,
    }),
    createComponent('cards', {
      columns: 3,
      items: [
        { title: '专业团队', description: '资深专家团队，平均从业经验超过10年' },
        { title: '个性方案', description: '根据您的需求，量身定制专属服务方案' },
        { title: '全程跟进', description: '一对一服务顾问，全程跟踪服务进度' },
      ],
    }),
    createComponent('divider', { style: 'solid', margin: 32 }),
    createComponent('text', {
      content: '服务项目',
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      padding: 40,
    }),
    createComponent('cards', {
      columns: 2,
      items: [
        { title: '基础咨询服务', description: '提供专业的咨询建议，帮助您理清思路，明确方向' },
        { title: '深度定制服务', description: '深入了解您的需求，提供一站式定制化解决方案' },
        { title: '长期陪伴计划', description: '持续跟进，定期回访，成为您值得信赖的长期伙伴' },
        { title: '增值服务包', description: '额外提供培训、资源对接等多项增值服务' },
      ],
    }),
    createComponent('text', {
      content: '客户评价',
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      padding: 40,
    }),
    createComponent('text', {
      content: '"服务非常专业，团队响应迅速，帮我们解决了很多实际问题。强烈推荐！" —— 张女士',
      fontSize: 16,
      textAlign: 'center',
      padding: 24,
      color: '#666',
    }),
    createComponent('divider', { style: 'solid', margin: 40 }),
    createComponent('form', {
      title: '在线预约',
      fields: [
        { name: 'name', label: '您的姓名', type: 'text', required: true },
        { name: 'phone', label: '联系电话', type: 'phone', required: true },
        { name: 'service', label: '咨询项目', type: 'text', required: false },
        { name: 'message', label: '补充说明', type: 'textarea', required: false },
      ],
      submitText: '提交预约',
    }),
  ],
};

// 导出所有模板
export const PAGE_TEMPLATES: PageTemplate[] = [
  defaultTemplate,
  corporateTemplate,
  techTemplate,
  serviceTemplate,
];

// 根据ID获取模板
export const getTemplateById = (id: string): PageTemplate | undefined => {
  return PAGE_TEMPLATES.find((t) => t.id === id);
};

// 克隆模板组件（生成新ID）
export const cloneTemplateComponents = (template: PageTemplate): PageComponent[] => {
  return template.components.map((comp) => ({
    ...comp,
    id: uuidv4(),
    props: { ...comp.props },
  })) as PageComponent[];
};
