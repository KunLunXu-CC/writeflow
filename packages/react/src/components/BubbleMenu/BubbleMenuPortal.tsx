import { cloneElement, useEffect, useRef, useState } from 'react';
import { Plugin } from 'prosemirror-state';
import { createPortal } from 'react-dom';
import { buildBubbleMenuPlugin } from '@kunlunxu/wf-extension-bubble-menu';
import { useWriteFlowContext } from '..';
import { BubbleMenuPortalProps } from './types';

const RANGE_ATTRIBUTE_NAME = 'data-range';

export const BubbleMenuPortal: React.FC<BubbleMenuPortalProps> = ({ children }) => {
  const writeFlow = useWriteFlowContext();
  const [renderKey, setRenderKey] = useState<string>();
  const [portalElement, setPortalElement] = useState<HTMLDivElement | null>(null);
  const bubbleMenuPluginRef = useRef<Plugin | null>(null);

  useEffect(() => {
    setPortalElement(document.createElement('div'));
  }, []);

  useEffect(() => {
    if (!writeFlow || !portalElement) return;

    if (bubbleMenuPluginRef.current) {
      writeFlow.unregisterPlugin(bubbleMenuPluginRef.current);
    }

    bubbleMenuPluginRef.current = buildBubbleMenuPlugin({
      element: portalElement,
    });

    writeFlow.registerPlugin(bubbleMenuPluginRef.current);

    return () => {
      if (!bubbleMenuPluginRef.current) return;
      writeFlow.unregisterPlugin(bubbleMenuPluginRef.current);
      bubbleMenuPluginRef.current = null;
    };
  }, [writeFlow, portalElement]);

  useEffect(() => {
    if (!portalElement) return;

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        const target = mutation.target as HTMLElement;
        const range = target.getAttribute(RANGE_ATTRIBUTE_NAME);
        setRenderKey(range || void 0);
      }
    });

    observer.observe(portalElement, {
      attributes: true,
      attributeFilter: [RANGE_ATTRIBUTE_NAME],
    });

    return () => observer.disconnect();
  }, [portalElement]);

  if (!portalElement) return null;

  return createPortal(cloneElement(children, { key: renderKey }), portalElement);
};
