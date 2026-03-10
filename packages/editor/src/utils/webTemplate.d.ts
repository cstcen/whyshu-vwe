import type { PageSchema } from '@/types';
export interface TemplatePackPage {
    url: string;
    title: string;
    schema: PageSchema;
}
export interface TemplatePack {
    source: string;
    depth: number;
    fetchedAt: string;
    pages: TemplatePackPage[];
}
export declare function crawlWebsiteAsTemplatePack(entryUrl: string, depth?: number): Promise<TemplatePack>;
//# sourceMappingURL=webTemplate.d.ts.map