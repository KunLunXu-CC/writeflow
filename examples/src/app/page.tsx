'use client';
import { RichEditor } from '@/components/RichEditor';

export default function Home() {
  return (
    <RichEditor className="h-screen w-screen overflow-auto p-10 [&_.wf-container]:pb-20 has-[.wf-dark]:bg-[#292c34]" />
  );
}
