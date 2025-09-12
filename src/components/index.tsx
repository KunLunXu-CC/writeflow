import { BubbleMenu } from '@/components/Menu/BubbleMenu';
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
      <BubbleMenu>
        <div>加粗</div>
        <div>删除</div>
        <div>斜体</div>
        <div>下划线</div>
        <div>链接</div>
        <div>图片</div>
        <div>表格</div>
        <div>代码</div>
        <div>引用</div>
      </BubbleMenu>
    </WriteFlowContext.Provider>
  );
}
