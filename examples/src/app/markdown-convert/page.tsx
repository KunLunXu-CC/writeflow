'use client';

import { useCallback, useState } from 'react';
import { Button, ButtonGroup, Card, CardBody, Chip, Textarea } from '@heroui/react';
import { type WriteFlowValue, useWriteFlowContext } from '@kunlunxu/wf-core';
import { markdownToWriteFlowJSON } from '@kunlunxu/wf-extension-markdown/core';
import { Rich } from '../Rich';

const defaultMarkdown = `# 标题

正文 [链接](https://example.com) 和 \`code\`

[x] 已完成
[ ] 未完成`;

const MarkdownConvertPanel = () => {
  const writeFlow = useWriteFlowContext();
  const [input, setInput] = useState(defaultMarkdown);
  const [inputMode, setInputMode] = useState<'markdown' | 'json'>('markdown');
  const [message, setMessage] = useState('');

  const handleConvertMarkdown = useCallback(() => {
    if (inputMode === 'json') {
      setMessage('当前已经是 JSON，可直接应用');
      return;
    }

    setInput(
      markdownToWriteFlowJSON({
        markdownText: input,
        space: 2,
      }),
    );
    setInputMode('json');
    setMessage('已转换为 JSON');
  }, [input, inputMode]);

  const handleApplyJson = useCallback(() => {
    if (!writeFlow) {
      setMessage('编辑器未就绪');
      return;
    }

    try {
      const value = JSON.parse(input) as WriteFlowValue;
      const doc = writeFlow.schema.nodeFromJSON(value);
      const tr = writeFlow.state.tr
        .replaceWith(0, writeFlow.state.doc.content.size, doc.content)
        .scrollIntoView();

      writeFlow.dispatch(tr);
      writeFlow.view.focus();
      setMessage('已应用到编辑器');
    } catch (error) {
      setMessage(error instanceof Error ? `JSON 无效：${error.message}` : 'JSON 无效');
    }
  }, [input, writeFlow]);

  const handleResetMarkdown = useCallback(() => {
    setInput(defaultMarkdown);
    setInputMode('markdown');
    setMessage('');
  }, []);

  return (
    <Card
      shadow="none"
      radius="none"
      className="h-screen w-full min-w-0 rounded-none border-l border-black/10 bg-default-50"
    >
      <CardBody className="flex h-full min-h-0 flex-col gap-4 p-6">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <Chip
            size="sm"
            variant="flat"
            color={message ? 'success' : 'default'}
            className="min-w-0 shrink overflow-hidden"
          >
            {message || (inputMode === 'json' ? '当前：JSON' : '当前：Markdown')}
          </Chip>
          <ButtonGroup
            size="sm"
            radius="sm"
            className="shrink-0"
          >
            <Button
              color="primary"
              variant="solid"
              isDisabled={inputMode === 'json'}
              onPress={handleConvertMarkdown}
            >
              转 JSON
            </Button>
            <Button
              color="primary"
              variant="solid"
              isDisabled={inputMode !== 'json'}
              onPress={handleApplyJson}
            >
              应用到编辑器
            </Button>
            <Button
              variant="bordered"
              onPress={handleResetMarkdown}
            >
              重置
            </Button>
          </ButtonGroup>
        </div>
        <Textarea
          value={input}
          minRows={24}
          variant="bordered"
          label={inputMode === 'json' ? 'WriteFlow JSON' : 'Markdown'}
          labelPlacement="outside"
          classNames={{
            base: 'min-h-0 w-full flex-1',
            inputWrapper: 'h-full bg-white',
            input: 'h-full resize-none font-mono text-sm leading-6',
          }}
          onValueChange={(value) => {
            setInput(value);
            setMessage('');
          }}
        />
      </CardBody>
    </Card>
  );
};

export default function MarkdownConvertPage() {
  return (
    <main className="grid min-h-screen grid-cols-2 bg-white">
      <Rich className="h-screen min-w-0 overflow-auto p-10 [&_.wf-container]:pb-20 has-[.wf-dark]:bg-[#292c34]">
        <MarkdownConvertPanel />
      </Rich>
    </main>
  );
}
