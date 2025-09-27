import { useEffect, useLayoutEffect, useRef } from 'react';
import { useWriteFlowContext } from '../WriteFlowContext';
import { createPortal } from 'react-dom';
import { buildBubbleMenuPlugin } from '../WriteFlow/extensions/bubble-menu';
import { Plugin } from 'prosemirror-state';
import clsx from 'clsx';

export interface BubbleMenuProps {
  children: React.ReactNode;
  className?: string;
}

export const BubbleMenu: React.FC<BubbleMenuProps> = (props) => {
  const { children, className } = props;

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
    <div className={clsx('wf-inline-flex wf-items-center wf-gap-2', className)}>
      {children}
    </div>,
    bubbleMenuElementRef.current,
  );
};
