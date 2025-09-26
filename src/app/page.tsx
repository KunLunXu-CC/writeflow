'use client';
import { WriteFlow } from '@/components/Rich';

export default function Home() {
  return (
    <div className="wf-flex wf-h-screen wf-w-screen wf-items-center wf-justify-center">
      <WriteFlow className="wf-w-[600px] wf-overflow-auto wf-h-[600px] wf-rounded-md [&_.ProseMirror]:wf-outline-none wf-shadow-2xl [&_.ProseMirror]:wf-min-h-[600px] [&_.ProseMirror]:wf-p-4" />
    </div>
  );
}
