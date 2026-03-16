import { FC, ReactNode } from 'react';
// import { RichBubbleMenu } from './RichBubbleMenu';
import { useCreateWriteFlow, WriteFlowContext } from '@kunlunxu/wf-react';

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

interface EditorProps {
  className?: string;
  children?: ReactNode;
}

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
];

export const Rich: FC<EditorProps> = (props: EditorProps) => {
  const { className, children } = props;
  const { writeFlow, writeFlowDomRef } = useCreateWriteFlow({
    extensions,
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
