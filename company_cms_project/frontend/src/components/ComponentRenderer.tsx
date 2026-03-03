import React from 'react';
import { Button, Card, Input, Form, Row, Col, Divider, message } from 'antd';
import type { PageComponent } from '../types/components';

const { TextArea } = Input;

interface ComponentRendererProps {
  component: PageComponent;
  isEditing?: boolean;
  onSelect?: () => void;
  isSelected?: boolean;
}

// Hero 横幅渲染
const HeroRenderer: React.FC<{ props: any }> = ({ props }) => (
  <div
    style={{
      height: props.height || 400,
      background: props.backgroundImage
        ? `url(${props.backgroundImage}) center/cover`
        : props.backgroundColor || '#1677ff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: props.textAlign || 'center',
      color: '#fff',
      padding: '40px 20px',
    }}
  >
    <h1 style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '16px', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
      {props.title || '横幅标题'}
    </h1>
    <p style={{ fontSize: '18px', opacity: 0.9, maxWidth: '600px', marginBottom: '24px' }}>
      {props.subtitle || '副标题描述'}
    </p>
    {props.buttonText && (
      <Button type="primary" size="large" ghost style={{ borderColor: '#fff', color: '#fff' }}>
        {props.buttonText}
      </Button>
    )}
  </div>
);

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
  const buttonType = props.variant === 'outline' ? 'default' : props.variant || 'primary';
  return (
    <div style={{ padding: '16px', textAlign: 'center' }}>
      <Button
        type={buttonType}
        size={props.size || 'middle'}
        block={props.block}
        style={props.variant === 'outline' ? { borderStyle: 'solid' } : {}}
      >
        {props.text || '按钮'}
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

// 组件类型到渲染器的映射
const RENDERER_MAP: Record<string, React.FC<{ props: any }>> = {
  hero: HeroRenderer,
  text: TextRenderer,
  image: ImageRenderer,
  button: ButtonRenderer,
  container: ContainerRenderer,
  form: FormRenderer,
  cards: CardsRenderer,
  divider: DividerRenderer,
};

// 主组件渲染器
const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  isEditing = false,
  onSelect,
  isSelected = false,
}) => {
  const Renderer = RENDERER_MAP[component.type];

  if (!Renderer) {
    return <div style={{ padding: 16, color: '#999' }}>未知组件类型: {component.type}</div>;
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
        )}
        <Renderer props={component.props} />
      </div>
    );
  }

  return <Renderer props={component.props} />;
};

export default ComponentRenderer;
