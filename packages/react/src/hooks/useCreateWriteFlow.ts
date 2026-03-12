import { useEffect, useRef, useState } from 'react';
import { WriteFlow } from '@kunlunxu/wf-core';

export const useCreateWriteFlow = () => {
  const writeFlowDomRef = useRef<HTMLDivElement | null>(null);
  const [writeFlow, setWriteFlow] = useState<WriteFlow | null>(null);

  useEffect(() => {
    if (!writeFlowDomRef.current) return;

    const newWriteFlow = new WriteFlow({
      // initValue,
      // extensions: [],
      element: writeFlowDomRef.current,
    });

    setWriteFlow(newWriteFlow);

    return () => {
      setWriteFlow(null);
    };
  }, []);

  return { writeFlow, writeFlowDomRef };
};
