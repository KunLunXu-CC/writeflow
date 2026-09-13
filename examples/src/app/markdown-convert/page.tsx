'use client';

import { useEffect, useRef } from 'react';
import { useWriteFlowContext } from '@kunlunxu/wf-core';
import { markdownToWriteFlowValue } from '@kunlunxu/wf-extension-markdown/core';
import { Rich } from '../Rich';

const defaultMarkdown = [
  '```js',
  '// 使用 Set 数组去重',
  'function unique(arr) {',
  '  return [...new Set(arr)];',
  '}',
  '',
  'const arr = [1, 2, 2, 3, 3, 4];',
  'console.log(unique(arr)); // [1, 2, 3, 4]',
  '```',
  '',
  '时间复杂度：`O(n)`，空间复杂度：`O(n)`。',
].join('\n');
const initialValue = markdownToWriteFlowValue({ markdownText: defaultMarkdown });

const MarkdownInitDiagnostics = () => {
  const writeFlow = useWriteFlowContext();
  const initialized = useRef(false);

  useEffect(() => {
    if (!writeFlow || initialized.current) {
      return;
    }

    initialized.current = true;
    const doc = writeFlow.schema.nodeFromJSON(initialValue);
    const getCodeBlocks = (target: typeof doc) => {
      const codeBlocks: Array<{
        position: number;
        language: string | null;
        text: string;
        endsWithNewline: boolean;
      }> = [];

      target.descendants((node, position) => {
        if (node.type.name === 'code_block') {
          codeBlocks.push({
            position,
            language: node.attrs.language,
            text: JSON.stringify(node.textContent),
            endsWithNewline: node.textContent.endsWith('\n'),
          });
        }
      });

      return codeBlocks;
    };

    console.group('Markdown 自动初始化');
    console.log('Markdown 原文', JSON.stringify(defaultMarkdown));
    console.log('转换后的 code_block', getCodeBlocks(doc));
    console.log('初始化后的 code_block', getCodeBlocks(writeFlow.view.state.doc));
    console.groupEnd();

    requestAnimationFrame(() => {
      const renderedCodeBlocks = Array.from(
        writeFlow.view.dom.querySelectorAll<HTMLElement>('.wf-code-block'),
      ).map((element) => {
        const lines = Array.from(element.querySelectorAll<HTMLElement>('.cm-line'));
        const editor = element.querySelector<HTMLElement>('.cm-editor');

        return {
          renderedLineCount: lines.length,
          lastLineText: JSON.stringify(lines.at(-1)?.textContent ?? ''),
          paddingBottom: editor ? getComputedStyle(editor).paddingBottom : null,
        };
      });

      console.log('渲染后的代码块', renderedCodeBlocks);
    });
  }, [writeFlow]);

  return null;
};

export default function MarkdownConvertPage() {
  return (
    <main className="min-h-screen bg-white">
      <Rich
        initValue={initialValue}
        className="min-h-screen overflow-auto p-10 [&_.wf-container]:pb-20 has-[.wf-dark]:bg-[#292c34]"
      >
        <MarkdownInitDiagnostics />
      </Rich>
    </main>
  );
}
