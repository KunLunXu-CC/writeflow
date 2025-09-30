import { BubbleMenuPortalProps } from '.';
import { createPortal } from 'react-dom';
import { Plugin } from 'prosemirror-state';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useWriteFlowContext } from '../WriteFlowContext';
import { buildBubbleMenuPlugin } from '../WriteFlow/extensions/bubble-menu';

export const BubbleMenuPortal: React.FC<BubbleMenuPortalProps> = (props) => {
  const { children } = props;

  const writeFlow = useWriteFlowContext();
  const bubbleMenuPluginRef = useRef<Plugin | null>(null);
  const bubbleMenuElementRef = useRef<HTMLDivElement | null>(null);

  // 在客户端首次渲染时创建 DOM 元素
  useLayoutEffect(() => {
    bubbleMenuElementRef.current = document.createElement('div');
  }, []);

  // 在客户端首次渲染时创建插件
  useEffect(() => {
    if (!writeFlow || !bubbleMenuElementRef.current) return;

    bubbleMenuPluginRef.current = buildBubbleMenuPlugin({
      element: bubbleMenuElementRef.current,
    });

    writeFlow.registerPlugin(bubbleMenuPluginRef.current);
  }, [writeFlow]);

  // 在客户端首次渲染时创建 DOM 元素
  if (!bubbleMenuElementRef.current) return null;

  return createPortal(
    children,
    bubbleMenuElementRef.current,
  );
};
