import { FC, ReactNode } from 'react';
import { RichBubbleMenu } from './RichBubbleMenu';
import { useCreateWriteFlow } from '../hooks/useCreateWriteFlow';
import { WriteFlowContext } from '@/components/WriteFlowContext';

import '@/components/WriteFlow/styles';

interface EditorProps {
  className?: string;
  children?: ReactNode;
}

export const WriteFlow: FC<EditorProps> = (props: EditorProps) => {
  const { className, children } = props;
  const { writeFlow, writeFlowDomRef } = useCreateWriteFlow();

  return (
    <WriteFlowContext.Provider value={writeFlow}>
      <div
        ref={writeFlowDomRef}
        className={className}
      />
      <RichBubbleMenu />
      {children}
    </WriteFlowContext.Provider>
  );
};
