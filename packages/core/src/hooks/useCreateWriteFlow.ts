import { RefObject, useEffect, useRef, useState } from 'react';
import { WriteFlow } from '../WriteFlow';
import type { WriteFlowOptions } from '../types';

export type UseCreateWriteFlow = (opts?: Pick<WriteFlowOptions, 'initValue' | 'extensions'>) => {
  writeFlow: WriteFlow | null;
  writeFlowDomRef: RefObject<HTMLDivElement | null>;
};

export const useCreateWriteFlow: UseCreateWriteFlow = (opts) => {
  const { initValue, extensions } = opts || {};
  const initValueRef = useRef(initValue);
  const writeFlowDomRef = useRef<HTMLDivElement | null>(null);
  const [writeFlow, setWriteFlow] = useState<WriteFlow | null>(null);

  useEffect(() => {
    if (!writeFlowDomRef.current) return;

    const newWriteFlow = new WriteFlow({
      extensions,
      initValue: initValueRef.current,
      element: writeFlowDomRef.current,
    });

    setWriteFlow(newWriteFlow);

    return () => {
      newWriteFlow.destroy();
      setWriteFlow(null);
    };
  }, [extensions]);

  return { writeFlow, writeFlowDomRef };
};
