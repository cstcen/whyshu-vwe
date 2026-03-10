import type { ComponentNode, PageSchema } from '@/types'
import { nanoid } from '@/utils/nanoid'

export interface TemplatePackPage {
  url: string
  title: string
  schema: PageSchema
}

export interface TemplatePack {
  source: string
  depth: number
  fetchedAt: string
  pages: TemplatePackPage[]
}

const TEXT_TAGS = new Set(['p', 'span', 'strong', 'em', 'small', 'label'])
const SKIP_TAGS = new Set(['script', 'style', 'noscript', 'svg'])

function toAbsUrl(raw: string | null, base: string): string {
  if (!raw) return ''
  try {
    return new URL(raw, base).href
  } catch {
    return raw
  }
}

function pickStyles(el: HTMLElement): ComponentNode['styles'] {
  const s = el.style
  const base: Record<string, string> = {}
  const keys = [
    'display',
    'width',
    'height',
    'minHeight',
    'maxWidth',
    'padding',
    'margin',
    'gap',
    'background',
    'backgroundColor',
    'color',
    'border',
    'borderRadius',
    'boxShadow',
    'fontSize',
    'fontWeight',
    'lineHeight',
    'textAlign',
    'position',
    'top',
    'left',
    'right',
    'bottom',
    'zIndex',
    'gridTemplateColumns',
    'gridTemplateRows',
    'flexDirection',
    'justifyContent',
    'alignItems',
  ] as const

  for (const k of keys) {
    const v = s.getPropertyValue(k)
    if (typeof v === 'string' && v.trim()) base[k] = v
  }

  return Object.keys(base).length ? { base } : { base: {} }
}

function textNode(content: string): ComponentNode {
  return {
    id: nanoid(),
    type: 'Text',
    props: { content, tag: 'p' },
    styles: { base: {} },
    events: [],
  }
}

function convertElement(el: Element, baseUrl: string): ComponentNode | null {
  const tag = el.tagName.toLowerCase()
  if (SKIP_TAGS.has(tag)) return null

  const htmlEl = el as HTMLElement
  const styles = pickStyles(htmlEl)

  if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4') {
    const content = (el.textContent || '').trim()
    if (!content) return null
    return {
      id: nanoid(),
      type: 'Heading',
      props: { content, level: tag },
      styles,
      events: [],
    }
  }

  if (TEXT_TAGS.has(tag)) {
    const content = (el.textContent || '').trim()
    if (!content) return null
    return {
      id: nanoid(),
      type: 'Text',
      props: { content, tag: 'p' },
      styles,
      events: [],
    }
  }

  if (tag === 'a') {
    const content = (el.textContent || '').trim() || '链接'
    return {
      id: nanoid(),
      type: 'Link',
      props: {
        text: content,
        href: toAbsUrl(el.getAttribute('href'), baseUrl) || '#',
        target: el.getAttribute('target') || '_self',
      },
      styles,
      events: [],
    }
  }

  if (tag === 'img') {
    const src = toAbsUrl(el.getAttribute('src'), baseUrl)
    return {
      id: nanoid(),
      type: 'Image',
      props: {
        src,
        alt: el.getAttribute('alt') || '图片',
        objectFit: 'cover',
      },
      styles,
      events: [],
    }
  }

  if (tag === 'video') {
    return {
      id: nanoid(),
      type: 'Video',
      props: {
        src: toAbsUrl(el.getAttribute('src'), baseUrl),
        poster: toAbsUrl(el.getAttribute('poster'), baseUrl),
      },
      styles,
      events: [],
    }
  }

  if (tag === 'button') {
    return {
      id: nanoid(),
      type: 'Button',
      props: {
        text: (el.textContent || '').trim() || '按钮',
        variant: 'primary',
        disabled: (el as HTMLButtonElement).disabled,
        onClick: '',
      },
      styles,
      events: [],
    }
  }

  if (tag === 'hr') {
    return {
      id: nanoid(),
      type: 'Divider',
      props: { orientation: 'horizontal' },
      styles,
      events: [],
    }
  }

  let type: ComponentNode['type'] = 'Container'
  if (tag === 'header') type = 'Header'
  else if (tag === 'nav') type = 'Nav'
  else if (tag === 'footer') type = 'Footer'
  else if (tag === 'section') type = 'Section'

  const children: ComponentNode[] = []

  for (const child of Array.from(el.children)) {
    const c = convertElement(child, baseUrl)
    if (c) children.push(c)
  }

  if (children.length === 0) {
    const text = (el.textContent || '').trim()
    if (text) children.push(textNode(text))
  }

  return {
    id: nanoid(),
    type,
    props: type === 'Nav' ? { orientation: 'horizontal' } : {},
    styles,
    events: [],
    children,
  }
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { method: 'GET', mode: 'cors' })
  if (!res.ok) {
    throw new Error(`抓取失败: ${url} (${res.status})`)
  }
  return res.text()
}

function htmlToSchema(url: string, html: string): PageSchema {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const title = (doc.querySelector('title')?.textContent || '未命名页面').trim()

  const rootChildren: ComponentNode[] = []
  for (const el of Array.from(doc.body.children)) {
    const node = convertElement(el, url)
    if (node) rootChildren.push(node)
  }

  return {
    id: nanoid(),
    version: '1.0.0',
    meta: { title },
    activeBreakpoint: 'desktop',
    cssVars: {
      '--primary': '#7c6af5',
      '--bg': '#ffffff',
      '--text': '#1a1a1a',
    },
    root: {
      id: 'root',
      type: 'Root',
      props: {},
      styles: { base: { minHeight: '100vh', position: 'relative' } },
      events: [],
      children: rootChildren,
    },
  }
}

function collectSameOriginLinks(baseUrl: string, html: string): string[] {
  const base = new URL(baseUrl)
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const links = new Set<string>()

  for (const a of Array.from(doc.querySelectorAll('a[href]'))) {
    const href = a.getAttribute('href')
    if (!href) continue
    if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) continue

    try {
      const u = new URL(href, base.href)
      if (u.origin !== base.origin) continue
      if (u.pathname === base.pathname) continue
      u.hash = ''
      links.add(u.href)
    } catch {
      // ignore invalid links
    }
  }

  return Array.from(links)
}

export async function crawlWebsiteAsTemplatePack(entryUrl: string, depth = 1): Promise<TemplatePack> {
  const homeHtml = await fetchHtml(entryUrl)
  const pages: TemplatePackPage[] = [
    {
      url: entryUrl,
      title: new URL(entryUrl).pathname || '/',
      schema: htmlToSchema(entryUrl, homeHtml),
    },
  ]

  if (depth >= 1) {
    const links = collectSameOriginLinks(entryUrl, homeHtml).slice(0, 20)
    const results = await Promise.allSettled(
      links.map(async (url) => {
        const html = await fetchHtml(url)
        return {
          url,
          title: new URL(url).pathname || '/',
          schema: htmlToSchema(url, html),
        } satisfies TemplatePackPage
      })
    )

    for (const r of results) {
      if (r.status === 'fulfilled') pages.push(r.value)
    }
  }

  return {
    source: entryUrl,
    depth,
    fetchedAt: new Date().toISOString(),
    pages,
  }
}
