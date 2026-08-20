import type { Node as PMNode } from 'prosemirror-model';
import type { PluginKey } from 'prosemirror-state';
import type { ComponentType } from 'react';
import type { WriteFlow } from '@kunlunxu/wf-core';

export interface MentionItem {
  id: string | number;
  label?: string;
  [key: string]: unknown;
}

export interface MentionRange {
  from: number;
  to: number;
}

export interface MentionSuggestionContext {
  query: string;
  char: string;
  writeFlow: WriteFlow;
  signal: AbortSignal;
}

export interface MentionCommandContext<Item extends MentionItem = MentionItem> {
  item: Item;
  id: string;
  label: string;
  char: string;
  range: MentionRange;
  query: string;
  writeFlow: WriteFlow;
}

export interface MentionClientRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface MentionSuggestionRenderProps<Item extends MentionItem = MentionItem> {
  items: readonly Item[];
  selectedIndex: number;
  query: string;
  char: string;
  loading: boolean;
  range: MentionRange;
  clientRect: () => MentionClientRect | null;
  select: (item: Item) => boolean;
}

export type MentionItems<Item extends MentionItem = MentionItem> =
  | Item[]
  | ((context: MentionSuggestionContext) => Item[] | Promise<Item[]>);

export interface MentionSuggestionOptions<Item extends MentionItem = MentionItem> {
  /** 唤起字符, 默认是 @ */
  char?: string;
  /** 根据输入内容返回候选项, 支持异步函数 */
  items?: MentionItems<Item>;
  /** 用于渲染候选项面板的 React 组件 */
  render?: ComponentType<MentionSuggestionRenderProps<Item>>;
  /** 选中候选项后的自定义插入逻辑 */
  command?: (context: MentionCommandContext<Item>) => boolean;
  /** 是否允许候选查询中包含空格 */
  allowSpaces?: boolean;
  /** 是否允许候选查询中包含唤起字符 */
  allowToIncludeChar?: boolean;
  /** 唤起字符前允许出现的字符, 传 null 表示不限制 */
  allowedPrefixes?: string[] | null;
  /** 查询长度达到该值后才调用 items, 默认是 0 */
  minQueryLength?: number;
  /** 候选面板挂载容器, 默认是 document.body */
  container?: HTMLElement | string;
}

export interface MentionOptions<Item extends MentionItem = MentionItem> {
  HTMLAttributes?: Record<string, string | number | boolean | null | undefined>;
  suggestions?: MentionSuggestionOptions<Item>[];
  suggestion?: MentionSuggestionOptions<Item>;
  pluginKey?: PluginKey | string;
  /** 自定义 Mention 节点在文档中的文本表现 */
  renderText?: (context: { node: PMNode; char: string }) => string;
}
