import { useEffect, useRef, useState } from 'react';
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
import { Paragraph } from '@/components/WriteFlow/extensions/paragraph';
import { HardBreak } from '@/components/WriteFlow/extensions/hard-break';
import { Blockquote } from '@/components/WriteFlow/extensions/blockquote';
import { CodeBlock, InlineCode } from '@/components/WriteFlow/extensions/code';

export const useWriteFlow = () => {
  const writeFlowDomRef = useRef(null);
  const [writeFlow, setWriteFlow] = useState<WriteFlow | null>(null);

  useEffect(() => {
    if (!writeFlowDomRef.current) return;

    const newWriteFlow = new WriteFlow({
      element: writeFlowDomRef.current!,
      attributes: {
        class: 'wf-light',
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
        HardBreak,
        Paragraph,
      ],
    });

    setWriteFlow(newWriteFlow);
  }, []);

  return { writeFlow, writeFlowDomRef };
};
