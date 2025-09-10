import { BubbleMenu } from '@/components/BubbleMenu';
import { WriteFlowContext } from '@/components/WriteFlowContext';
import '@/components/WriteFlow/theme';
import { useWriteFlow } from './hooks/useWriteFlow';

export default function Editor() {
  const { writeFlow, writeFlowDomRef } = useWriteFlow();

  return (
    <WriteFlowContext.Provider value={writeFlow}>
      <div
        ref={writeFlowDomRef}
        className="w-[600px] overflow-auto h-[600px] rounded-md [&_.ProseMirror]:outline-none shadow-2xl [&_.ProseMirror]:min-h-[600px] [&_.ProseMirror]:p-4"
      />
      <BubbleMenu />
    </WriteFlowContext.Provider>
  );
}
