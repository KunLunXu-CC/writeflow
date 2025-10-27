import {
  useRef,
  useState,
  useEffect,
  cloneElement,
  useLayoutEffect,
} from 'react';
import { BubbleMenuPortalProps } from '.';
import { createPortal } from 'react-dom';
import { Plugin } from 'prosemirror-state';
import { useWriteFlowContext } from '../WriteFlowContext';
import { buildBubbleMenuPlugin } from '../WriteFlow/extensions/bubble-menu';

const RANGE_ATTRIBUTE_NAME = 'data-range';

export const BubbleMenuPortal: React.FC<BubbleMenuPortalProps> = (props) => {
  const { children } = props;

  const [range, setRange] = useState<string>();
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

  // 监听 {RANGE_ATTRIBUTE_NAME} 属性变化, 强制内部组件强制更新
  useEffect(() => {
    if (!bubbleMenuElementRef.current) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const target = mutation.target as HTMLElement;
        const range = target.getAttribute(RANGE_ATTRIBUTE_NAME);
        setRange(range || void 0);
      });
    });

    observer.observe(bubbleMenuElementRef.current, {
      attributes: true, // 监听属性变化
      attributeFilter: [RANGE_ATTRIBUTE_NAME], // 可选：只监听 {RANGE_ATTRIBUTE_NAME} 属性
    });

    return () => observer.disconnect();
  }, []);

  // 在客户端首次渲染时创建 DOM 元素
  if (!bubbleMenuElementRef.current) return null;

  return createPortal(
    cloneElement(children, { key: range }),
    bubbleMenuElementRef.current,
  );
};
