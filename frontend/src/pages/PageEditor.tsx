import React, { useState, useEffect } from 'react';
import { Layout, Card, Button, Space, message, Empty, Input, Form, Select, InputNumber, Switch, ColorPicker, Modal, Flex, Collapse } from 'antd';
import {
  PictureOutlined,
  FontSizeOutlined,
  FileImageOutlined,
  BorderOutlined,
  AppstoreOutlined,
  FormOutlined,
  IdcardOutlined,
  LineOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SaveOutlined,
  EyeOutlined,
  PlusOutlined,
  AppstoreAddOutlined,
  ClearOutlined,
  CloudUploadOutlined,
  FileOutlined,
} from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { v4 as uuidv4 } from 'uuid';
import ComponentRenderer from '../components/ComponentRenderer';
import ImagePicker from '../components/ImagePicker';
import { COMPONENT_LIST, type PageComponent, type ComponentType } from '../types/components';
import { savePageConfig, getPageConfig } from '../api/pages';
import { getEditablePages } from '../api/menus';
import { getCategoriesAndTags } from '../api/posts';

const { Sider, Content } = Layout;

// 图标映射
const ICON_MAP: Record<string, React.ReactNode> = {
  PictureOutlined: <PictureOutlined />,
  FontSizeOutlined: <FontSizeOutlined />,
  FileImageOutlined: <FileImageOutlined />,
  BorderOutlined: <BorderOutlined />,
  AppstoreOutlined: <AppstoreOutlined />,
  FormOutlined: <FormOutlined />,
  IdcardOutlined: <IdcardOutlined />,
  LineOutlined: <LineOutlined />,
};

// 按钮图标选项
const BUTTON_ICON_OPTIONS = [
  { value: '', label: '无图标' },
  { value: 'SearchOutlined', label: '搜索' },
  { value: 'RightOutlined', label: '右箭头' },
  { value: 'LeftOutlined', label: '左箭头' },
  { value: 'HomeOutlined', label: '首页' },
  { value: 'LinkOutlined', label: '链接' },
  { value: 'EnvironmentOutlined', label: '位置' },
  { value: 'PhoneOutlined', label: '电话' },
  { value: 'MailOutlined', label: '邮件' },
  { value: 'SendOutlined', label: '发送' },
  { value: 'DownloadOutlined', label: '下载' },
  { value: 'PlayCircleOutlined', label: '播放' },
  { value: 'HeartOutlined', label: '爱心' },
  { value: 'StarOutlined', label: '星标' },
  { value: 'SettingOutlined', label: '设置' },
  { value: 'UserOutlined', label: '用户' },
  { value: 'TeamOutlined', label: '团队' },
  { value: 'ShoppingCartOutlined', label: '购物车' },
  { value: 'CustomerServiceOutlined', label: '客服' },
  { value: 'BellOutlined', label: '通知' },
  { value: 'GiftOutlined', label: '礼物' },
  { value: 'CalendarOutlined', label: '日历' },
  { value: 'CameraOutlined', label: '相机' },
  { value: 'EditOutlined', label: '编辑' },
  { value: 'ShareAltOutlined', label: '分享' },
  { value: 'LikeOutlined', label: '点赞' },
  { value: 'MessageOutlined', label: '消息' },
  { value: 'QuestionCircleOutlined', label: '帮助' },
  { value: 'CheckCircleOutlined', label: '成功' },
  { value: 'CloseCircleOutlined', label: '关闭' },
  { value: 'InfoCircleOutlined', label: '信息' },
  { value: 'WarningOutlined', label: '警告' },
];

// 可排序组件包装器
const SortableItem: React.FC<{
  id: string;
  component: PageComponent;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (componentId: string) => void;
}> = ({ id, component, isSelected, onSelect, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // 处理点击事件，避免被 dnd-kit 拦截
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      onClick={handleClick}
    >
      <ComponentRenderer
        component={component}
        isEditing={true}
        isSelected={isSelected}
        onSelect={onSelect}
        onDelete={onDelete}
      />
    </div>
  );
};

const PageEditor: React.FC = () => {
  const [components, setComponents] = useState<PageComponent[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pageName, setPageName] = useState('首页');
  const [previewMode, setPreviewMode] = useState(false);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [_loading, _setLoading] = useState(false);
  const [currentPageKey, setCurrentPageKey] = useState('home');
  const [pageList, setPageList] = useState<{key: string; title: string; path: string}[]>([]);
  const [categories, setCategories] = useState<any[]>([]); // 分类列表
  const [tags, setTags] = useState<any[]>([]); // 标签列表
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // 激活约束：移动 8px 后才开始拖拽，这样点击不会触发拖拽
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // 加载页面列表
  useEffect(() => {
    const loadPageList = async () => {
      try {
        const res = await getEditablePages();
        setPageList(res.data || []);
      } catch (error) {
        console.error('Failed to load page list:', error);
        // 默认页面列表
        setPageList([
          { key: 'home', title: '网站首页', path: '/' },
          { key: 'solutions', title: '解决方案', path: '/solutions' },
          { key: 'cases', title: '成功案例', path: '/cases' },
          { key: 'about', title: '关于我们', path: '/about' },
        ]);
      }
    };
    loadPageList();
  }, []);

  // 加载分类和标签列表
  useEffect(() => {
    const loadCategoriesAndTags = async () => {
      try {
        const res = await getCategoriesAndTags();
        setCategories(res.data.categories || []);
        setTags(res.data.tags || []);
      } catch (error) {
        console.error('Failed to load categories and tags:', error);
      }
    };
    loadCategoriesAndTags();
  }, []);

  // 从 URL 参数获取当前页面（同步获取，避免时序问题）
  const pageKeyFromUrl = searchParams.get('page') || 'home';
  
  // 当 URL 参数变化时更新 currentPageKey
  useEffect(() => {
    setCurrentPageKey(pageKeyFromUrl);
  }, [pageKeyFromUrl]);

  // 加载页面数据 - 只依赖 currentPageKey，避免重复加载
  useEffect(() => {
    const loadPageData = async () => {
      if (!currentPageKey) return;
      
      _setLoading(true);
      // 检查本地草稿
      const draftKey = `page_draft_${currentPageKey}`;
      const draft = localStorage.getItem(draftKey);
      if (draft) {
        try {
          const data = JSON.parse(draft);
          if (data.components && Array.isArray(data.components)) {
            setComponents(data.components);
            setPageName(data.name || currentPageKey);
            setTemplateId(data.templateId || null);
            _setLoading(false);
            message.info(`已加载本地草稿: ${data.name || '草稿'}`);
            return;
          }
        } catch (e) {
          console.error('Failed to load draft:', e);
        }
      }
      
      // 从后端加载
      try {
        console.log(`[PageEditor] 正在加载页面: ${currentPageKey}`);
        const res = await getPageConfig(currentPageKey);
        console.log(`[PageEditor] 加载结果:`, res);
        if (res.data && res.data.components && res.data.components.length > 0) {
          setComponents(res.data.components);
          setPageName(res.data.name || currentPageKey);
          setTemplateId(res.data.templateId || null);
          console.log(`[PageEditor] 成功加载 ${res.data.components.length} 个组件`);
        } else {
          // 新页面，清空内容
          console.log(`[PageEditor] 页面为空或不存在，初始化为新页面`);
          setComponents([]);
          // 为特定页面设置默认名称
          const defaultNames: Record<string, string> = {
            'solutions': '解决方案',
            'cases': '成功案例',
            'about': '关于我们'
          };
          setPageName(defaultNames[currentPageKey] || currentPageKey);
          setTemplateId(null);
        }
      } catch (e) {
        console.error('[PageEditor] 加载页面失败:', e);
        // 页面不存在，初始化为空
        setComponents([]);
        const defaultNames: Record<string, string> = {
          'solutions': '解决方案',
          'cases': '成功案例',
          'about': '关于我们'
        };
        setPageName(defaultNames[currentPageKey] || currentPageKey);
        setTemplateId(null);
      } finally {
        _setLoading(false);
      }
    };
    
    loadPageData();
    // 注意：不依赖 pageList，避免 pageList 加载后触发重复加载
  }, [currentPageKey]);

  const selectedComponent = components.find((c) => c.id === selectedId);

  // 添加组件
  const handleAddComponent = (type: ComponentType) => {
    const config = COMPONENT_LIST.find((c) => c.type === type);
    if (!config) return;

    const newComponent: PageComponent = {
      id: uuidv4(),
      type,
      props: { ...config.defaultProps },
    } as PageComponent;

    setComponents([...components, newComponent]);
    setSelectedId(newComponent.id);
    message.success(`已添加 ${config.label}`);
  };

  // 删除组件
  const handleDelete = () => {
    if (!selectedId) return;
    setComponents(components.filter((c) => c.id !== selectedId));
    setSelectedId(null);
    message.success('已删除');
  };

  // 移动组件
  const handleMove = (direction: 'up' | 'down') => {
    if (!selectedId) return;
    const index = components.findIndex((c) => c.id === selectedId);
    if (direction === 'up' && index > 0) {
      setComponents(arrayMove(components, index, index - 1));
    } else if (direction === 'down' && index < components.length - 1) {
      setComponents(arrayMove(components, index, index + 1));
    }
  };

  // 拖拽结束
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = components.findIndex((c) => c.id === active.id);
      const newIndex = components.findIndex((c) => c.id === over.id);
      setComponents(arrayMove(components, oldIndex, newIndex));
    }
  };

  // 更新组件属性
  const handlePropsChange = (key: string, value: any) => {
    if (!selectedId) return;
    setComponents(
      components.map((c) =>
        c.id === selectedId ? { ...c, props: { ...c.props, [key]: value } } as PageComponent : c
      )
    );
  };

  // 计算容器嵌套深度
  // 返回值：0 = 顶层组件，1 = 第1层嵌套，2 = 第2层嵌套
  const getContainerDepth = (componentId: string, componentList: PageComponent[]): number => {
    for (const comp of componentList) {
      if (comp.type === 'container' && comp.props.children) {
        const children = comp.props.children as any[];
        // 检查目标组件是否是此容器的直接子组件
        const found = children.find((child) => child.id === componentId);
        if (found) {
          // 找到父容器，当前深度为1（因为目标组件在容器内）
          return 1;
        }
        // 递归检查嵌套容器
        for (const child of children) {
          if (child.type === 'container' && child.props?.children) {
            const depthInNested = getNestedDepth(componentId, child.props.children as any[]);
            if (depthInNested > 0) {
              return 1 + depthInNested;
            }
          }
        }
      }
    }
    return 0;
  };

  // 辅助函数：在嵌套容器中查找组件深度
  const getNestedDepth = (componentId: string, children: any[]): number => {
    for (const child of children) {
      if (child.id === componentId) {
        return 1;
      }
      if (child.type === 'container' && child.props?.children) {
        const depth = getNestedDepth(componentId, child.props.children as any[]);
        if (depth > 0) {
          return 1 + depth;
        }
      }
    }
    return 0;
  };

  // 保存到本地草稿
  const handleSave = () => {
    const pageData = {
      name: pageName,
      templateId,
      components,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(`page_draft_${currentPageKey}`, JSON.stringify(pageData));
    message.success('已保存到本地草稿！');
  };

  // 发布到服务器
  const handlePublish = async () => {
    if (components.length === 0) {
      message.warning('页面为空，无法发布');
      return;
    }
    
    setSaving(true);
    try {
      const pageData = {
        name: pageName,
        templateId,
        components,
        updatedAt: new Date().toISOString(),
      };
      
      console.log(`[PageEditor] 发布页面: ${currentPageKey}`, pageData);
      await savePageConfig(currentPageKey, pageData);
      console.log(`[PageEditor] 页面发布成功`);
      
      // 发布成功后清除本地草稿
      localStorage.removeItem(`page_draft_${currentPageKey}`);
      
      const pageInfo = pageList.find(p => p.key === currentPageKey);
      message.success(`「${pageInfo?.title || currentPageKey}」页面已成功发布！`);
    } catch (error) {
      console.error('[PageEditor] 发布失败:', error);
      message.error('发布失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  // 清空画布
  const handleClear = () => {
    Modal.confirm({
      title: '确认清空',
      content: '清空后将丢失所有未保存的内容，确定吗？',
      onOk: () => {
        setComponents([]);
        setSelectedId(null);
        setTemplateId(null);
        localStorage.removeItem(`page_draft_${currentPageKey}`);
        message.success('已清空画布');
      },
    });
  };

  // 切换页面
  const handlePageChange = (pageKey: string) => {
    // 检查是否有未保存的内容
    const draftKey = `page_draft_${currentPageKey}`;
    const hasDraft = localStorage.getItem(draftKey);
    
    if (components.length > 0 && !hasDraft) {
      Modal.confirm({
        title: '切换页面',
        content: '当前页面有未保存的内容，是否保存草稿后切换？',
        okText: '保存并切换',
        cancelText: '直接切换',
        onOk: () => {
          handleSave();
          setSearchParams({ page: pageKey });
        },
        onCancel: () => {
          setSearchParams({ page: pageKey });
        },
      });
    } else {
      setSearchParams({ page: pageKey });
    }
  };

  // 使用预设模板
  const handleUseTemplate = (templateType: 'solutions' | 'cases' | 'about') => {
    if (components.length > 0) {
      Modal.confirm({
        title: '使用模板',
        content: '使用模板将覆盖当前页面内容，是否继续？',
        onOk: () => applyTemplate(templateType),
      });
    } else {
      applyTemplate(templateType);
    }
  };

  // 应用模板
  const applyTemplate = (templateType: 'solutions' | 'cases' | 'about') => {
    let newComponents: PageComponent[] = [];
    
    switch (templateType) {
      case 'solutions':
        newComponents = [
          {
            id: uuidv4(),
            type: 'hero',
            props: {
              title: '我们的解决方案',
              subtitle: '专业、高效、创新的技术服务，助力企业数字化转型',
              backgroundColor: '#1677ff',
              height: 400,
              buttonText: '了解更多',
              textAlign: 'center'
            }
          },
          {
            id: uuidv4(),
            type: 'container',
            props: {
              backgroundColor: '#fff',
              padding: 48,
              layout: 'grid',
              columns: 3,
              gap: 24,
              children: [
                {
                  id: uuidv4(),
                  type: 'text',
                  props: {
                    content: '技术服务',
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: '#333',
                    textAlign: 'center',
                    padding: 16
                  },
                  span: 3
                },
                {
                  id: uuidv4(),
                  type: 'cards',
                  props: {
                    columns: 3,
                    items: [
                      {
                        title: '网站开发',
                        description: '定制化网站开发，响应式设计，SEO优化'
                      },
                      {
                        title: '移动应用',
                        description: 'iOS/Android原生应用及跨平台解决方案'
                      },
                      {
                        title: '系统集成',
                        description: '企业级系统集成，API开发与对接'
                      }
                    ]
                  },
                  span: 3
                }
              ]
            }
          }
        ];
        break;
        
      case 'cases':
        newComponents = [
          {
            id: uuidv4(),
            type: 'hero',
            props: {
              title: '成功案例',
              subtitle: '见证我们为客户创造的价值与成果',
              backgroundColor: '#52c41a',
              height: 400,
              buttonText: '',
              textAlign: 'center'
            }
          },
          {
            id: uuidv4(),
            type: 'container',
            props: {
              backgroundColor: '#fff',
              padding: 48,
              layout: 'vertical',
              gap: 32,
              children: [
                {
                  id: uuidv4(),
                  type: 'text',
                  props: {
                    content: '精选案例',
                    fontSize: 32,
                    fontWeight: 'bold',
                    color: '#333',
                    textAlign: 'center',
                    padding: 16
                  },
                  span: 1
                },
                {
                  id: uuidv4(),
                  type: 'cards',
                  props: {
                    columns: 3,
                    items: [
                      {
                        title: '电商平台建设项目',
                        description: '为某零售企业打造的全渠道电商系统，提升销售额300%'
                      },
                      {
                        title: '企业管理系统',
                        description: '定制化ERP系统，优化业务流程，提高运营效率'
                      },
                      {
                        title: '移动办公应用',
                        description: '跨平台移动办公解决方案，提升团队协作效率'
                      }
                    ]
                  },
                  span: 1
                }
              ]
            }
          }
        ];
        break;
        
      case 'about':
        newComponents = [
          {
            id: uuidv4(),
            type: 'hero',
            props: {
              title: '关于我们',
              subtitle: '专注技术创新，致力于为客户提供优质的产品与服务',
              backgroundColor: '#722ed1',
              height: 400,
              buttonText: '',
              textAlign: 'center'
            }
          },
          {
            id: uuidv4(),
            type: 'container',
            props: {
              backgroundColor: '#fff',
              padding: 48,
              layout: 'horizontal',
              columns: 2,
              gap: 48,
              alignItems: 'flex-start',
              children: [
                {
                  id: uuidv4(),
                  type: 'text',
                  props: {
                    content: '公司简介\n\n我们是一家专注于企业级软件开发的技术公司，拥有多年的行业经验和技术积累。团队成员来自知名互联网公司，具备丰富的项目实战经验。\n\n我们的使命是通过技术创新帮助企业实现数字化转型，提升竞争力。',
                    fontSize: 16,
                    fontWeight: 'normal',
                    color: '#666',
                    textAlign: 'left',
                    padding: 0
                  },
                  span: 1
                },
                {
                  id: uuidv4(),
                  type: 'image',
                  props: {
                    src: '',
                    alt: '公司团队',
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: 8
                  },
                  span: 1
                }
              ]
            }
          },
          {
            id: uuidv4(),
            type: 'container',
            props: {
              backgroundColor: '#fafafa',
              padding: 48,
              layout: 'vertical',
              gap: 32,
              children: [
                {
                  id: uuidv4(),
                  type: 'text',
                  props: {
                    content: '核心优势',
                    fontSize: 28,
                    fontWeight: 'bold',
                    color: '#333',
                    textAlign: 'center',
                    padding: 16
                  },
                  span: 1
                },
                {
                  id: uuidv4(),
                  type: 'cards',
                  props: {
                    columns: 4,
                    items: [
                      {
                        title: '技术实力',
                        description: '资深技术团队，掌握前沿技术栈'
                      },
                      {
                        title: '项目经验',
                        description: '丰富的行业项目实施经验'
                      },
                      {
                        title: '服务质量',
                        description: '全程跟踪服务，确保项目成功'
                      },
                      {
                        title: '持续支持',
                        description: '完善的售后支持体系'
                      }
                    ]
                  },
                  span: 1
                }
              ]
            }
          }
        ];
        break;
    }
    
    setComponents(newComponents);
    setSelectedId(null);
    message.success(`${{
      'solutions': '解决方案',
      'cases': '成功案例',
      'about': '关于我们'
    }[templateType]}模板已应用！`);
  };

  // 跳转到模板选择页
  const handleSelectTemplate = () => {
    if (components.length > 0) {
      Modal.confirm({
        title: '更换模板',
        content: '更换模板将覆盖当前页面内容，是否继续？',
        onOk: () => navigate('/admin/pages/templates'),
      });
    } else {
      navigate('/admin/pages/templates');
    }
  };

  // 渲染属性编辑面板
  const renderPropsEditor = () => {
    if (!selectedComponent) {
      return <Empty description="请选择一个组件进行编辑" />;
    }

    const { type, props } = selectedComponent;

    return (
      <Form layout="vertical" size="small">
        {/* 通用属性 */}
        {type === 'hero' && (
          <>
            {/* 内容配置 */}
            <div style={{ fontWeight: 600, color: '#1677ff', margin: '12px 0 8px', fontSize: 13 }}>内容配置</div>
            <Form.Item label="标题">
              <Input value={props.title} onChange={(e) => handlePropsChange('title', e.target.value)} />
            </Form.Item>
            <Form.Item label="副标题">
              <Input value={props.subtitle} onChange={(e) => handlePropsChange('subtitle', e.target.value)} />
            </Form.Item>
            <Form.Item label="高度 (px)">
              <InputNumber value={props.height} onChange={(v) => handlePropsChange('height', v)} style={{ width: '100%' }} min={200} max={800} />
            </Form.Item>
            <Form.Item label="内容对齐">
              <Select 
                value={props.textAlign || 'center'} 
                onChange={(v) => handlePropsChange('textAlign', v)} 
                options={[
                  { value: 'left', label: '左对齐' },
                  { value: 'center', label: '居中对齐' },
                  { value: 'right', label: '右对齐' },
                ]} 
              />
            </Form.Item>

            {/* 背景配置 */}
            <div style={{ fontWeight: 600, color: '#1677ff', margin: '16px 0 8px', fontSize: 13 }}>背景配置</div>
            <Form.Item label="背景图片">
              <ImagePicker
                value={props.backgroundImage}
                onChange={(url) => handlePropsChange('backgroundImage', url)}
                placeholder="选择背景图片"
              />
            </Form.Item>
            
            {!props.backgroundImage && (
              <Form.Item label="背景色">
                <ColorPicker value={props.backgroundColor} onChange={(c) => handlePropsChange('backgroundColor', c.toHexString())} />
              </Form.Item>
            )}
            
            {props.backgroundImage && (
              <>
                <Form.Item label="图片填充模式">
                  <Select 
                    value={props.backgroundFit || 'cover'} 
                    onChange={(v) => handlePropsChange('backgroundFit', v)} 
                    options={[
                      { value: 'cover', label: '覆盖填充 (Cover)' },
                      { value: 'contain', label: '完整显示 (Contain)' },
                      { value: 'fill', label: '拉伸填充 (Fill)' },
                      { value: 'repeat', label: '平铺重复 (Repeat)' },
                    ]} 
                  />
                </Form.Item>
                
                <Form.Item label="图片位置">
                  <Select 
                    value={props.backgroundPosition || 'center'} 
                    onChange={(v) => handlePropsChange('backgroundPosition', v)} 
                    options={[
                      { value: 'center', label: '居中' },
                      { value: 'top', label: '顶部' },
                      { value: 'bottom', label: '底部' },
                      { value: 'left', label: '左侧' },
                      { value: 'right', label: '右侧' },
                    ]} 
                  />
                </Form.Item>
              </>
            )}

            {/* 按钮配置 */}
            <div style={{ fontWeight: 600, color: '#1677ff', margin: '16px 0 8px', fontSize: 13 }}>按钮配置</div>
            <Form.Item label="按钮文字">
              <Input 
                value={props.buttonText} 
                onChange={(e) => handlePropsChange('buttonText', e.target.value)} 
                placeholder="留空则不显示按钮" 
              />
            </Form.Item>
            
            {props.buttonText && (
              <>
                <Form.Item label="按钮图标">
                  <Select 
                    value={props.buttonIcon || ''} 
                    onChange={(v) => handlePropsChange('buttonIcon', v)} 
                    options={BUTTON_ICON_OPTIONS}
                    allowClear
                  />
                </Form.Item>
                {props.buttonIcon && (
                  <Form.Item label="图标位置">
                    <Select 
                      value={props.buttonIconPosition || 'left'} 
                      onChange={(v) => handlePropsChange('buttonIconPosition', v)} 
                      options={[
                        { value: 'left', label: '文字左侧' },
                        { value: 'right', label: '文字右侧' },
                      ]} 
                    />
                  </Form.Item>
                )}
                
                <Form.Item label="按钮类型">
                  <Select 
                    value={props.buttonVariant || 'primary'} 
                    onChange={(v) => handlePropsChange('buttonVariant', v)} 
                    options={[
                      { value: 'primary', label: '主要按钮（实心）' },
                      { value: 'default', label: '默认按钮（白底）' },
                      { value: 'dashed', label: '虚线按钮' },
                      { value: 'text', label: '文字按钮' },
                      { value: 'link', label: '链接按钮' },
                    ]} 
                  />
                </Form.Item>
                <Form.Item label="按钮尺寸">
                  <Select 
                    value={props.buttonSize || 'large'} 
                    onChange={(v) => handlePropsChange('buttonSize', v)} 
                    options={[
                      { value: 'small', label: '小' },
                      { value: 'middle', label: '中' },
                      { value: 'large', label: '大' },
                    ]} 
                  />
                </Form.Item>
                <Form.Item label="幽灵模式">
                  <Switch 
                    checked={props.buttonGhost !== false} 
                    onChange={(v) => handlePropsChange('buttonGhost', v)} 
                  />
                  <span style={{ color: '#999', fontSize: 12, marginLeft: 8 }}>透明背景，适合有背景图</span>
                </Form.Item>
                <Form.Item label="圆角大小">
                  <InputNumber 
                    value={props.buttonBorderRadius ?? 6} 
                    onChange={(v) => handlePropsChange('buttonBorderRadius', v)} 
                    min={0} 
                    max={50}
                    style={{ width: '100%' }} 
                    addonAfter="px"
                  />
                </Form.Item>
                <Form.Item label="显示阴影">
                  <Switch 
                    checked={props.buttonShadow || false} 
                    onChange={(v) => handlePropsChange('buttonShadow', v)} 
                  />
                </Form.Item>
                
                {/* 自定义颜色 */}
                <Form.Item label="背景颜色">
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <ColorPicker 
                      value={props.buttonBackgroundColor || undefined} 
                      onChange={(color) => handlePropsChange('buttonBackgroundColor', color.toHexString())}
                      showText
                      allowClear
                      onClear={() => handlePropsChange('buttonBackgroundColor', '')}
                    />
                    <span style={{ color: '#999', fontSize: 12 }}>留空使用默认</span>
                  </div>
                </Form.Item>
                <Form.Item label="文字颜色">
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <ColorPicker 
                      value={props.buttonTextColor || undefined} 
                      onChange={(color) => handlePropsChange('buttonTextColor', color.toHexString())}
                      showText
                      allowClear
                      onClear={() => handlePropsChange('buttonTextColor', '')}
                    />
                    <span style={{ color: '#999', fontSize: 12 }}>留空使用默认</span>
                  </div>
                </Form.Item>
                <Form.Item label="边框颜色">
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <ColorPicker 
                      value={props.buttonBorderColor || undefined} 
                      onChange={(color) => handlePropsChange('buttonBorderColor', color.toHexString())}
                      showText
                      allowClear
                      onClear={() => handlePropsChange('buttonBorderColor', '')}
                    />
                    <span style={{ color: '#999', fontSize: 12 }}>留空使用默认</span>
                  </div>
                </Form.Item>

                {/* 链接配置 */}
                <div style={{ fontWeight: 600, color: '#1677ff', margin: '16px 0 8px', fontSize: 13 }}>按钮链接</div>
                <Form.Item label="链接类型">
                  <Select 
                    value={props.buttonLinkType || 'none'} 
                    onChange={(v) => {
                      handlePropsChange('buttonLinkType', v);
                      if (v === 'home') {
                        handlePropsChange('buttonLinkValue', '/');
                      } else if (v === 'none') {
                        handlePropsChange('buttonLinkValue', '');
                      }
                    }} 
                    options={[
                      { value: 'none', label: '无链接' },
                      { value: 'home', label: '首页' },
                      { value: 'page', label: '站内页面' },
                      { value: 'url', label: '外部链接' },
                    ]} 
                  />
                </Form.Item>
                {props.buttonLinkType === 'page' && (
                  <Form.Item label="选择页面">
                    <Select 
                      value={props.buttonLinkValue} 
                      onChange={(v) => handlePropsChange('buttonLinkValue', v)} 
                      placeholder="请选择目标页面"
                      options={pageList.map(p => ({ value: p.key, label: p.title }))}
                      showSearch
                      filterOption={(input, option) => 
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                )}
                {props.buttonLinkType === 'url' && (
                  <Form.Item label="链接地址">
                    <Input 
                      value={props.buttonLinkValue} 
                      onChange={(e) => handlePropsChange('buttonLinkValue', e.target.value)} 
                      placeholder="https://example.com" 
                    />
                  </Form.Item>
                )}
                {props.buttonLinkType && props.buttonLinkType !== 'none' && (
                  <Form.Item label="打开方式">
                    <Switch 
                      checked={props.buttonOpenInNewTab || false} 
                      onChange={(v) => handlePropsChange('buttonOpenInNewTab', v)} 
                      checkedChildren="新窗口"
                      unCheckedChildren="当前页"
                    />
                  </Form.Item>
                )}
              </>
            )}
          </>
        )}

        {type === 'text' && (
          <>
            <Form.Item label="文本内容">
              <Input.TextArea rows={4} value={props.content} onChange={(e) => handlePropsChange('content', e.target.value)} />
            </Form.Item>
            <Form.Item label="字号">
              <InputNumber value={props.fontSize} onChange={(v) => handlePropsChange('fontSize', v)} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="字重">
              <Select value={props.fontWeight} onChange={(v) => handlePropsChange('fontWeight', v)} options={[
                { value: 'normal', label: '正常' },
                { value: 'bold', label: '加粗' },
              ]} />
            </Form.Item>
            <Form.Item label="文字颜色">
              <ColorPicker value={props.color || '#000000'} onChange={(c) => handlePropsChange('color', c.toHexString())} />
            </Form.Item>
            <Form.Item label="对齐">
              <Select value={props.textAlign} onChange={(v) => handlePropsChange('textAlign', v)} options={[
                { value: 'left', label: '左对齐' },
                { value: 'center', label: '居中' },
                { value: 'right', label: '右对齐' },
              ]} />
            </Form.Item>
            <Form.Item label="内边距 (px)">
              <InputNumber value={props.padding} onChange={(v) => handlePropsChange('padding', v)} style={{ width: '100%' }} />
            </Form.Item>
          </>
        )}

        {type === 'image' && (
          <>
            <Form.Item label="图片来源">
              <ImagePicker
                value={props.src}
                onChange={(url) => handlePropsChange('src', url)}
                placeholder="选择图片"
              />
            </Form.Item>
            <Form.Item label="图片描述">
              <Input value={props.alt} onChange={(e) => handlePropsChange('alt', e.target.value)} placeholder="输入图片描述文字" />
            </Form.Item>
            <Form.Item label="宽度">
              <Input value={props.width} onChange={(e) => handlePropsChange('width', e.target.value)} placeholder="如 100% 或 300px" />
            </Form.Item>
            <Form.Item label="高度">
              <Input value={props.height} onChange={(e) => handlePropsChange('height', e.target.value)} placeholder="如 auto 或 200px" />
            </Form.Item>
            <Form.Item label="填充模式">
              <Select value={props.objectFit} onChange={(v) => handlePropsChange('objectFit', v)} options={[
                { value: 'cover', label: '覆盖填充' },
                { value: 'contain', label: '完整显示' },
                { value: 'fill', label: '拉伸填充' },
              ]} />
            </Form.Item>
            <Form.Item label="圆角 (px)">
              <InputNumber value={props.borderRadius} onChange={(v) => handlePropsChange('borderRadius', v)} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="宽高比">
              <Select 
                value={props.aspectRatio || 'auto'} 
                onChange={(v) => handlePropsChange('aspectRatio', v)} 
                options={[
                  { value: 'auto', label: '原始比例' },
                  { value: '1:1', label: '1:1 正方形' },
                  { value: '4:3', label: '4:3 标准' },
                  { value: '16:9', label: '16:9 宽屏' },
                  { value: '3:4', label: '3:4 竖向' },
                ]} 
              />
            </Form.Item>
          </>
        )}

        {type === 'button' && (
          <>
            {/* 基础配置 */}
            <div style={{ fontWeight: 600, color: '#1677ff', margin: '12px 0 8px', fontSize: 13 }}>基础配置</div>
            <Form.Item label="按钮文字">
              <Input value={props.text} onChange={(e) => handlePropsChange('text', e.target.value)} placeholder="输入按钮文字" />
            </Form.Item>
            <Form.Item label="按钮图标">
              <Select 
                value={props.icon || ''} 
                onChange={(v) => handlePropsChange('icon', v)} 
                options={BUTTON_ICON_OPTIONS}
                allowClear
              />
            </Form.Item>
            {props.icon && (
              <Form.Item label="图标位置">
                <Select 
                  value={props.iconPosition || 'left'} 
                  onChange={(v) => handlePropsChange('iconPosition', v)} 
                  options={[
                    { value: 'left', label: '文字左侧' },
                    { value: 'right', label: '文字右侧' },
                  ]} 
                />
              </Form.Item>
            )}

            {/* 样式配置 */}
            <div style={{ fontWeight: 600, color: '#1677ff', margin: '16px 0 8px', fontSize: 13 }}>样式配置</div>
            <Form.Item label="按钮类型">
              <Select value={props.variant || 'primary'} onChange={(v) => handlePropsChange('variant', v)} options={[
                { value: 'primary', label: '主要按钮（实心）' },
                { value: 'default', label: '默认按钮（白底）' },
                { value: 'dashed', label: '虚线按钮' },
                { value: 'text', label: '文字按钮' },
                { value: 'link', label: '链接按钮' },
              ]} />
            </Form.Item>
            <Form.Item label="按钮尺寸">
              <Select value={props.size || 'middle'} onChange={(v) => handlePropsChange('size', v)} options={[
                { value: 'small', label: '小' },
                { value: 'middle', label: '中' },
                { value: 'large', label: '大' },
              ]} />
            </Form.Item>
            <Form.Item label="圆角大小">
              <InputNumber 
                value={props.borderRadius ?? 6} 
                onChange={(v) => handlePropsChange('borderRadius', v)} 
                min={0} 
                max={50}
                style={{ width: '100%' }} 
                addonAfter="px"
              />
            </Form.Item>
            <Form.Item label="显示阴影">
              <Switch checked={props.shadow || false} onChange={(v) => handlePropsChange('shadow', v)} />
            </Form.Item>
            
            {/* 自定义颜色 */}
            <Form.Item label="背景颜色">
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <ColorPicker 
                  value={props.backgroundColor || undefined} 
                  onChange={(color) => handlePropsChange('backgroundColor', color.toHexString())}
                  showText
                  allowClear
                  onClear={() => handlePropsChange('backgroundColor', '')}
                />
                <span style={{ color: '#999', fontSize: 12 }}>留空使用默认</span>
              </div>
            </Form.Item>
            <Form.Item label="文字颜色">
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <ColorPicker 
                  value={props.textColor || undefined} 
                  onChange={(color) => handlePropsChange('textColor', color.toHexString())}
                  showText
                  allowClear
                  onClear={() => handlePropsChange('textColor', '')}
                />
                <span style={{ color: '#999', fontSize: 12 }}>留空使用默认</span>
              </div>
            </Form.Item>
            <Form.Item label="边框颜色">
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <ColorPicker 
                  value={props.borderColor || undefined} 
                  onChange={(color) => handlePropsChange('borderColor', color.toHexString())}
                  showText
                  allowClear
                  onClear={() => handlePropsChange('borderColor', '')}
                />
                <span style={{ color: '#999', fontSize: 12 }}>留空使用默认</span>
              </div>
            </Form.Item>

            {/* 布局配置 */}
            <div style={{ fontWeight: 600, color: '#1677ff', margin: '16px 0 8px', fontSize: 13 }}>布局配置</div>
            <Form.Item label="对齐方式">
              <Select value={props.align || 'center'} onChange={(v) => handlePropsChange('align', v)} options={[
                { value: 'left', label: '左对齐' },
                { value: 'center', label: '居中对齐' },
                { value: 'right', label: '右对齐' },
              ]} />
            </Form.Item>
            <Form.Item label="宽度设置">
              <Select value={props.widthType || 'auto'} onChange={(v) => handlePropsChange('widthType', v)} options={[
                { value: 'auto', label: '自适应宽度' },
                { value: 'fixed', label: '固定宽度' },
                { value: 'full', label: '通栏宽度' },
              ]} />
            </Form.Item>
            {props.widthType === 'fixed' && (
              <Form.Item label="固定宽度">
                <InputNumber 
                  value={props.customWidth || 120} 
                  onChange={(v) => handlePropsChange('customWidth', v)} 
                  min={50} 
                  max={500}
                  style={{ width: '100%' }} 
                  addonAfter="px"
                />
              </Form.Item>
            )}
            <Form.Item label="上下内边距">
              <InputNumber 
                value={props.padding ?? 16} 
                onChange={(v) => handlePropsChange('padding', v)} 
                min={0} 
                max={100}
                style={{ width: '100%' }} 
                addonAfter="px"
              />
            </Form.Item>

            {/* 链接配置 */}
            <div style={{ fontWeight: 600, color: '#1677ff', margin: '16px 0 8px', fontSize: 13 }}>链接配置</div>
            <Form.Item label="链接类型">
              <Select 
                value={props.linkType || 'none'} 
                onChange={(v) => {
                  handlePropsChange('linkType', v);
                  // 切换类型时设置默认值
                  if (v === 'home') {
                    handlePropsChange('linkValue', '/');
                  } else if (v === 'none') {
                    handlePropsChange('linkValue', '');
                  }
                }} 
                options={[
                  { value: 'none', label: '无链接' },
                  { value: 'home', label: '首页' },
                  { value: 'page', label: '站内页面' },
                  { value: 'url', label: '外部链接' },
                ]} 
              />
            </Form.Item>
            {props.linkType === 'page' && (
              <Form.Item label="选择页面">
                <Select 
                  value={props.linkValue} 
                  onChange={(v) => handlePropsChange('linkValue', v)} 
                  placeholder="请选择目标页面"
                  options={pageList.map(p => ({ value: p.key, label: p.title }))}
                  showSearch
                  filterOption={(input, option) => 
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            )}
            {props.linkType === 'url' && (
              <Form.Item label="链接地址">
                <Input 
                  value={props.linkValue} 
                  onChange={(e) => handlePropsChange('linkValue', e.target.value)} 
                  placeholder="https://example.com" 
                />
              </Form.Item>
            )}
            {props.linkType && props.linkType !== 'none' && (
              <Form.Item label="打开方式">
                <Switch 
                  checked={props.openInNewTab || false} 
                  onChange={(v) => handlePropsChange('openInNewTab', v)} 
                  checkedChildren="新窗口"
                  unCheckedChildren="当前页"
                />
              </Form.Item>
            )}
          </>
        )}

        {type === 'form' && (
          <>
            <Form.Item label="表单标题">
              <Input value={props.title} onChange={(e) => handlePropsChange('title', e.target.value)} />
            </Form.Item>
            <Form.Item label="提交按钮文字">
              <Input value={props.submitText} onChange={(e) => handlePropsChange('submitText', e.target.value)} />
            </Form.Item>
            <Form.Item label="表单字段">
              <div style={{ fontSize: '12px', color: '#999', marginBottom: 8 }}>
                当前 {props.fields?.length || 0} 个字段
              </div>
              {props.fields?.map((field: any, index: number) => (
                <Card key={index} size="small" style={{ marginBottom: 8 }} title={`字段 ${index + 1}`}
                  extra={<Button type="link" size="small" danger onClick={() => {
                    const newFields = props.fields.filter((_: any, i: number) => i !== index);
                    handlePropsChange('fields', newFields);
                  }}>删除</Button>}
                >
                  <Form.Item label="字段名" style={{ marginBottom: 8 }}>
                    <Input 
                      value={field.name} 
                      onChange={(e) => {
                        const newFields = [...props.fields];
                        newFields[index] = { ...newFields[index], name: e.target.value };
                        handlePropsChange('fields', newFields);
                      }} 
                    />
                  </Form.Item>
                  <Form.Item label="显示标签" style={{ marginBottom: 8 }}>
                    <Input 
                      value={field.label} 
                      onChange={(e) => {
                        const newFields = [...props.fields];
                        newFields[index] = { ...newFields[index], label: e.target.value };
                        handlePropsChange('fields', newFields);
                      }} 
                    />
                  </Form.Item>
                  <Form.Item label="字段类型" style={{ marginBottom: 8 }}>
                    <Select 
                      value={field.type} 
                      onChange={(v) => {
                        const newFields = [...props.fields];
                        newFields[index] = { ...newFields[index], type: v };
                        handlePropsChange('fields', newFields);
                      }}
                      options={[
                        { value: 'text', label: '文本' },
                        { value: 'email', label: '邮箱' },
                        { value: 'phone', label: '电话' },
                        { value: 'textarea', label: '多行文本' },
                      ]} 
                    />
                  </Form.Item>
                  <Form.Item label="必填" style={{ marginBottom: 0 }}>
                    <Switch 
                      checked={field.required} 
                      onChange={(v) => {
                        const newFields = [...props.fields];
                        newFields[index] = { ...newFields[index], required: v };
                        handlePropsChange('fields', newFields);
                      }} 
                    />
                  </Form.Item>
                </Card>
              ))}
              <Button 
                type="dashed" 
                block 
                size="small"
                icon={<PlusOutlined />}
                onClick={() => {
                  const newFields = [...(props.fields || []), { name: 'field', label: '新字段', type: 'text', required: false }];
                  handlePropsChange('fields', newFields);
                }}
              >
                添加字段
              </Button>
            </Form.Item>
          </>
        )}

        {type === 'cards' && (
          <>
            <Form.Item label="每行列数">
              <InputNumber min={1} max={12} value={props.columns} onChange={(v) => handlePropsChange('columns', v)} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="卡片数据">
              <div style={{ fontSize: '12px', color: '#999', marginBottom: 8 }}>
                当前 {props.items?.length || 0} 张卡片
              </div>
              {props.items?.map((item: any, index: number) => (
                <Card key={index} size="small" style={{ marginBottom: 8 }} title={`卡片 ${index + 1}`}>
                  <Form.Item label="标题" style={{ marginBottom: 8 }}>
                    <Input 
                      value={item.title} 
                      onChange={(e) => {
                        const newItems = [...props.items];
                        newItems[index] = { ...newItems[index], title: e.target.value };
                        handlePropsChange('items', newItems);
                      }} 
                    />
                  </Form.Item>
                  <Form.Item label="描述" style={{ marginBottom: 0 }}>
                    <Input.TextArea 
                      rows={2}
                      value={item.description} 
                      onChange={(e) => {
                        const newItems = [...props.items];
                        newItems[index] = { ...newItems[index], description: e.target.value };
                        handlePropsChange('items', newItems);
                      }} 
                    />
                  </Form.Item>
                </Card>
              ))}
              <Button 
                type="dashed" 
                block 
                size="small"
                icon={<PlusOutlined />}
                onClick={() => {
                  const newItems = [...(props.items || []), { title: '新卡片', description: '卡片描述' }];
                  handlePropsChange('items', newItems);
                }}
              >
                添加卡片
              </Button>
            </Form.Item>
          </>
        )}

        {type === 'container' && (
          <>
            <Form.Item label="背景色">
              <ColorPicker value={props.backgroundColor} onChange={(c) => handlePropsChange('backgroundColor', c.toHexString())} />
            </Form.Item>
            <Form.Item label="内边距 (px)">
              <InputNumber value={props.padding} onChange={(v) => handlePropsChange('padding', v)} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="最大宽度 (px)">
              <InputNumber value={props.maxWidth} onChange={(v) => handlePropsChange('maxWidth', v)} style={{ width: '100%' }} placeholder="留空则全宽" />
            </Form.Item>
            
            {/* 布局配置 */}
            <Form.Item label="布局模式">
              <Select value={props.layout} onChange={(v) => handlePropsChange('layout', v)} options={[
                { value: 'vertical', label: '垂直排列' },
                { value: 'horizontal', label: '水平排列' },
                { value: 'grid', label: '网格布局' },
              ]} />
            </Form.Item>
            
            {(props.layout === 'horizontal' || props.layout === 'grid') && (
              <Form.Item label="列数">
                <Select value={props.columns || 3} onChange={(v) => handlePropsChange('columns', v)} options={[
                  { value: 1, label: '1 列' },
                  { value: 2, label: '2 列' },
                  { value: 3, label: '3 列' },
                  { value: 4, label: '4 列' },
                  { value: 5, label: '5 列' },
                  { value: 6, label: '6 列' },
                  { value: 8, label: '8 列' },
                  { value: 10, label: '10 列' },
                  { value: 12, label: '12 列' },
                ]} />
              </Form.Item>
            )}
            
            <Form.Item label="元素间距 (px)">
              <InputNumber value={props.gap} onChange={(v) => handlePropsChange('gap', v)} style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item label="垂直对齐">
              <Select value={props.alignItems || 'stretch'} onChange={(v) => handlePropsChange('alignItems', v)} options={[
                { value: 'flex-start', label: '顶部对齐' },
                { value: 'center', label: '居中对齐' },
                { value: 'flex-end', label: '底部对齐' },
                { value: 'stretch', label: '拉伸填充' },
              ]} />
            </Form.Item>
            
            {props.layout !== 'grid' && (
              <Form.Item label="水平对齐">
                <Select value={props.justifyContent || 'flex-start'} onChange={(v) => handlePropsChange('justifyContent', v)} options={[
                  { value: 'flex-start', label: '左对齐' },
                  { value: 'center', label: '居中' },
                  { value: 'flex-end', label: '右对齐' },
                  { value: 'space-between', label: '两端对齐' },
                  { value: 'space-around', label: '分散对齐' },
                ]} />
              </Form.Item>
            )}
            
            {/* 子组件统一高度 */}
            <Form.Item label="子组件统一高度">
              <Select 
                value={props.childHeight || 'auto'} 
                onChange={(v) => handlePropsChange('childHeight', v)} 
                options={[
                  { value: 'auto', label: '自适应' },
                  { value: 80, label: '80px' },
                  { value: 100, label: '100px' },
                  { value: 120, label: '120px' },
                  { value: 150, label: '150px' },
                  { value: 180, label: '180px' },
                  { value: 200, label: '200px' },
                  { value: 250, label: '250px' },
                  { value: 300, label: '300px' },
                  { value: 350, label: '350px' },
                  { value: 400, label: '400px' },
                ]} 
              />
            </Form.Item>
            
            {/* 子组件管理 */}
            <Form.Item label="子组件">
              <div style={{ fontSize: '12px', color: '#999', marginBottom: 8 }}>
                当前 {props.children?.length || 0} 个子组件，共 {props.columns || 3} 列
              </div>
              {props.children?.map((child: any, index: number) => (
                <Card key={child.id || index} size="small" style={{ marginBottom: 8 }} 
                  title={
                    <span>
                      {COMPONENT_LIST.find(c => c.type === child.type)?.label || child.type}
                      <span style={{ fontSize: '11px', color: '#999', marginLeft: 8 }}>
                        占 {child.span || 1} 列
                      </span>
                    </span>
                  }
                  extra={
                    <Button type="link" size="small" danger onClick={() => {
                      const newChildren = (props.children || []).filter((_: any, i: number) => i !== index);
                      handlePropsChange('children', newChildren);
                    }}>删除</Button>
                  }
                >
                  {/* 宽度配置 */}
                  {(props.layout === 'horizontal' || props.layout === 'grid') && (
                    <Form.Item label="占据列数" style={{ marginBottom: 8 }}>
                      <Select 
                        value={child.span || 1} 
                        onChange={(v) => {
                          const newChildren = [...(props.children || [])];
                          newChildren[index] = { ...newChildren[index], span: v };
                          handlePropsChange('children', newChildren);
                        }}
                        options={Array.from({ length: props.columns || 3 }, (_, i) => ({
                          value: i + 1,
                          label: `${i + 1} 列 (${Math.round((i + 1) / (props.columns || 3) * 100)}%)`
                        }))}
                      />
                    </Form.Item>
                  )}
                  
                  {/* 根据子组件类型显示简化编辑 */}
                  {child.type === 'text' && (
                    <Form.Item label="内容" style={{ marginBottom: 0 }}>
                      <Input.TextArea 
                        rows={2}
                        value={child.props?.content} 
                        onChange={(e) => {
                          const newChildren = [...(props.children || [])];
                          newChildren[index] = { ...newChildren[index], props: { ...newChildren[index].props, content: e.target.value } };
                          handlePropsChange('children', newChildren);
                        }} 
                      />
                    </Form.Item>
                  )}
                  {child.type === 'button' && (
                    <Form.Item label="按钮文字" style={{ marginBottom: 0 }}>
                      <Input 
                        value={child.props?.text} 
                        onChange={(e) => {
                          const newChildren = [...(props.children || [])];
                          newChildren[index] = { ...newChildren[index], props: { ...newChildren[index].props, text: e.target.value } };
                          handlePropsChange('children', newChildren);
                        }} 
                      />
                    </Form.Item>
                  )}
                  {child.type === 'image' && (
                    <Form.Item label="图片来源" style={{ marginBottom: 0 }}>
                      <ImagePicker
                        value={child.props?.src}
                        onChange={(url) => {
                          const newChildren = [...(props.children || [])];
                          newChildren[index] = { ...newChildren[index], props: { ...newChildren[index].props, src: url } };
                          handlePropsChange('children', newChildren);
                        }}
                        placeholder="选择图片"
                      />
                    </Form.Item>
                  )}
                  {/* 嵌套容器编辑 */}
                  {child.type === 'container' && (
                    <Collapse ghost size="small" style={{ marginBottom: 8 }}>
                      <Collapse.Panel header={`编辑嵌套容器 (${child.props?.children?.length || 0}个子组件)`} key="1">
                        {/* 嵌套容器基础配置 */}
                        <Form.Item label="布局" style={{ marginBottom: 8 }}>
                          <Select 
                            value={child.props?.layout || 'vertical'} 
                            onChange={(v) => {
                              const newChildren = [...(props.children || [])];
                              newChildren[index] = { 
                                ...newChildren[index], 
                                props: { ...newChildren[index].props, layout: v } 
                              };
                              handlePropsChange('children', newChildren);
                            }}
                            options={[
                              { value: 'vertical', label: '垂直排列' },
                              { value: 'horizontal', label: '水平排列' },
                              { value: 'grid', label: '网格布局' },
                            ]}
                          />
                        </Form.Item>
                        {(child.props?.layout === 'horizontal' || child.props?.layout === 'grid') && (
                          <Form.Item label="列数" style={{ marginBottom: 8 }}>
                            <Select 
                              value={child.props?.columns || 3} 
                              onChange={(v) => {
                                const newChildren = [...(props.children || [])];
                                newChildren[index] = { 
                                  ...newChildren[index], 
                                  props: { ...newChildren[index].props, columns: v } 
                                };
                                handlePropsChange('children', newChildren);
                              }}
                              options={[
                                { value: 1, label: '1 列' },
                                { value: 2, label: '2 列' },
                                { value: 3, label: '3 列' },
                                { value: 4, label: '4 列' },
                              ]}
                            />
                          </Form.Item>
                        )}
                        {/* 嵌套容器的子组件列表 */}
                        {child.props?.children?.map((nestedChild: any, nestedIndex: number) => (
                          <Card key={nestedChild.id || nestedIndex} size="small" style={{ marginBottom: 8, background: '#fafafa' }}
                            title={
                              <span style={{ fontSize: 12 }}>
                                {COMPONENT_LIST.find(c => c.type === nestedChild.type)?.label || nestedChild.type}
                              </span>
                            }
                            extra={
                              <Button type="link" size="small" danger onClick={() => {
                                const newNestedChildren = (child.props?.children || []).filter((_: any, i: number) => i !== nestedIndex);
                                const newChildren = [...(props.children || [])];
                                newChildren[index] = { 
                                  ...newChildren[index], 
                                  props: { ...newChildren[index].props, children: newNestedChildren } 
                                };
                                handlePropsChange('children', newChildren);
                              }}>删除</Button>
                            }
                          >
                            {nestedChild.type === 'text' && (
                              <Input.TextArea 
                                rows={2}
                                value={nestedChild.props?.content} 
                                onChange={(e) => {
                                  const newNestedChildren = [...(child.props?.children || [])];
                                  newNestedChildren[nestedIndex] = { 
                                    ...newNestedChildren[nestedIndex], 
                                    props: { ...newNestedChildren[nestedIndex].props, content: e.target.value } 
                                  };
                                  const newChildren = [...(props.children || [])];
                                  newChildren[index] = { 
                                    ...newChildren[index], 
                                    props: { ...newChildren[index].props, children: newNestedChildren } 
                                  };
                                  handlePropsChange('children', newChildren);
                                }} 
                              />
                            )}
                            {nestedChild.type === 'button' && (
                              <Input 
                                value={nestedChild.props?.text} 
                                onChange={(e) => {
                                  const newNestedChildren = [...(child.props?.children || [])];
                                  newNestedChildren[nestedIndex] = { 
                                    ...newNestedChildren[nestedIndex], 
                                    props: { ...newNestedChildren[nestedIndex].props, text: e.target.value } 
                                  };
                                  const newChildren = [...(props.children || [])];
                                  newChildren[index] = { 
                                    ...newChildren[index], 
                                    props: { ...newChildren[index].props, children: newNestedChildren } 
                                  };
                                  handlePropsChange('children', newChildren);
                                }} 
                              />
                            )}
                            {nestedChild.type === 'image' && (
                              <ImagePicker
                                value={nestedChild.props?.src}
                                onChange={(url) => {
                                  const newNestedChildren = [...(child.props?.children || [])];
                                  newNestedChildren[nestedIndex] = { 
                                    ...newNestedChildren[nestedIndex], 
                                    props: { ...newNestedChildren[nestedIndex].props, src: url } 
                                  };
                                  const newChildren = [...(props.children || [])];
                                  newChildren[index] = { 
                                    ...newChildren[index], 
                                    props: { ...newChildren[index].props, children: newNestedChildren } 
                                  };
                                  handlePropsChange('children', newChildren);
                                }}
                                placeholder="选择图片"
                              />
                            )}
                          </Card>
                        ))}
                        {/* 添加嵌套子组件按钮 */}
                        <Select
                          placeholder="添加子组件"
                          style={{ width: '100%', marginTop: 8 }}
                          value={undefined}
                          onChange={(nestedChildType: string) => {
                            const config = COMPONENT_LIST.find((c) => c.type === nestedChildType);
                            if (!config) return;
                            const newNestedChild = {
                              id: uuidv4(),
                              type: nestedChildType,
                              props: { ...config.defaultProps },
                              span: 1,
                            };
                            const newNestedChildren = [...(child.props?.children || []), newNestedChild];
                            const newChildren = [...(props.children || [])];
                            newChildren[index] = { 
                              ...newChildren[index], 
                              props: { ...newChildren[index].props, children: newNestedChildren } 
                            };
                            handlePropsChange('children', newChildren);
                          }}
                          options={[
                            { value: 'text', label: '文本块' },
                            { value: 'image', label: '图片' },
                            { value: 'button', label: '按钮' },
                            { value: 'cards', label: '卡片列表' },
                            { value: 'articles', label: '文章列表' },
                            { value: 'divider', label: '分割线' },
                            // 嵌套容器内不能再添加容器（已达最大深度）
                          ]}
                        />
                      </Collapse.Panel>
                    </Collapse>
                  )}
                </Card>
              ))}
              
              {/* 添加子组件 */}
              <Select
                placeholder={(() => {
                  const depth = selectedComponent ? getContainerDepth(selectedComponent.id, components) : 0;
                  return depth >= 1 ? '选择要添加的子组件（已达最大嵌套深度）' : '选择要添加的子组件';
                })()}
                style={{ width: '100%' }}
                value={undefined}
                onChange={(childType: string) => {
                  const config = COMPONENT_LIST.find((c) => c.type === childType);
                  if (!config) return;
                  const newChild = {
                    id: uuidv4(),
                    type: childType,
                    props: { ...config.defaultProps },
                    span: 1,  // 默认占 1 列
                  };
                  const newChildren = [...(props.children || []), newChild];
                  handlePropsChange('children', newChildren);
                }}
                options={(() => {
                  // 最大嵌套深度为2层，第1层容器可以添加容器，第2层容器不能再添加容器
                  const currentDepth = selectedComponent ? getContainerDepth(selectedComponent.id, components) : 0;
                  const baseOptions = [
                    { value: 'text', label: '文本块' },
                    { value: 'image', label: '图片' },
                    { value: 'button', label: '按钮' },
                    { value: 'cards', label: '卡片列表' },
                    { value: 'articles', label: '文章列表' },
                    { value: 'divider', label: '分割线' },
                  ];
                  // 如果当前容器是顶层容器（depth=0），可以添加嵌套容器
                  if (currentDepth === 0) {
                    return [...baseOptions, { value: 'container', label: '容器（嵌套）' }];
                  }
                  // 如果已经是嵌套容器（depth>=1），不能再添加容器
                  return baseOptions;
                })()}
              />
            </Form.Item>
          </>
        )}

        {type === 'divider' && (
          <>
            <Form.Item label="线条样式">
              <Select value={props.style} onChange={(v) => handlePropsChange('style', v)} options={[
                { value: 'solid', label: '实线' },
                { value: 'dashed', label: '虚线' },
                { value: 'dotted', label: '点线' },
              ]} />
            </Form.Item>
            <Form.Item label="线条颜色">
              <ColorPicker value={props.color || '#e8e8e8'} onChange={(c) => handlePropsChange('color', c.toHexString())} />
            </Form.Item>
            <Form.Item label="间距 (px)">
              <InputNumber value={props.margin} onChange={(v) => handlePropsChange('margin', v)} style={{ width: '100%' }} />
            </Form.Item>
          </>
        )}

        {type === 'articles' && (
          <>
            <Form.Item label="显示模式">
              <Select value={props.displayMode || 'list'} onChange={(v) => handlePropsChange('displayMode', v)} options={[
                { value: 'list', label: '列表模式' },
                { value: 'grid', label: '网格模式' },
              ]} />
            </Form.Item>
            <Form.Item label="显示标题区域">
              <Switch checked={props.showTitle} onChange={(v) => handlePropsChange('showTitle', v)} />
            </Form.Item>
            {props.showTitle && (
              <Form.Item label="自定义标题">
                <Input value={props.sectionTitle} onChange={(e) => handlePropsChange('sectionTitle', e.target.value)} placeholder="例如：最新文章、公司新闻" />
              </Form.Item>
            )}
            <Form.Item label="每页显示数量">
              <InputNumber min={1} max={50} value={props.limit} onChange={(v) => handlePropsChange('limit', v)} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="显示分页">
              <Switch checked={props.showPagination} onChange={(v) => handlePropsChange('showPagination', v)} />
            </Form.Item>
            
            {/* 分类和标签选择 */}
            <Form.Item label="按分类筛选" tooltip="留空则显示所有分类">
              <Select 
                value={props.categoryId || undefined} 
                onChange={(v) => handlePropsChange('categoryId', v)} 
                placeholder="选择文章分类"
                allowClear
                showSearch
                filterOption={(input, option) => 
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={[
                  { value: undefined, label: '全部分类' },
                  ...categories.map(cat => ({ value: cat.id, label: cat.name }))
                ]}
              />
            </Form.Item>
            <Form.Item label="按标签筛选" tooltip="留空则显示所有标签">
              <Select 
                value={props.tagId || undefined} 
                onChange={(v) => handlePropsChange('tagId', v)} 
                placeholder="选择文章标签"
                allowClear
                showSearch
                filterOption={(input, option) => 
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={[
                  { value: undefined, label: '全部标签' },
                  ...tags.map(tag => ({ value: tag.id, label: tag.name }))
                ]}
              />
            </Form.Item>
            
            <div style={{ fontSize: '12px', color: '#999', padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
              💡 提示：可以通过分类和标签快速筛选要展示的文章
            </div>
          </>
        )}
      </Form>
    );
  };

  return (
    <Layout style={{ height: 'calc(100vh - 88px)', background: '#f5f5f5' }}>
      {/* 左侧组件面板 */}
      <Sider width={200} style={{ background: '#fff', padding: '16px', overflowY: 'auto' }}>
        <Flex vertical gap={8} style={{ marginBottom: 16 }}>
          <Button
            block
            type="primary"
            icon={<AppstoreAddOutlined />}
            onClick={handleSelectTemplate}
          >
            选择模板
          </Button>
          <Button
            block
            icon={<ClearOutlined />}
            onClick={handleClear}
            disabled={components.length === 0}
          >
            清空画布
          </Button>
          
          {/* 预设模板按钮 */}
          {['solutions', 'cases', 'about'].includes(currentPageKey) && (
            <>
              <div style={{ margin: '12px 0 8px', fontWeight: 'bold', fontSize: '14px', borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
                页面模板
              </div>
              <Flex vertical gap={8}>
                <Button
                  block
                  onClick={() => handleUseTemplate('solutions' as any)}
                  disabled={currentPageKey !== 'solutions'}
                >
                  🎯 解决方案模板
                </Button>
                <Button
                  block
                  onClick={() => handleUseTemplate('cases' as any)}
                  disabled={currentPageKey !== 'cases'}
                >
                  🏆 成功案例模板
                </Button>
                <Button
                  block
                  onClick={() => handleUseTemplate('about' as any)}
                  disabled={currentPageKey !== 'about'}
                >
                  👥 关于我们模板
                </Button>
              </Flex>
            </>
          )}
        </Flex>
        
        <div style={{ marginBottom: 12, fontWeight: 'bold', fontSize: '14px', borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>组件库</div>
        <Flex vertical gap={8}>
          {COMPONENT_LIST.map((item) => (
            <Button
              key={item.type}
              block
              icon={ICON_MAP[item.icon]}
              onClick={() => handleAddComponent(item.type)}
              style={{ textAlign: 'left', justifyContent: 'flex-start' }}
            >
              {item.label}
            </Button>
          ))}
        </Flex>
      </Sider>

      {/* 中间画布 */}
      <Content style={{ padding: '16px', overflowY: 'auto' }}>
        <Card
          title={
            <Space>
              <Select
                value={currentPageKey}
                onChange={handlePageChange}
                style={{ width: 140 }}
                options={pageList.map(p => ({ value: p.key, label: p.title }))}
                placeholder="选择页面"
                suffixIcon={<FileOutlined />}
              />
              <Input
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
                style={{ width: 120 }}
                placeholder="页面名称"
              />
              <Button icon={<EyeOutlined />} onClick={() => setPreviewMode(!previewMode)}>
                {previewMode ? '编辑模式' : '预览模式'}
              </Button>
            </Space>
          }
          extra={
            <Space>
              {selectedId && (
                <>
                  <Button icon={<ArrowUpOutlined />} onClick={() => handleMove('up')} />
                  <Button icon={<ArrowDownOutlined />} onClick={() => handleMove('down')} />
                  <Button icon={<DeleteOutlined />} danger onClick={handleDelete} />
                </>
              )}
              <Button icon={<SaveOutlined />} onClick={handleSave}>
                保存草稿
              </Button>
              <Button 
                type="primary" 
                icon={<CloudUploadOutlined />} 
                onClick={handlePublish}
                loading={saving}
              >
                发布上线
              </Button>
            </Space>
          }
          style={{ minHeight: '100%' }}
          styles={{ body: { background: '#fff', minHeight: '500px' } }}
        >
          {components.length === 0 ? (
            <Empty description="从左侧拖入组件开始设计页面" style={{ padding: '100px 0' }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAddComponent('hero')}>
                添加横幅组件
              </Button>
            </Empty>
          ) : previewMode ? (
            // 预览模式
            <div>
              {components.map((component) => (
                <ComponentRenderer key={component.id} component={component} />
              ))}
            </div>
          ) : (
            // 编辑模式
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={components.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                {components.map((component) => (
                  <SortableItem
                    key={component.id}
                    id={component.id}
                    component={component}
                    isSelected={selectedId === component.id}
                    onSelect={() => setSelectedId(component.id)}
                    onDelete={(componentId: string) => {
                      setComponents(components.filter((c) => c.id !== componentId));
                      setSelectedId(null);
                      message.success('已删除组件');
                    }}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </Card>
      </Content>

      {/* 右侧属性面板 */}
      <Sider width={280} style={{ background: '#fff', padding: '16px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 16, fontWeight: 'bold', fontSize: '14px' }}>
          属性设置 {selectedComponent && `- ${COMPONENT_LIST.find((c) => c.type === selectedComponent.type)?.label}`}
        </div>
        {renderPropsEditor()}
      </Sider>
    </Layout>
  );
};

export default PageEditor;
