'use client';
import { Rich } from './Rich';

export default function Home() {
  return (
    <Rich className="h-screen w-scree overflow-auto p-4 [&_.wf-container]:pb-20 has-[.wf-dark]:bg-[#292c34]" />
  );
}
