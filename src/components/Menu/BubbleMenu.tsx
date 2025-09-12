'use client';
import { useEffect, useRef, useState } from 'react';
import { useWriteFlowContext } from '../WriteFlowContext';
import { createPortal } from 'react-dom';
import { buildBubbleMenuPlugin } from '../WriteFlow/extensions/bubble-menu';
import { Plugin } from 'prosemirror-state';

interface BubbleMenuProps {
  children: React.ReactNode;
}

export const BubbleMenu: React.FC<BubbleMenuProps> = ({ children }) => {
  const writeFlow = useWriteFlowContext();
  const [isMounted, setIsMounted] = useState(false);
  const bubbleMenuPluginRef = useRef<Plugin | null>(null);
  const bubbleMenuElementRef = useRef<HTMLDivElement | null>(null);

  // 在客户端首次渲染时创建 DOM 元素
  useEffect(() => {
    bubbleMenuElementRef.current = document.createElement('div');
    setIsMounted(true);
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
  if (!isMounted || !bubbleMenuElementRef.current) return null;

  return createPortal(<div>{children}</div>, bubbleMenuElementRef.current);
};
