import { registerComponent } from './registry';
const TEXT_META = {
    type: 'Text',
    label: '文本',
    icon: 'type',
    category: 'basic',
    isContainer: false,
    defaultProps: {
        content: '点击编辑文本',
        tag: 'p',
    },
    defaultStyles: {
        base: {
            fontSize: '16px',
            color: '#1a1a1a',
            lineHeight: '1.6',
            padding: '4px',
        },
    },
    propsSchema: {
        content: { type: 'string', label: '文本内容', control: 'textarea' },
        tag: {
            type: 'enum',
            label: '标签',
            control: 'select',
            options: [
                { label: '段落 (p)', value: 'p' },
                { label: '一级标题 (h1)', value: 'h1' },
                { label: '二级标题 (h2)', value: 'h2' },
                { label: '三级标题 (h3)', value: 'h3' },
                { label: '四级标题 (h4)', value: 'h4' },
                { label: 'span', value: 'span' },
            ],
        },
    },
};
const BUTTON_META = {
    type: 'Button',
    label: '按钮',
    icon: 'square',
    category: 'basic',
    isContainer: false,
    defaultProps: {
        text: '按钮',
        variant: 'primary',
        disabled: false,
    },
    defaultStyles: {
        base: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 24px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
        },
    },
    propsSchema: {
        text: { type: 'string', label: '文字', control: 'input' },
        variant: {
            type: 'enum',
            label: '样式',
            control: 'select',
            options: [
                { label: '主要', value: 'primary' },
                { label: '次要', value: 'secondary' },
                { label: '危险', value: 'danger' },
                { label: '幽灵', value: 'ghost' },
            ],
        },
        disabled: { type: 'boolean', label: '禁用', control: 'switch' },
        onClick: { type: 'event', label: '点击事件', control: 'event' },
    },
};
const IMAGE_META = {
    type: 'Image',
    label: '图片',
    icon: 'image',
    category: 'media',
    isContainer: false,
    defaultProps: {
        src: '',
        alt: '图片',
        objectFit: 'cover',
    },
    defaultStyles: {
        base: {
            width: '100%',
            height: '200px',
            display: 'block',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        },
    },
    propsSchema: {
        src: { type: 'image', label: '图片地址', control: 'image' },
        alt: { type: 'string', label: '替代文字', control: 'input' },
        objectFit: {
            type: 'enum',
            label: '填充方式',
            control: 'select',
            options: [
                { label: '覆盖', value: 'cover' },
                { label: '包含', value: 'contain' },
                { label: '填充', value: 'fill' },
                { label: '原始', value: 'none' },
            ],
        },
    },
};
const CONTAINER_META = {
    type: 'Container',
    label: '容器',
    icon: 'layout',
    category: 'layout',
    isContainer: true,
    defaultProps: {
        direction: 'vertical',
    },
    defaultStyles: {
        base: {
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '20px',
            minHeight: '80px',
            width: '100%',
            borderRadius: '12px',
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
        },
    },
    propsSchema: {
        direction: {
            type: 'enum',
            label: '排列方向',
            control: 'select',
            options: [
                { label: '纵向', value: 'vertical' },
                { label: '横向', value: 'horizontal' },
            ],
        },
    },
};
const DIVIDER_META = {
    type: 'Divider',
    label: '分割线',
    icon: 'minus',
    category: 'basic',
    isContainer: false,
    defaultProps: {
        orientation: 'horizontal',
    },
    defaultStyles: {
        base: {
            width: '100%',
            borderTop: '1px solid #e5e7eb',
            margin: '12px 0',
        },
    },
    propsSchema: {
        orientation: {
            type: 'enum',
            label: '方向',
            control: 'select',
            options: [
                { label: '水平', value: 'horizontal' },
                { label: '垂直', value: 'vertical' },
            ],
        },
    },
};
// ─── 基础 ───────────────────────────────────────────────────────────────────
const HEADING_META = {
    type: 'Heading',
    label: '标题',
    icon: 'hash',
    category: 'basic',
    isContainer: false,
    defaultProps: { content: '这是一个标题', level: 'h2' },
    defaultStyles: {
        base: { fontWeight: '700', lineHeight: '1.4', color: '#1a1a1a', padding: '8px 0', letterSpacing: '-0.5px' },
    },
    propsSchema: {
        content: { type: 'string', label: '标题内容', control: 'input' },
        level: {
            type: 'enum', label: '级别', control: 'select',
            options: [
                { label: 'H1 一级', value: 'h1' },
                { label: 'H2 二级', value: 'h2' },
                { label: 'H3 三级', value: 'h3' },
                { label: 'H4 四级', value: 'h4' },
            ],
        },
    },
};
const BADGE_META = {
    type: 'Badge',
    label: '徽章',
    icon: 'tag',
    category: 'basic',
    isContainer: false,
    defaultProps: { text: '新功能' },
    defaultStyles: {
        base: {
            display: 'inline-block',
            padding: '2px 10px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: '500',
            background: '#ede9fe',
            color: '#7c6af5',
        },
    },
    propsSchema: {
        text: { type: 'string', label: '文字', control: 'input' },
    },
};
const LINK_META = {
    type: 'Link',
    label: '链接',
    icon: 'link',
    category: 'basic',
    isContainer: false,
    defaultProps: { text: '点击跳转', href: '#', target: '_self' },
    defaultStyles: {
        base: {
            color: '#7c6af5',
            textDecoration: 'underline',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'inline-block',
        },
    },
    propsSchema: {
        text: { type: 'string', label: '链接文字', control: 'input' },
        href: { type: 'string', label: '跳转地址', control: 'input' },
        target: {
            type: 'enum', label: '打开方式', control: 'select',
            options: [
                { label: '当前页', value: '_self' },
                { label: '新标签', value: '_blank' },
            ],
        },
    },
};
const SPACER_META = {
    type: 'Spacer',
    label: '间距块',
    icon: 'spacer',
    category: 'basic',
    isContainer: false,
    defaultProps: {},
    defaultStyles: { base: { height: '32px', width: '100%', display: 'block' } },
    propsSchema: {},
};
// ─── 布局 ───────────────────────────────────────────────────────────────────
const SECTION_META = {
    type: 'Section',
    label: '区块',
    icon: 'section',
    category: 'layout',
    isContainer: true,
    defaultProps: {},
    defaultStyles: {
        base: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            padding: '48px 24px',
            width: '100%',
        },
    },
    propsSchema: {},
};
const CARD_META = {
    type: 'Card',
    label: '卡片',
    icon: 'card',
    category: 'layout',
    isContainer: true,
    defaultProps: {},
    defaultStyles: {
        base: {
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            background: '#ffffff',
        },
    },
    propsSchema: {},
};
const COLUMNS_META = {
    type: 'Columns',
    label: '多列',
    icon: 'columns',
    category: 'layout',
    isContainer: true,
    defaultProps: { columns: '3' },
    defaultStyles: {
        base: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            width: '100%',
        },
    },
    propsSchema: {
        columns: {
            type: 'enum', label: '列数', control: 'select',
            options: [
                { label: '2列', value: '2' },
                { label: '3列', value: '3' },
                { label: '4列', value: '4' },
            ],
        },
    },
};
/** 自由层：子组件可设置 position:absolute 后自由重叠 */
const ABSOLUTE_BOX_META = {
    type: 'AbsoluteBox',
    label: '自由层',
    icon: 'layers',
    category: 'layout',
    isContainer: true,
    defaultProps: {},
    defaultStyles: {
        base: {
            position: 'relative',
            width: '100%',
            height: '400px',
            overflow: 'hidden',
            background: '#f9fafb',
            border: '1px dashed #d1d5db',
            borderRadius: '8px',
        },
    },
    propsSchema: {},
};
// ─── 表单 ───────────────────────────────────────────────────────────────────
const INPUT_FIELD_META = {
    type: 'InputField',
    label: '输入框',
    icon: 'input',
    category: 'form',
    isContainer: false,
    defaultProps: { label: '姓名', placeholder: '请输入...', inputType: 'text' },
    defaultStyles: {
        base: {
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            width: '100%',
        },
    },
    propsSchema: {
        label: { type: 'string', label: '字段标签', control: 'input' },
        placeholder: { type: 'string', label: '占位文字', control: 'input' },
        inputType: {
            type: 'enum', label: '输入类型', control: 'select',
            options: [
                { label: '文本', value: 'text' },
                { label: '邮箱', value: 'email' },
                { label: '密码', value: 'password' },
                { label: '数字', value: 'number' },
                { label: '电话', value: 'tel' },
            ],
        },
    },
};
const TEXTAREA_FIELD_META = {
    type: 'TextareaField',
    label: '多行输入',
    icon: 'textarea',
    category: 'form',
    isContainer: false,
    defaultProps: { label: '留言', placeholder: '请输入内容...', rows: 4 },
    defaultStyles: {
        base: { display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' },
    },
    propsSchema: {
        label: { type: 'string', label: '字段标签', control: 'input' },
        placeholder: { type: 'string', label: '占位文字', control: 'input' },
        rows: { type: 'number', label: '行数', control: 'number' },
    },
};
const CHECKBOX_META = {
    type: 'Checkbox',
    label: '复选框',
    icon: 'check',
    category: 'form',
    isContainer: false,
    defaultProps: { label: '我同意服务条款', checked: false },
    defaultStyles: {
        base: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            cursor: 'pointer',
        },
    },
    propsSchema: {
        label: { type: 'string', label: '标签文字', control: 'input' },
        checked: { type: 'boolean', label: '默认选中', control: 'switch' },
    },
};
const SELECT_FIELD_META = {
    type: 'SelectField',
    label: '下拉选择',
    icon: 'select',
    category: 'form',
    isContainer: false,
    defaultProps: { label: '城市', placeholder: '请选择', options: '北京,上海,广州,深圳' },
    defaultStyles: {
        base: { display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' },
    },
    propsSchema: {
        label: { type: 'string', label: '字段标签', control: 'input' },
        placeholder: { type: 'string', label: '占位文字', control: 'input' },
        options: { type: 'string', label: '选项（逗号分隔）', control: 'input' },
    },
};
// ─── 媒体 ───────────────────────────────────────────────────────────────────
const VIDEO_META = {
    type: 'Video',
    label: '视频',
    icon: 'video',
    category: 'media',
    isContainer: false,
    defaultProps: { src: '', poster: '' },
    defaultStyles: {
        base: {
            display: 'block',
            width: '100%',
            height: '300px',
            borderRadius: '8px',
            background: '#111827',
        },
    },
    propsSchema: {
        src: { type: 'string', label: '视频地址 (URL)', control: 'input' },
        poster: { type: 'string', label: '封面图 (URL)', control: 'input' },
    },
};
// ─── 导航布局组件 ────────────────────────────────────────────────────────────
const HEADER_META = {
    type: 'Header',
    label: '页面头部',
    icon: 'layout',
    category: 'layout',
    isContainer: true,
    defaultProps: {},
    defaultStyles: {
        base: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e5e7eb',
            position: 'sticky',
            top: '0',
            zIndex: '1000',
        },
    },
    propsSchema: {},
};
const NAV_META = {
    type: 'Nav',
    label: '导航栏',
    icon: 'menu',
    category: 'layout',
    isContainer: true,
    defaultProps: {
        orientation: 'horizontal',
    },
    defaultStyles: {
        base: {
            display: 'flex',
            gap: '24px',
            alignItems: 'center',
        },
    },
    propsSchema: {
        orientation: {
            type: 'enum',
            label: '方向',
            control: 'select',
            options: [
                { label: '水平', value: 'horizontal' },
                { label: '垂直', value: 'vertical' },
            ],
        },
    },
};
const FOOTER_META = {
    type: 'Footer',
    label: '页脚',
    icon: 'layout',
    category: 'layout',
    isContainer: true,
    defaultProps: {},
    defaultStyles: {
        base: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            padding: '32px 24px',
            backgroundColor: '#1f2937',
            color: '#d1d5db',
            marginTop: 'auto',
        },
    },
    propsSchema: {},
};
const HERO_META = {
    type: 'Hero',
    label: '英雄区块',
    icon: 'image',
    category: 'layout',
    isContainer: true,
    defaultProps: {},
    defaultStyles: {
        base: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            padding: '48px 24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#ffffff',
            textAlign: 'center',
        },
    },
    propsSchema: {},
};
const GRID_META = {
    type: 'Grid',
    label: '网格布局',
    icon: 'grid',
    category: 'layout',
    isContainer: true,
    defaultProps: {
        columns: '3',
        gap: '16px',
    },
    defaultStyles: {
        base: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
        },
    },
    propsSchema: {
        columns: {
            type: 'enum',
            label: '列数',
            control: 'select',
            options: [
                { label: '1列', value: '1' },
                { label: '2列', value: '2' },
                { label: '3列', value: '3' },
                { label: '4列', value: '4' },
                { label: '6列', value: '6' },
                { label: '12列', value: '12' },
            ],
        },
        gap: { type: 'string', label: '间距', control: 'input' },
    },
};
const FLEX_META = {
    type: 'Flex',
    label: '弹性布局',
    icon: 'layout',
    category: 'layout',
    isContainer: true,
    defaultProps: {
        direction: 'row',
        justify: 'flex-start',
        align: 'flex-start',
        gap: '8px',
    },
    defaultStyles: {
        base: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '8px',
        },
    },
    propsSchema: {
        direction: {
            type: 'enum',
            label: '方向',
            control: 'select',
            options: [
                { label: '横向', value: 'row' },
                { label: '纵向', value: 'column' },
            ],
        },
        justify: {
            type: 'enum',
            label: '主轴对齐',
            control: 'select',
            options: [
                { label: '起始', value: 'flex-start' },
                { label: '居中', value: 'center' },
                { label: '末尾', value: 'flex-end' },
                { label: '两端对齐', value: 'space-between' },
                { label: '均匀分布', value: 'space-around' },
            ],
        },
        align: {
            type: 'enum',
            label: '交叉轴对齐',
            control: 'select',
            options: [
                { label: '起始', value: 'flex-start' },
                { label: '居中', value: 'center' },
                { label: '末尾', value: 'flex-end' },
                { label: '拉伸', value: 'stretch' },
            ],
        },
        gap: { type: 'string', label: '间距', control: 'input' },
    },
};
const ALERT_META = {
    type: 'Alert',
    label: '提示框',
    icon: 'info',
    category: 'basic',
    isContainer: true,
    defaultProps: {
        variant: 'info',
        title: '提示',
    },
    defaultStyles: {
        base: {
            display: 'flex',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid',
            gap: '12px',
        },
    },
    propsSchema: {
        variant: {
            type: 'enum',
            label: '类型',
            control: 'select',
            options: [
                { label: '信息', value: 'info' },
                { label: '成功', value: 'success' },
                { label: '警告', value: 'warning' },
                { label: '错误', value: 'error' },
            ],
        },
        title: { type: 'string', label: '标题', control: 'input' },
    },
};
const AVATAR_META = {
    type: 'Avatar',
    label: '头像',
    icon: 'user',
    category: 'basic',
    isContainer: false,
    defaultProps: {
        src: '',
        alt: 'Avatar',
        size: 'md',
        fallback: 'U',
    },
    defaultStyles: {
        base: {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            objectFit: 'cover',
        },
    },
    propsSchema: {
        src: { type: 'string', label: '图片地址', control: 'input' },
        alt: { type: 'string', label: '替代文本', control: 'input' },
        size: {
            type: 'enum',
            label: '尺寸',
            control: 'select',
            options: [
                { label: '小', value: 'sm' },
                { label: '中', value: 'md' },
                { label: '大', value: 'lg' },
                { label: '超大', value: 'xl' },
            ],
        },
        fallback: { type: 'string', label: '占位文字', control: 'input' },
    },
};
const MENU_ITEM_META = {
    type: 'MenuItem',
    label: '菜单项',
    icon: 'link',
    category: 'layout',
    isContainer: false,
    defaultProps: {
        text: '菜单项',
        href: '#',
    },
    defaultStyles: {
        base: {
            display: 'inline-flex',
            alignItems: 'center',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '14px',
            color: 'var(--text)',
            textDecoration: 'none',
            borderRadius: '8px',
            transition: 'background-color 0.2s ease',
        },
    },
    propsSchema: {
        text: { type: 'string', label: '菜单文字', control: 'input' },
        href: { type: 'string', label: '链接地址', control: 'input' },
        onClick: { type: 'event', label: '点击事件', control: 'event' },
    },
};
const DROPDOWN_META = {
    type: 'Dropdown',
    label: '下拉菜单',
    icon: 'chevron-down',
    category: 'layout',
    isContainer: true,
    defaultProps: {
        label: '菜单',
        trigger: 'click',
    },
    defaultStyles: {
        base: {
            display: 'inline-flex',
            position: 'relative',
            alignItems: 'center',
        },
    },
    propsSchema: {
        label: { type: 'string', label: '菜单标签', control: 'input' },
        trigger: {
            type: 'enum',
            label: '触发方式',
            control: 'select',
            options: [
                { label: '点击', value: 'click' },
                { label: '悬停', value: 'hover' },
            ],
        },
    },
};
const CAROUSEL_META = {
    type: 'Carousel',
    label: '轮播',
    icon: 'image',
    category: 'advanced',
    isContainer: true,
    defaultProps: {
        autoPlay: true,
        interval: 3000,
        showDots: true,
        showArrows: true,
        duration: 500,
    },
    defaultStyles: {
        base: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '400px',
            backgroundColor: '#000',
            borderRadius: '8px',
            overflow: 'hidden',
            position: 'relative',
        },
    },
    propsSchema: {
        autoPlay: { type: 'boolean', label: '自动播放', control: 'switch' },
        interval: { type: 'number', label: '切换间隔 (ms)', control: 'number' },
        showDots: { type: 'boolean', label: '显示点号', control: 'switch' },
        showArrows: { type: 'boolean', label: '显示箭头', control: 'switch' },
        duration: { type: 'number', label: '动画时长 (ms)', control: 'number' },
    },
};
const CAROUSEL_ITEM_META = {
    type: 'CarouselItem',
    label: '轮播项',
    icon: 'image',
    category: 'advanced',
    isContainer: true,
    defaultProps: {},
    defaultStyles: {
        base: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            flexShrink: 0,
        },
    },
    propsSchema: {},
};
const FLOATING_BUTTON_META = {
    type: 'FloatingButton',
    label: '浮动按钮',
    icon: 'circle',
    category: 'advanced',
    isContainer: false,
    defaultProps: {
        position: 'bottom-right',
        text: '按钮',
        icon: '●',
        size: 'lg',
    },
    defaultStyles: {
        base: {
            position: 'fixed',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backgroundColor: 'var(--primary, #7c6af5)',
            color: '#fff',
            fontSize: '24px',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: 'none',
            zIndex: '999',
            transition: 'all 0.3s ease',
        },
    },
    propsSchema: {
        position: {
            type: 'enum',
            label: '位置',
            control: 'select',
            options: [
                { label: '右下角', value: 'bottom-right' },
                { label: '左下角', value: 'bottom-left' },
                { label: '右上角', value: 'top-right' },
                { label: '左上角', value: 'top-left' },
            ],
        },
        text: { type: 'string', label: '按钮文文本', control: 'input' },
        icon: { type: 'string', label: '图标/emoji', control: 'input' },
        size: {
            type: 'enum',
            label: '尺寸',
            control: 'select',
            options: [
                { label: '小', value: 'sm' },
                { label: '中', value: 'md' },
                { label: '大', value: 'lg' },
            ],
        },
        onClick: { type: 'event', label: '点击事件', control: 'event' },
    },
};
const TABS_META = {
    type: 'Tabs',
    label: '选项卡',
    icon: 'tabs',
    category: 'advanced',
    isContainer: true,
    defaultProps: {
        tabs: 'Tab 1,Tab 2,Tab 3',
        activeIndex: '0',
    },
    defaultStyles: {
        base: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
        },
    },
    propsSchema: {
        tabs: { type: 'string', label: '标签列表（逗号分隔）', control: 'input' },
        activeIndex: { type: 'string', label: '默认激活索引', control: 'input' },
    },
};
// ─── 注册 ────────────────────────────────────────────────────────────────────
export function registerBuiltinComponents() {
    // 基础
    registerComponent(TEXT_META);
    registerComponent(HEADING_META);
    registerComponent(BUTTON_META);
    registerComponent(BADGE_META);
    registerComponent(LINK_META);
    registerComponent(DIVIDER_META);
    registerComponent(SPACER_META);
    registerComponent(ALERT_META);
    registerComponent(AVATAR_META);
    // 布局
    registerComponent(CONTAINER_META);
    registerComponent(SECTION_META);
    registerComponent(CARD_META);
    registerComponent(COLUMNS_META);
    registerComponent(ABSOLUTE_BOX_META);
    registerComponent(HEADER_META);
    registerComponent(NAV_META);
    registerComponent(MENU_ITEM_META);
    registerComponent(DROPDOWN_META);
    registerComponent(FOOTER_META);
    registerComponent(HERO_META);
    registerComponent(GRID_META);
    registerComponent(FLEX_META);
    // 表单
    registerComponent(INPUT_FIELD_META);
    registerComponent(TEXTAREA_FIELD_META);
    registerComponent(CHECKBOX_META);
    registerComponent(SELECT_FIELD_META);
    // 媒体
    registerComponent(IMAGE_META);
    registerComponent(VIDEO_META);
    // 高级
    registerComponent(CAROUSEL_META);
    registerComponent(CAROUSEL_ITEM_META);
    registerComponent(FLOATING_BUTTON_META);
    registerComponent(TABS_META);
}
//# sourceMappingURL=builtinComponents.js.map