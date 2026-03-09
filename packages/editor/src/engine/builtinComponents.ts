import { registerComponent } from './registry'
import type { ComponentMeta } from '@/types'

const TEXT_META: ComponentMeta = {
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
}

const BUTTON_META: ComponentMeta = {
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
      padding: '8px 16px',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
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
}

const IMAGE_META: ComponentMeta = {
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
}

const CONTAINER_META: ComponentMeta = {
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
      gap: '8px',
      padding: '16px',
      minHeight: '80px',
      width: '100%',
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
}

const DIVIDER_META: ComponentMeta = {
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
      margin: '8px 0',
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
}

// 注册所有内置组件
export function registerBuiltinComponents() {
  registerComponent(TEXT_META)
  registerComponent(BUTTON_META)
  registerComponent(IMAGE_META)
  registerComponent(CONTAINER_META)
  registerComponent(DIVIDER_META)
}
