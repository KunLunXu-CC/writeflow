import { useEffect, useRef } from 'react';
import { WriteFlow } from '@/components/WriteFlow/core/WriteFlow';
import { Heading } from '@/components/WriteFlow/extensions/heading';
import {
  TaskList,
  TaskItem,
  ListItem,
  BulletList,
  OrderedList,
} from '@/components/WriteFlow/extensions/list';
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/WriteFlow/extensions/table';
import { Blockquote } from '@/components/WriteFlow/extensions/blockquote';
import { CodeBlock, InlineCode } from '@/components/WriteFlow/extensions/code';

import '@/components/WriteFlow/theme';

export default function Editor() {
  const editorRef = useRef<WriteFlow>(null);
  const editorDom = useRef(null);

  useEffect(() => {
    if (editorRef.current) return;
    editorRef.current = new WriteFlow({
      element: editorDom.current!,
      extensions: [
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
      ],
    });
  }, []);

  return (
    <div
      ref={editorDom}
      className="w-[800px] h-[800px] markdown-preview-light [&_.ProseMirror]:outline-none [&_.ProseMirror]:bg-[#fafafa] [&_.ProseMirror]:min-h-[600px] [&_.ProseMirror]:p-1"
    />
  );
}
