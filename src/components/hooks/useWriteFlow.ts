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
import { Table, TableCell, TableHeader, TableRow } from '@/components/WriteFlow/extensions/table';
import { Base } from '@/components/WriteFlow/extensions/base';
import { Image } from '@/components/WriteFlow/extensions/image';
import { HorizontalRule } from '@/components/WriteFlow/extensions/horizontal-rule';
import { Paragraph } from '@/components/WriteFlow/extensions/paragraph';
import { HardBreak } from '@/components/WriteFlow/extensions/hard-break';
import { Blockquote } from '@/components/WriteFlow/extensions/blockquote';
import { CodeBlock, InlineCode } from '@/components/WriteFlow/extensions/code';
import { WriteFlowValue } from '../WriteFlow/types';
import { Link } from '@/components/WriteFlow/extensions/link';
import { Markdown } from '@/components/WriteFlow/extensions/markdown';

Image.addOptions({
  upload: async (args) => {
    const { file } = args;

    // 模拟上传延迟
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 返回模拟的图片 URL
    return {
      alt: file.name,
      title: file.name,
      url: URL.createObjectURL(file),
    };
  },
});

const initValue = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: '1231',
        },
      ],
    },
    {
      type: 'table',
      content: [
        {
          type: 'table_row',
          content: [
            {
              type: 'table_cell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'name',
                    },
                  ],
                },
              ],
            },
            {
              type: 'table_cell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'user',
                    },
                  ],
                },
              ],
            },
            {
              type: 'table_cell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'title',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'table_row',
          content: [
            {
              type: 'table_cell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: 'bullet_list',
                  content: [
                    {
                      type: 'list_item',
                      content: [
                        {
                          type: 'paragraph',
                          content: [
                            {
                              type: 'text',
                              text: 'nams',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: 'list_item',
                      content: [
                        {
                          type: 'paragraph',
                          content: [
                            {
                              type: 'text',
                              text: 'uasd',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'table_cell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: '123',
                    },
                  ],
                },
              ],
            },
            {
              type: 'table_cell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
              },
              content: [
                {
                  type: 'paragraph',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
} as WriteFlowValue;

export const useWriteFlow = () => {
  const writeFlowDomRef = useRef(null);
  const [writeFlow, setWriteFlow] = useState<WriteFlow | null>(null);

  useEffect(() => {
    if (!writeFlowDomRef.current) return;

    const newWriteFlow = new WriteFlow({
      initValue,
      element: writeFlowDomRef.current!,
      extensions: [
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
      ],
    });

    setWriteFlow(newWriteFlow);
  }, []);

  return { writeFlow, writeFlowDomRef };
};
