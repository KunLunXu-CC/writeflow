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
import { Base } from '@/components/WriteFlow/extensions/base';
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
      attributes: {
        class: 'write-flow-light',
      },
      extensions: [
        Base,
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
      className="w-[600px] h-[600px] rounded-md [&_.ProseMirror]:outline-none shadow-2xl [&_.ProseMirror]:min-h-[600px] [&_.ProseMirror]:p-1"
    />
  );
}
