'use client';
import { Rich } from './Rich';

export default function Home() {
  return (
    <Rich className="h-screen w-screen overflow-auto p-10 [&_.wf-container]:pb-20 has-[.wf-dark]:bg-[#292c34]" />
  );
}
