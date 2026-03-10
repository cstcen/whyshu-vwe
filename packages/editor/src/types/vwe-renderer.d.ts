declare module '@vwe/renderer' {
  import type { JSX } from 'react'
  import type { PageSchema } from '@/types/schema'

  export interface PageRendererProps {
    schema: PageSchema
    breakpoint?: 'mobile' | 'tablet' | 'desktop'
  }

  export function PageRenderer(props: PageRendererProps): JSX.Element
}
