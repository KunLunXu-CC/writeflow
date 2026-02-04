'use client';
import { WriteFlow } from '@/components/Rich';
// import { Alert } from '@heroui/react';
export default function Home() {
  return (
    <div className="flex flex-col h-screen w-scree items-center justify-center p-10">
      <WriteFlow className="w-full max-w-[600px] overflow-auto h-[600px] rounded-md [&_.ProseMirror]:outline-none shadow-2xl [&_.ProseMirror]:min-h-[600px] [&_.ProseMirror]:p-4" />
    </div>
  );
}
