import { RefObject, useEffect, useRef, useState } from 'react';
import { WriteFlow } from '../WriteFlow';
import type { WriteFlowOptions } from '../types';

export type UseCreateWriteFlow = (
  opts?: Pick<WriteFlowOptions, 'initValue' | 'extensions' | 'theme' | 'placeholder' | 'readOnly'>,
) => {
  writeFlow: WriteFlow | null;
  writeFlowDomRef: RefObject<HTMLDivElement | null>;
};

export const useCreateWriteFlow: UseCreateWriteFlow = (opts) => {
  const { initValue, extensions, theme, placeholder, readOnly } = opts || {};
  const initValueRef = useRef(initValue);
  const themeRef = useRef(theme);
  const placeholderRef = useRef(placeholder);
  const readOnlyRef = useRef(readOnly);
  const writeFlowDomRef = useRef<HTMLDivElement | null>(null);
  const [writeFlow, setWriteFlow] = useState<WriteFlow | null>(null);

  themeRef.current = theme;
  placeholderRef.current = placeholder;
  readOnlyRef.current = readOnly;

  useEffect(() => {
    if (!writeFlowDomRef.current) return;

    let newWriteFlow: WriteFlow | null = null;
    let destroyed = false;

    queueMicrotask(() => {
      if (!writeFlowDomRef.current || destroyed) return;

      newWriteFlow = new WriteFlow({
        extensions,
        initValue: initValueRef.current,
        theme: themeRef.current,
        placeholder: placeholderRef.current,
        readOnly: readOnlyRef.current,
        element: writeFlowDomRef.current,
      });

      if (destroyed) {
        newWriteFlow.destroy();
        newWriteFlow = null;
        return;
      }

      setWriteFlow(newWriteFlow);
    });

    return () => {
      destroyed = true;
      newWriteFlow?.destroy();
      setWriteFlow(null);
    };
  }, [extensions]);

  useEffect(() => {
    writeFlow?.setTheme(theme);
  }, [theme, writeFlow]);

  useEffect(() => {
    writeFlow?.setPlaceholder(placeholder);
  }, [placeholder, writeFlow]);

  useEffect(() => {
    writeFlow?.setReadOnly(Boolean(readOnly));
  }, [readOnly, writeFlow]);

  return { writeFlow, writeFlowDomRef };
};
