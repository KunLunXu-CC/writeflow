'use client';
import { WriteFlow } from '@/components/Rich';
// import { Alert } from '@heroui/react';
import { Tools } from './Tools';

export default function Home() {
  return (
    <WriteFlow className="h-screen w-scree overflow-auto p-4 [&_.wf-container]:pb-20 has-[.wf-dark]:bg-[#292c34]">
      <Tools />
    </WriteFlow>
  );
}
