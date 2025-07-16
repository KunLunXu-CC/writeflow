import { useEffect, useRef } from 'react';
import { WriteFlow } from '@/components/WriteFlow/WriteFlow';
import '@/components/WriteFlow/theme';

export default function Editor() {
  const editorRef = useRef<WriteFlow>(null);
  const editorDom = useRef(null);

  useEffect(() => {
    if (editorRef.current) return;
    editorRef.current = new WriteFlow({
      element: editorDom.current!,
    });
  }, []);

  return (
    <div
      ref={editorDom}
      className="w-[800px] h-[800px] markdown-preview-light [&_.ProseMirror]:outline-none [&_.ProseMirror]:bg-[#fafafa] [&_.ProseMirror]:min-h-[600px] [&_.ProseMirror]:p-1"
    />
  );
}
