import React, { useState, useEffect } from 'react';
import { Layout, Card, Button, Space, message, Empty, Input, Form, Select, InputNumber, Switch, ColorPicker, Modal, Flex, Spin } from 'antd';
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
import { COMPONENT_LIST, type PageComponent, type ComponentType } from '../types/components';
import { savePageConfig, getPageConfig } from '../api/pages';
import { getEditablePages } from '../api/menus';

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

// 可排序组件包装器
const SortableItem: React.FC<{
  id: string;
  component: PageComponent;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ id, component, isSelected, onSelect }) => {
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
  const [loading, setLoading] = useState(false);
  const [currentPageKey, setCurrentPageKey] = useState('home');
  const [pageList, setPageList] = useState<{key: string; title: string; path: string}[]>([]);
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

  // 从 URL 参数获取当前页面
  useEffect(() => {
    const pageKey = searchParams.get('page') || 'home';
    setCurrentPageKey(pageKey);
  }, [searchParams]);

  // 加载页面数据
  useEffect(() => {
    const loadPageData = async () => {
      setLoading(true);
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
            setLoading(false);
            message.info(`已加载本地草稿: ${data.name || '草稿'}`);
            return;
          }
        } catch (e) {
          console.error('Failed to load draft:', e);
        }
      }
      
      // 从后端加载
      try {
        const res = await getPageConfig(currentPageKey);
        if (res.data && res.data.components && res.data.components.length > 0) {
          setComponents(res.data.components);
          setPageName(res.data.name || currentPageKey);
          setTemplateId(res.data.templateId || null);
        } else {
          // 新页面，清空内容
          setComponents([]);
          const pageInfo = pageList.find(p => p.key === currentPageKey);
          setPageName(pageInfo?.title || currentPageKey);
          setTemplateId(null);
        }
      } catch (e) {
        // 页面不存在，初始化为空
        setComponents([]);
        const pageInfo = pageList.find(p => p.key === currentPageKey);
        setPageName(pageInfo?.title || currentPageKey);
        setTemplateId(null);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentPageKey) {
      loadPageData();
    }
  }, [currentPageKey, pageList]);

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
      
      await savePageConfig(currentPageKey, pageData);
      
      // 发布成功后清除本地草稿
      localStorage.removeItem(`page_draft_${currentPageKey}`);
      
      const pageInfo = pageList.find(p => p.key === currentPageKey);
      message.success(`「${pageInfo?.title || currentPageKey}」页面已成功发布！`);
    } catch (error) {
      console.error('Publish failed:', error);
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
            <Form.Item label="标题">
              <Input value={props.title} onChange={(e) => handlePropsChange('title', e.target.value)} />
            </Form.Item>
            <Form.Item label="副标题">
              <Input value={props.subtitle} onChange={(e) => handlePropsChange('subtitle', e.target.value)} />
            </Form.Item>
            <Form.Item label="背景色">
              <ColorPicker value={props.backgroundColor} onChange={(c) => handlePropsChange('backgroundColor', c.toHexString())} />
            </Form.Item>
            <Form.Item label="高度 (px)">
              <InputNumber value={props.height} onChange={(v) => handlePropsChange('height', v)} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="按钮文字">
              <Input value={props.buttonText} onChange={(e) => handlePropsChange('buttonText', e.target.value)} placeholder="留空则不显示按钮" />
            </Form.Item>
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
            <Form.Item label="图片地址">
              <Input value={props.src} onChange={(e) => handlePropsChange('src', e.target.value)} placeholder="输入图片 URL" />
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
          </>
        )}

        {type === 'button' && (
          <>
            <Form.Item label="按钮文字">
              <Input value={props.text} onChange={(e) => handlePropsChange('text', e.target.value)} />
            </Form.Item>
            <Form.Item label="链接地址">
              <Input value={props.link} onChange={(e) => handlePropsChange('link', e.target.value)} placeholder="点击跳转的 URL" />
            </Form.Item>
            <Form.Item label="样式">
              <Select value={props.variant} onChange={(v) => handlePropsChange('variant', v)} options={[
                { value: 'primary', label: '主要按钮' },
                { value: 'default', label: '默认按钮' },
                { value: 'outline', label: '边框按钮' },
              ]} />
            </Form.Item>
            <Form.Item label="尺寸">
              <Select value={props.size} onChange={(v) => handlePropsChange('size', v)} options={[
                { value: 'small', label: '小' },
                { value: 'middle', label: '中' },
                { value: 'large', label: '大' },
              ]} />
            </Form.Item>
            <Form.Item label="通栏显示">
              <Switch checked={props.block} onChange={(v) => handlePropsChange('block', v)} />
            </Form.Item>
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
              <InputNumber min={1} max={4} value={props.columns} onChange={(v) => handlePropsChange('columns', v)} style={{ width: '100%' }} />
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
                  { value: 6, label: '6 列' },
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
                    <Form.Item label="图片地址" style={{ marginBottom: 0 }}>
                      <Input 
                        value={child.props?.src} 
                        onChange={(e) => {
                          const newChildren = [...(props.children || [])];
                          newChildren[index] = { ...newChildren[index], props: { ...newChildren[index].props, src: e.target.value } };
                          handlePropsChange('children', newChildren);
                        }} 
                      />
                    </Form.Item>
                  )}
                </Card>
              ))}
              
              {/* 添加子组件 */}
              <Select
                placeholder="选择要添加的子组件"
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
                options={[
                  { value: 'text', label: '文本块' },
                  { value: 'image', label: '图片' },
                  { value: 'button', label: '按钮' },
                  { value: 'cards', label: '卡片列表' },
                  { value: 'divider', label: '分割线' },
                ]}
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
