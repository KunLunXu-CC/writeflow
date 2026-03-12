import { FC, ReactNode } from 'react';
// import { RichBubbleMenu } from './RichBubbleMenu';
import { useCreateWriteFlow, WriteFlowContext } from '@kunlunxu/wf-react';

// import '@/components/WriteFlow/styles';

interface EditorProps {
  className?: string;
  children?: ReactNode;
}

export const Rich: FC<EditorProps> = (props: EditorProps) => {
  const { className, children } = props;
  const { writeFlow, writeFlowDomRef } = useCreateWriteFlow();

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
