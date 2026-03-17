// 组件类型定义
export type ComponentType = 
  | 'hero'        // 横幅大图
  | 'text'        // 文本块
  | 'image'       // 图片块
  | 'button'      // 按钮
  | 'container'   // 容器/布局
  | 'form'        // 表单（留言）
  | 'cards'       // 卡片列表
  | 'divider'     // 分割线
  | 'articles';   // 文章列表

// 底栏元素类型
export type FooterElementType = 
  | 'text'        // 文本元素
  | 'image'       // 图片元素
  | 'link'        // 链接元素
  | 'divider';    // 分割线元素

// 底栏配置接口
export interface FooterElement {
  id: string;
  type: FooterElementType;
  content?: string;
  src?: string;
  href?: string;
  alt?: string;
  style?: React.CSSProperties;
}

export interface FooterConfig {
  enabled: boolean;
  height: number;
  backgroundColor: string;
  textColor: string;
  title: string;
  description: string;
  copyright: string;
  elements: FooterElement[];
}

// LOGO 配置接口
export interface LogoConfig {
  enabled: boolean;
  displayMode: 'textOnly' | 'imageOnly' | 'textAndImage';
  logoImage?: string;
  logoImageWidth: number;
  logoImageHeight: number;
  logoText: string;
  logoSubText?: string;
  textColor: string;
  subTextColor?: string;
  fontSize: number;
  subFontSize?: number;
  fontWeight: number;
  letterSpacing: number;
  imageGap?: number;
  linkUrl: string;
}

// 基础组件数据结构
export interface BaseComponent {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
}

// Hero 横幅组件
export interface HeroComponentData extends BaseComponent {
  type: 'hero';
  props: {
    title: string;
    subtitle: string;
    backgroundImage?: string;
    backgroundColor?: string;
    backgroundFit?: 'cover' | 'contain' | 'fill' | 'repeat';
    backgroundPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right';
    buttonText?: string;
    buttonLink?: string;
    height?: number;
    textAlign?: 'left' | 'center' | 'right';
  };
}

// 文本块组件
export interface TextComponentData extends BaseComponent {
  type: 'text';
  props: {
    content: string;
    fontSize?: number;
    fontWeight?: 'normal' | 'bold';
    color?: string;
    textAlign?: 'left' | 'center' | 'right';
    padding?: number;
  };
}

// 图片组件
export interface ImageComponentData extends BaseComponent {
  type: 'image';
  props: {
    src: string;
    alt?: string;
    width?: string;
    height?: string;
    objectFit?: 'cover' | 'contain' | 'fill';
    borderRadius?: number;
  };
}

// 按钮链接类型
export type ButtonLinkType = 'none' | 'home' | 'page' | 'url' | 'article';

// 按钮图标位置
export type ButtonIconPosition = 'left' | 'right';

// 按钮对齐方式
export type ButtonAlign = 'left' | 'center' | 'right';

// 按钮宽度类型
export type ButtonWidthType = 'auto' | 'fixed' | 'full';

// 按钮组件
export interface ButtonComponentData extends BaseComponent {
  type: 'button';
  props: {
    // 基础配置
    text: string;
    icon?: string;                    // 图标名称
    iconPosition?: ButtonIconPosition; // 图标位置
    
    // 样式配置
    variant?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
    size?: 'small' | 'middle' | 'large';
    backgroundColor?: string;         // 自定义背景色
    textColor?: string;               // 自定义文字颜色
    borderColor?: string;             // 自定义边框颜色
    borderRadius?: number;            // 圆角大小
    shadow?: boolean;                 // 是否显示阴影
    
    // 布局配置
    align?: ButtonAlign;              // 对齐方式
    widthType?: ButtonWidthType;      // 宽度类型
    customWidth?: number;             // 固定宽度值(px)
    padding?: number;                 // 内边距
    
    // 链接配置
    linkType?: ButtonLinkType;
    linkValue?: string;
    openInNewTab?: boolean;           // 新窗口打开
  };
}

// 容器组件
export interface ContainerComponentData extends BaseComponent {
  type: 'container';
  props: {
    backgroundColor?: string;
    padding?: number;
    maxWidth?: number;
    layout?: 'vertical' | 'horizontal' | 'grid';  // 新增 grid 布局
    columns?: number;  // 网格列数，默认 1
    gap?: number;
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';  // 垂直对齐
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';  // 水平对齐
    children?: (BaseComponent & { span?: number })[];  // 子组件可配置占据列数
  };
}

// 表单组件
export interface FormComponentData extends BaseComponent {
  type: 'form';
  props: {
    title?: string;
    fields: Array<{
      name: string;
      label: string;
      type: 'text' | 'email' | 'textarea' | 'phone';
      required?: boolean;
    }>;
    submitText?: string;
  };
}

// 卡片列表组件
export interface CardsComponentData extends BaseComponent {
  type: 'cards';
  props: {
    columns?: number;
    items: Array<{
      title: string;
      description?: string;
      image?: string;
      link?: string;
    }>;
  };
}

// 分割线组件
export interface DividerComponentData extends BaseComponent {
  type: 'divider';
  props: {
    style?: 'solid' | 'dashed' | 'dotted';
    color?: string;
    margin?: number;
  };
}

// 文章列表组件
export interface ArticlesComponentData extends BaseComponent {
  type: 'articles';
  props: {
    categoryId?: number;      // 指定分类 ID
    tagId?: string | number;  // 指定标签 ID
    limit?: number;           // 显示数量，默认 10
    showPagination?: boolean; // 是否显示分页
    displayMode?: 'list' | 'grid'; // 显示模式：列表/网格
    showTitle?: boolean;      // 显示标题区域
    sectionTitle?: string;    // 自定义标题
  };
}

// 联合类型
export type PageComponent = 
  | HeroComponentData
  | TextComponentData
  | ImageComponentData
  | ButtonComponentData
  | ContainerComponentData
  | FormComponentData
  | CardsComponentData
  | DividerComponentData
  | ArticlesComponentData;

// 组件面板配置
export interface ComponentPanelItem {
  type: ComponentType;
  label: string;
  icon: string;
  defaultProps: Record<string, any>;
}

// 组件面板列表
export const COMPONENT_LIST: ComponentPanelItem[] = [
  {
    type: 'hero',
    label: '横幅大图',
    icon: 'PictureOutlined',
    defaultProps: {
      title: '企业品牌标语',
      subtitle: '这里是副标题描述文字',
      backgroundColor: '#1677ff',
      height: 400,
      textAlign: 'center',
      backgroundFit: 'cover',
      backgroundPosition: 'center',
    },
  },
  {
    type: 'text',
    label: '文本块',
    icon: 'FontSizeOutlined',
    defaultProps: {
      content: '在此输入文本内容...',
      fontSize: 16,
      fontWeight: 'normal',
      textAlign: 'left',
      padding: 16,
    },
  },
  {
    type: 'image',
    label: '图片',
    icon: 'FileImageOutlined',
    defaultProps: {
      src: '',
      alt: '图片描述',
      width: '100%',
      objectFit: 'cover',
      borderRadius: 8,
    },
  },
  {
    type: 'button',
    label: '按钮',
    icon: 'BorderOutlined',
    defaultProps: {
      // 基础配置
      text: '点击按钮',
      icon: '',
      iconPosition: 'left',
      // 样式配置
      variant: 'primary',
      size: 'middle',
      backgroundColor: '',
      textColor: '',
      borderColor: '',
      borderRadius: 6,
      shadow: false,
      // 布局配置
      align: 'center',
      widthType: 'auto',
      customWidth: 120,
      padding: 16,
      // 链接配置
      linkType: 'none',
      linkValue: '',
      openInNewTab: false,
    },
  },
  {
    type: 'container',
    label: '容器',
    icon: 'AppstoreOutlined',
    defaultProps: {
      backgroundColor: '#ffffff',
      padding: 24,
      layout: 'horizontal',
      columns: 3,
      gap: 16,
      alignItems: 'stretch',
      justifyContent: 'flex-start',
    },
  },
  {
    type: 'form',
    label: '留言表单',
    icon: 'FormOutlined',
    defaultProps: {
      title: '联系我们',
      fields: [
        { name: 'name', label: '姓名', type: 'text', required: true },
        { name: 'email', label: '邮箱', type: 'email', required: true },
        { name: 'message', label: '留言内容', type: 'textarea', required: true },
      ],
      submitText: '提交留言',
    },
  },
  {
    type: 'cards',
    label: '卡片列表',
    icon: 'IdcardOutlined',
    defaultProps: {
      columns: 3,
      items: [
        { title: '服务一', description: '服务描述' },
        { title: '服务二', description: '服务描述' },
        { title: '服务三', description: '服务描述' },
      ],
    },
  },
  {
    type: 'divider',
    label: '分割线',
    icon: 'LineOutlined',
    defaultProps: {
      style: 'solid',
      color: '#e8e8e8',
      margin: 24,
    },
  },
  {
    type: 'articles',
    label: '文章列表',
    icon: 'FileOutlined',
    defaultProps: {
      limit: 10,
      showPagination: true,
      displayMode: 'list',
      showTitle: false,
      sectionTitle: '最新文章',
    },
  },
];
