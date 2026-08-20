import { FC, ReactNode } from 'react';
// import { RichBubbleMenu } from './RichBubbleMenu';
import { useCreateWriteFlow, WriteFlowContext } from '@kunlunxu/wf-core';

import { Heading } from '@kunlunxu/wf-extension-heading';
import { TaskList, TaskItem, ListItem, BulletList, OrderedList } from '@kunlunxu/wf-extension-list';
import { Table, TableCell, TableHeader, TableRow } from '@kunlunxu/wf-extension-table';
import { Base } from '@kunlunxu/wf-extension-base';
import { Image } from '@kunlunxu/wf-extension-image';
import { HorizontalRule } from '@kunlunxu/wf-extension-horizontal-rule';
import { Paragraph } from '@kunlunxu/wf-extension-paragraph';
import { HardBreak } from '@kunlunxu/wf-extension-hard-break';
import { Blockquote } from '@kunlunxu/wf-extension-blockquote';
import { CodeBlock, InlineCode } from '@kunlunxu/wf-extension-code';
import { Link } from '@kunlunxu/wf-extension-link';
import { Markdown } from '@kunlunxu/wf-extension-markdown';
import {
  createMention,
  type MentionItem,
  type MentionSuggestionRenderProps,
} from '@kunlunxu/wf-extension-mention';

interface EditorProps {
  className?: string;
  children?: ReactNode;
  readOnly?: boolean;
}

const mentionItems: MentionItem[] = [
  { id: 'linheng', label: '林恒' },
  { id: 'writeflow', label: 'WriteFlow' },
  { id: 'tiptap', label: 'Tiptap' },
];

const MentionSuggestionMenu = ({
  items,
  selectedIndex,
  loading,
  select,
}: MentionSuggestionRenderProps) => {
  if (loading) {
    return <div className="p-3 text-sm text-default-500">加载中...</div>;
  }

  if (items.length === 0) {
    return <div className="p-3 text-sm text-default-500">没有匹配项</div>;
  }

  return (
    <div className="flex max-h-60 flex-col overflow-auto p-1">
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          className={`rounded px-3 py-2 text-left text-sm ${
            selectedIndex === index ? 'bg-primary text-white' : 'hover:bg-default-100'
          }`}
          onMouseDown={(event) => {
            event.preventDefault();
            select(item);
          }}
        >
          {item.label || item.id}
        </button>
      ))}
    </div>
  );
};

const MentionExtension = createMention({
  suggestions: [
    {
      char: '@',
      items: ({ query }) =>
        mentionItems.filter((item) => `${item.label}${item.id}`.toLowerCase().includes(query)),
      render: MentionSuggestionMenu,
    },
    {
      char: '#',
      items: [
        { id: 'product', label: '产品' },
        { id: 'design', label: '设计' },
        { id: 'engineering', label: '研发' },
      ],
      render: MentionSuggestionMenu,
    },
  ],
});

const extensions = [
  Base,
  HorizontalRule,
  Heading,
  Blockquote,
  ListItem,
  TaskList,
  TaskItem,
  BulletList,
  OrderedList,
  Table,
  TableRow,
  TableCell,
  TableHeader,
  CodeBlock,
  InlineCode,
  HardBreak,
  Paragraph,
  Image,
  Markdown,
  Link,
  MentionExtension,
];

export const Rich: FC<EditorProps> = (props: EditorProps) => {
  const { className, children, readOnly } = props;
  const { writeFlow, writeFlowDomRef } = useCreateWriteFlow({
    extensions,
    placeholder: '开始写点什么...',
    readOnly,
  });

  return (
    <WriteFlowContext.Provider value={writeFlow}>
      <div
        ref={writeFlowDomRef}
        className={className}
      />
      {/* <RichBubbleMenu /> */}
      {children}
    </WriteFlowContext.Provider>
  );
};
