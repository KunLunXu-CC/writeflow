import { WriteFlowContext } from '@/components/WriteFlowContext';
import { useWriteFlow } from '../hooks/useWriteFlow';
import { RichBubbleMenu } from './RichBubbleMenu';
import { Input } from '@heroui/react';
import '@/components/WriteFlow/theme';

interface EditorProps {
  className?: string;
}

export const WriteFlow = (props: EditorProps) => {
  const { className } = props;
  const { writeFlow, writeFlowDomRef } = useWriteFlow();

  const handleChange = (value: string) => {
    if (writeFlow) {
      writeFlow.commands.initDocFromMarkdown({ markdownText: value });
    }
  };

  return (
    <>
      <div className="w-full max-w-[600px] py-6">
        <Input onValueChange={handleChange} />
      </div>
      <WriteFlowContext.Provider value={writeFlow}>
        <div
          ref={writeFlowDomRef}
          className={className}
        />
        <RichBubbleMenu />
      </WriteFlowContext.Provider>
    </>
  );
};
