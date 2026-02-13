import { WriteFlowContext } from '@/components/WriteFlowContext';
import { useWriteFlow } from '../hooks/useWriteFlow';
import { RichBubbleMenu } from './RichBubbleMenu';
import { Textarea } from '@heroui/react';
import { THEME } from '../WriteFlow/types';

import '@/components/WriteFlow/styles';
import './index.scss';

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

  const handDarkTheme = () => {
    if (writeFlow) {
      writeFlow.setTheme(THEME.DARK);
    }
  };

  return (
    <>
      <div className="w-full max-w-[600px] py-6 flex gap-2">
        <div className="flex-1">
          <Textarea
            minRows={1}
            onValueChange={handleChange}
          />
        </div>
        <div
          className="flex-none"
          onClick={handDarkTheme}>
          123
        </div>
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
