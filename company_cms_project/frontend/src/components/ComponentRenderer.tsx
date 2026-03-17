import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Form, Row, Col, Divider, message, Typography, Tag, Space, Skeleton, Empty, Pagination, Popconfirm } from 'antd';
import type { PageComponent } from '../types/components';
import { getPublicPosts } from '../api/posts';
import { useNavigate, Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { 
  DeleteOutlined,
  SearchOutlined,
  RightOutlined,
  LeftOutlined,
  HomeOutlined,
  LinkOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  SendOutlined,
  DownloadOutlined,
  PlayCircleOutlined,
  HeartOutlined,
  StarOutlined,
  SettingOutlined,
  UserOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  CustomerServiceOutlined,
  BellOutlined,
  GiftOutlined,
  CalendarOutlined,
  CameraOutlined,
  EditOutlined,
  ShareAltOutlined,
  LikeOutlined,
  MessageOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;
const { Meta } = Card;

// 按钮图标映射
const BUTTON_ICON_MAP: Record<string, React.ReactNode> = {
  SearchOutlined: <SearchOutlined />,
  RightOutlined: <RightOutlined />,
  LeftOutlined: <LeftOutlined />,
  HomeOutlined: <HomeOutlined />,
  LinkOutlined: <LinkOutlined />,
  EnvironmentOutlined: <EnvironmentOutlined />,
  PhoneOutlined: <PhoneOutlined />,
  MailOutlined: <MailOutlined />,
  SendOutlined: <SendOutlined />,
  DownloadOutlined: <DownloadOutlined />,
  PlayCircleOutlined: <PlayCircleOutlined />,
  HeartOutlined: <HeartOutlined />,
  StarOutlined: <StarOutlined />,
  SettingOutlined: <SettingOutlined />,
  UserOutlined: <UserOutlined />,
  TeamOutlined: <TeamOutlined />,
  ShoppingCartOutlined: <ShoppingCartOutlined />,
  CustomerServiceOutlined: <CustomerServiceOutlined />,
  BellOutlined: <BellOutlined />,
  GiftOutlined: <GiftOutlined />,
  CalendarOutlined: <CalendarOutlined />,
  CameraOutlined: <CameraOutlined />,
  EditOutlined: <EditOutlined />,
  ShareAltOutlined: <ShareAltOutlined />,
  LikeOutlined: <LikeOutlined />,
  MessageOutlined: <MessageOutlined />,
  QuestionCircleOutlined: <QuestionCircleOutlined />,
  CheckCircleOutlined: <CheckCircleOutlined />,
  CloseCircleOutlined: <CloseCircleOutlined />,
  InfoCircleOutlined: <InfoCircleOutlined />,
  WarningOutlined: <WarningOutlined />,
};

interface ComponentRendererProps {
  component: PageComponent;
  isEditing?: boolean;
  onSelect?: () => void;
  isSelected?: boolean;
  onDelete?: (componentId: string) => void;
}

// Hero 横幅渲染
const HeroRenderer: React.FC<{ props: any }> = ({ props }) => {
  const navigate = useNavigate();
  
  // 构建背景样式
  const backgroundStyle: React.CSSProperties = {
    height: props.height || 400,
    display: 'flex',
    flexDirection: 'column',
    alignItems: props.textAlign === 'left' ? 'flex-start' : props.textAlign === 'right' ? 'flex-end' : 'center',
    justifyContent: 'center',
    textAlign: props.textAlign || 'center',
    color: '#fff',
    padding: '40px 20px',
  };

  // 如果有背景图片，设置背景相关属性
  if (props.backgroundImage) {
    // 背景图片 URL
    backgroundStyle.backgroundImage = `url(${props.backgroundImage})`;
    
    // 背景填充模式
    switch (props.backgroundFit) {
      case 'cover':
        backgroundStyle.backgroundSize = 'cover';
        break;
      case 'contain':
        backgroundStyle.backgroundSize = 'contain';
        break;
      case 'fill':
        backgroundStyle.backgroundSize = '100% 100%';
        break;
      case 'repeat':
        backgroundStyle.backgroundSize = 'auto';
        backgroundStyle.backgroundRepeat = 'repeat';
        break;
      default:
        backgroundStyle.backgroundSize = 'cover';
    }
    
    // 背景位置
    switch (props.backgroundPosition) {
      case 'center':
        backgroundStyle.backgroundPosition = 'center';
        break;
      case 'top':
        backgroundStyle.backgroundPosition = 'center top';
        break;
      case 'bottom':
        backgroundStyle.backgroundPosition = 'center bottom';
        break;
      case 'left':
        backgroundStyle.backgroundPosition = 'left center';
        break;
      case 'right':
        backgroundStyle.backgroundPosition = 'right center';
        break;
      default:
        backgroundStyle.backgroundPosition = 'center';
    }
  } else {
    // 没有背景图时使用背景色
    backgroundStyle.background = props.backgroundColor || '#1677ff';
  }

  // 构建按钮样式
  const buildButtonStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {};
    
    // 圆角
    if (props.buttonBorderRadius !== undefined) {
      style.borderRadius = props.buttonBorderRadius;
    }
    
    // 阴影
    if (props.buttonShadow) {
      style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    }
    
    // 自定义颜色
    if (props.buttonBackgroundColor) {
      style.backgroundColor = props.buttonBackgroundColor;
      if (!props.buttonBorderColor && props.buttonVariant !== 'text' && props.buttonVariant !== 'link') {
        style.borderColor = props.buttonBackgroundColor;
      }
    }
    if (props.buttonTextColor) {
      style.color = props.buttonTextColor;
    }
    if (props.buttonBorderColor) {
      style.borderColor = props.buttonBorderColor;
    }
    
    return style;
  };
  
  // 获取按钮图标
  const getButtonIcon = (): React.ReactNode | undefined => {
    if (!props.buttonIcon) return undefined;
    const icon = BUTTON_ICON_MAP[props.buttonIcon];
    if (!icon) return undefined;
    if (props.buttonIconPosition === 'right') return undefined;
    return icon;
  };
  
  const getButtonRightIcon = (): React.ReactNode | undefined => {
    if (!props.buttonIcon) return undefined;
    const icon = BUTTON_ICON_MAP[props.buttonIcon];
    if (!icon) return undefined;
    if (props.buttonIconPosition === 'right') return icon;
    return undefined;
  };
  
  // 计算按钮链接地址
  const getButtonLinkUrl = (): string | null => {
    const linkType = props.buttonLinkType || 'none';
    const linkValue = props.buttonLinkValue;
    
    switch (linkType) {
      case 'home':
        return '/';
      case 'page':
        return linkValue ? `/${linkValue}` : null;
      case 'url':
        return linkValue || null;
      default:
        return null;
    }
  };
  
  // 处理按钮点击
  const handleButtonClick = () => {
    const url = getButtonLinkUrl();
    if (!url) return;
    
    const openInNewTab = props.buttonOpenInNewTab;
    if (openInNewTab || props.buttonLinkType === 'url') {
      window.open(url, openInNewTab ? '_blank' : '_self');
    } else {
      navigate(url);
    }
  };
  
  // 获取按钮类型
  const getButtonType = (): 'primary' | 'default' | 'dashed' | 'text' | 'link' => {
    return props.buttonVariant || 'primary';
  };
  
  // 渲染按钮
  const renderButton = () => {
    if (!props.buttonText) return null;
    
    const linkUrl = getButtonLinkUrl();
    const buttonContent = (
      <>
        {getButtonIcon()}
        {props.buttonText}
        {getButtonRightIcon()}
      </>
    );
    
    const buttonStyle = buildButtonStyle();
    const isGhost = props.buttonGhost !== false; // 默认为幽灵模式
    
    // 如果有内部链接且不是新窗口打开，使用 Link 组件
    if (linkUrl && props.buttonLinkType !== 'url' && !props.buttonOpenInNewTab) {
      return (
        <Link to={linkUrl} style={{ textDecoration: 'none' }}>
          <Button
            type={getButtonType()}
            size={props.buttonSize || 'large'}
            ghost={isGhost}
            style={{ 
              borderColor: isGhost ? '#fff' : undefined,
              color: isGhost ? '#fff' : undefined,
              ...buttonStyle 
            }}
          >
            {buttonContent}
          </Button>
        </Link>
      );
    }
    
    return (
      <Button
        type={getButtonType()}
        size={props.buttonSize || 'large'}
        ghost={isGhost}
        style={{ 
          borderColor: isGhost ? '#fff' : undefined,
          color: isGhost ? '#fff' : undefined,
          ...buttonStyle 
        }}
        onClick={handleButtonClick}
      >
        {buttonContent}
      </Button>
    );
  };

  return (
    <div style={backgroundStyle}>
      <h1 style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '16px', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
        {props.title || '横幅标题'}
      </h1>
      <p style={{ fontSize: '18px', opacity: 0.9, maxWidth: '600px', marginBottom: '24px' }}>
        {props.subtitle || '副标题描述'}
      </p>
      {renderButton()}
    </div>
  );
};

// 文本块渲染
const TextRenderer: React.FC<{ props: any }> = ({ props }) => (
  <div
    style={{
      fontSize: props.fontSize || 16,
      fontWeight: props.fontWeight || 'normal',
      color: props.color || '#333',
      textAlign: props.textAlign || 'left',
      padding: props.padding || 16,
      lineHeight: 1.8,
    }}
  >
    {props.content || '文本内容'}
  </div>
);

// 图片渲染
const ImageRenderer: React.FC<{ props: any }> = ({ props }) => (
  <div style={{ width: '100%', textAlign: 'center' }}>
    {props.src ? (
      <img
        src={props.src}
        alt={props.alt || ''}
        style={{
          width: props.width || '100%',
          height: props.height || 'auto',
          objectFit: props.objectFit || 'cover',
          borderRadius: props.borderRadius || 0,
        }}
      />
    ) : (
      <div
        style={{
          width: '100%',
          height: '200px',
          background: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          borderRadius: props.borderRadius || 0,
        }}
      >
        请设置图片地址
      </div>
    )}
  </div>
);

// 按钮渲染
const ButtonRenderer: React.FC<{ props: any }> = ({ props }) => {
  const navigate = useNavigate();
  
  // 获取按钮类型
  const getButtonType = (): 'primary' | 'default' | 'dashed' | 'text' | 'link' => {
    return props.variant || 'primary';
  };
  
  // 构建按钮样式
  const buildButtonStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {};
    
    // 圆角
    if (props.borderRadius !== undefined) {
      style.borderRadius = props.borderRadius;
    }
    
    // 阴影
    if (props.shadow) {
      style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    }
    
    // 自定义颜色
    if (props.backgroundColor) {
      style.backgroundColor = props.backgroundColor;
      // 如果设置了背景色但没有边框颜色，使用背景色作为边框色
      if (!props.borderColor && props.variant !== 'text' && props.variant !== 'link') {
        style.borderColor = props.backgroundColor;
      }
    }
    if (props.textColor) {
      style.color = props.textColor;
    }
    if (props.borderColor) {
      style.borderColor = props.borderColor;
    }
    
    // 宽度设置
    if (props.widthType === 'full') {
      style.width = '100%';
    } else if (props.widthType === 'fixed' && props.customWidth) {
      style.width = props.customWidth;
    }
    
    return style;
  };
  
  // 获取图标
  const getIcon = (): React.ReactNode | undefined => {
    if (!props.icon) return undefined;
    const icon = BUTTON_ICON_MAP[props.icon];
    if (!icon) return undefined;
    
    // 如果图标在右侧，返回 undefined，稍后处理
    if (props.iconPosition === 'right') return undefined;
    return icon;
  };
  
  // 获取右侧图标
  const getRightIcon = (): React.ReactNode | undefined => {
    if (!props.icon) return undefined;
    const icon = BUTTON_ICON_MAP[props.icon];
    if (!icon) return undefined;
    
    if (props.iconPosition === 'right') return icon;
    return undefined;
  };
  
  // 计算链接地址
  const getLinkUrl = (): string | null => {
    const linkType = props.linkType || 'none';
    const linkValue = props.linkValue;
    
    switch (linkType) {
      case 'home':
        return '/';
      case 'page':
        return linkValue ? `/${linkValue}` : null;
      case 'url':
        return linkValue || null;
      default:
        return null;
    }
  };
  
  // 处理按钮点击
  const handleClick = () => {
    const url = getLinkUrl();
    if (!url) return;
    
    // 根据配置决定打开方式
    const openInNewTab = props.openInNewTab;
    if (openInNewTab || props.linkType === 'url') {
      window.open(url, openInNewTab ? '_blank' : '_self');
    } else {
      // 内部链接使用路由导航
      navigate(url);
    }
  };
  
  // 构建容器样式
  const containerStyle: React.CSSProperties = {
    padding: `${props.padding ?? 16}px 16px`,
    textAlign: props.align || 'center',
  };
  
  // 构建按钮内容
  const buttonContent = (
    <>
      {getIcon()}
      {props.text || '按钮'}
      {getRightIcon()}
    </>
  );
  
  const linkUrl = getLinkUrl();
  const isBlock = props.widthType === 'full';
  
  // 如果有内部链接且不是新窗口打开，使用 Link 组件包裹
  if (linkUrl && props.linkType !== 'url' && !props.openInNewTab) {
    return (
      <div style={containerStyle}>
        <Link to={linkUrl} style={{ textDecoration: 'none' }}>
          <Button
            type={getButtonType()}
            size={props.size || 'middle'}
            block={isBlock}
            style={buildButtonStyle()}
          >
            {buttonContent}
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div style={containerStyle}>
      <Button
        type={getButtonType()}
        size={props.size || 'middle'}
        block={isBlock}
        style={buildButtonStyle()}
        onClick={handleClick}
      >
        {buttonContent}
      </Button>
    </div>
  );
};

// 容器渲染
const ContainerRenderer: React.FC<{ props: any }> = ({ props }) => {
  const columns = props.columns || 1;
  const layout = props.layout || 'vertical';
  
  // 根据布局类型确定样式
  const containerStyle: React.CSSProperties = {
    backgroundColor: props.backgroundColor || '#fff',
    padding: props.padding || 24,
    maxWidth: props.maxWidth || '100%',
    margin: '0 auto',
    gap: props.gap || 16,
  };

  if (layout === 'grid') {
    // 网格布局
    Object.assign(containerStyle, {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      alignItems: props.alignItems || 'stretch',
    });
  } else {
    // Flex 布局
    Object.assign(containerStyle, {
      display: 'flex',
      flexDirection: layout === 'horizontal' ? 'row' : 'column',
      flexWrap: layout === 'horizontal' ? 'wrap' : 'nowrap',
      alignItems: props.alignItems || 'stretch',
      justifyContent: props.justifyContent || 'flex-start',
    });
  }

  return (
    <div style={containerStyle}>
      {props.children?.length > 0 ? (
        props.children.map((child: any) => {
          // 计算子组件宽度
          const span = child.span || 1;
          const childStyle: React.CSSProperties = {};
          
          if (layout === 'grid') {
            childStyle.gridColumn = `span ${Math.min(span, columns)}`;
          } else if (layout === 'horizontal') {
            // 横向布局时，根据 span 计算宽度百分比
            const widthPercent = (span / columns) * 100;
            childStyle.flex = `0 0 calc(${widthPercent}% - ${props.gap || 16}px)`;
            childStyle.maxWidth = `calc(${widthPercent}% - ${props.gap || 16}px)`;
          }
          
          return (
            <div key={child.id} style={childStyle}>
              <ComponentRenderer component={child} />
            </div>
          );
        })
      ) : (
        <div style={{ textAlign: 'center', color: '#999', padding: '20px', width: '100%' }}>
          容器为空，请添加子组件
        </div>
      )}
    </div>
  );
};

// 表单渲染
const FormRenderer: React.FC<{ props: any }> = ({ props }) => {
  const onFinish = () => {
    message.success('留言提交成功！');
  };

  return (
    <Card title={props.title || '联系我们'} style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Form layout="vertical" onFinish={onFinish}>
        {props.fields?.map((field: any) => (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={field.required ? [{ required: true, message: `请输入${field.label}` }] : []}
          >
            {field.type === 'textarea' ? (
              <TextArea rows={4} placeholder={`请输入${field.label}`} />
            ) : (
              <Input type={field.type || 'text'} placeholder={`请输入${field.label}`} />
            )}
          </Form.Item>
        ))}
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {props.submitText || '提交'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

// 卡片列表渲染
const CardsRenderer: React.FC<{ props: any }> = ({ props }) => (
  <div style={{ padding: '24px' }}>
    <Row gutter={[24, 24]}>
      {props.items?.map((item: any, index: number) => (
        <Col key={index} xs={24} sm={12} md={24 / (props.columns || 3)}>
          <Card hoverable cover={item.image && <img alt={item.title} src={item.image} style={{ height: 150, objectFit: 'cover' }} />}>
            <Card.Meta title={item.title} description={item.description} />
          </Card>
        </Col>
      ))}
    </Row>
  </div>
);

// 分割线渲染
const DividerRenderer: React.FC<{ props: any }> = ({ props }) => (
  <Divider
    style={{
      borderStyle: props.style || 'solid',
      borderColor: props.color || '#e8e8e8',
      margin: `${props.margin || 24}px 0`,
    }}
  />
);

// 文章列表渲染
const ArticlesRenderer: React.FC<{ component: PageComponent }> = ({ component }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  // 安全地获取 props，使用类型断言
  const props = component.props as any;
  const categoryId = props?.categoryId;
  const tagId = props?.tagId;
  const limit = props?.limit || 10;
  const showPagination = props?.showPagination ?? true;
  const displayMode = props?.displayMode || 'list';
  const showTitle = props?.showTitle ?? false;
  const sectionTitle = props?.sectionTitle || '最新文章';

  useEffect(() => {
    fetchArticles();
  }, [page, categoryId, tagId]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        per_page: limit
      };
      
      if (categoryId) {
        params.category_id = categoryId;
      }
      
      if (tagId) {
        params.tag_id = tagId;
      }

      const res = await getPublicPosts(params);
      setArticles(res.data.items);
      setTotal(res.data.pagination.total);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div style={{ padding: displayMode === 'grid' ? '24px' : '0' }}>
      {/* 标题区域 */}
      {showTitle && (
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <Title level={2}>{sectionTitle}</Title>
        </div>
      )}

      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : articles.length === 0 ? (
        <Empty description="暂无文章" />
      ) : (
        <>
          {displayMode === 'grid' ? (
            // 网格模式
            <Row gutter={[24, 24]}>
              {articles.map((article) => (
                <Col span={24} key={article.id}>
                  <Card
                    hoverable
                    onClick={() => navigate(`/post/${article.id}`)}
                    style={{ borderRadius: '8px' }}
                  >
                    <Meta
                      title={
                        <Title level={4} style={{ margin: 0 }}>
                          {article.title}
                        </Title>
                      }
                      description={
                        <>
                          <Space style={{ marginBottom: 8 }}>
                            <span>作者：{article.author_name}</span>
                            <span>·</span>
                            <span>{dayjs(article.published_at).format('YYYY-MM-DD')}</span>
                            <span>·</span>
                            <span>浏览：{article.view_count}</span>
                          </Space>
                          
                          {/* 分类和标签 */}
                          <Space wrap style={{ marginBottom: 8 }}>
                            {article.categories && article.categories.map((cat: any) => (
                              <Tag key={cat.id} color="blue">{cat.name}</Tag>
                            ))}
                            {article.tags && article.tags.map((tag: any) => (
                              <Tag key={tag.id}>{tag.name}</Tag>
                            ))}
                          </Space>

                          {/* 摘要 */}
                          {article.excerpt && (
                            <Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0 }}>
                              {article.excerpt}
                            </Paragraph>
                          )}
                        </>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            // 列表模式
            <div>
              {articles.map((article) => (
                <Card
                  key={article.id}
                  hoverable
                  onClick={() => navigate(`/post/${article.id}`)}
                  style={{ marginBottom: 16, borderRadius: '8px', cursor: 'pointer' }}
                >
                  <Meta
                    title={<Title level={4} style={{ margin: 0 }}>{article.title}</Title>}
                    description={
                      <Space direction="vertical" style={{ width: '100%', marginTop: 8 }}>
                        <Space>
                          <span>作者：{article.author_name}</span>
                          <Divider type="vertical" />
                          <span>{dayjs(article.published_at).format('YYYY-MM-DD')}</span>
                          <Divider type="vertical" />
                          <span>浏览：{article.view_count}</span>
                        </Space>
                        
                        {/* 分类和标签 */}
                        <Space wrap>
                          {article.categories && article.categories.map((cat: any) => (
                            <Tag key={cat.id} color="blue">{cat.name}</Tag>
                          ))}
                          {article.tags && article.tags.map((tag: any) => (
                            <Tag key={tag.id}>{tag.name}</Tag>
                          ))}
                        </Space>

                        {/* 摘要 */}
                        {article.excerpt && (
                          <Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0 }}>
                            {article.excerpt}
                          </Paragraph>
                        )}
                      </Space>
                    }
                  />
                </Card>
              ))}
            </div>
          )}

          {showPagination && total > limit && (
            <Pagination
              current={page}
              total={total}
              pageSize={limit}
              onChange={handlePageChange}
              style={{ marginTop: 24, textAlign: 'center' }}
              showSizeChanger={false}
            />
          )}
        </>
      )}
    </div>
  );
};

// 组件类型到渲染器的映射
const RENDERER_MAP: Record<string, React.FC<any>> = {
  hero: HeroRenderer,
  text: TextRenderer,
  image: ImageRenderer,
  button: ButtonRenderer,
  container: ContainerRenderer,
  form: FormRenderer,
  cards: CardsRenderer,
  divider: DividerRenderer,
  articles: ArticlesRenderer,
};

// 主组件渲染器
const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  isEditing = false,
  onSelect,
  isSelected = false,
  onDelete,
}) => {
  const Renderer = RENDERER_MAP[component.type];

  if (!Renderer) {
    return <div style={{ padding: 16, color: '#999' }}>未知组件类型：{component.type}</div>;
  }

  // 文章列表组件特殊处理
  if (component.type === 'articles') {
    return <Renderer component={component} />;
  }

  if (isEditing) {
    return (
      <div
        onClick={onSelect}
        style={{
          border: isSelected ? '2px solid #1677ff' : '2px dashed transparent',
          borderRadius: '4px',
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.borderColor = '#d9d9d9';
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.borderColor = 'transparent';
          }
        }}
      >
        {isSelected && (
          <>
            <div
              style={{
                position: 'absolute',
                top: -10,
                left: 10,
                background: '#1677ff',
                color: '#fff',
                padding: '2px 8px',
                fontSize: '12px',
                borderRadius: '4px',
                zIndex: 10,
              }}
            >
              {component.type}
            </div>
            {onDelete && (
              <Popconfirm
                title="删除组件"
                description="确定要删除此组件吗？"
                onConfirm={(e) => {
                  e?.stopPropagation();
                  onDelete(component.id);
                }}
                okText="确定"
                cancelText="取消"
                getPopupContainer={() => document.body}
              >
                <Button
                  type="primary"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '10px',
                    zIndex: 11,
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </Popconfirm>
            )}
          </>
        )}
        <Renderer props={component.props} />
      </div>
    );
  }

  return <Renderer props={component.props} />;
};

export default ComponentRenderer;
