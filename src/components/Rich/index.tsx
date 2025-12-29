import { WriteFlowContext } from '@/components/WriteFlowContext';
import { useWriteFlow } from '../hooks/useWriteFlow';
import { RichBubbleMenu } from './RichBubbleMenu';
import { WFEventKeys } from '../WriteFlow/types';
import '@/components/WriteFlow/theme';

interface EditorProps {
  className?: string;
}

export const WriteFlow = (props: EditorProps) => {
  const { className } = props;
  const { writeFlow, writeFlowDomRef } = useWriteFlow();

  writeFlow?.on(WFEventKeys.docChange, (data) => {
    console.log('Editor content updated 12313:', data);
  });

  return (
    <WriteFlowContext.Provider value={writeFlow}>
      <div
        ref={writeFlowDomRef}
        className={className}
      />
      <RichBubbleMenu />
    </WriteFlowContext.Provider>
  );
};
