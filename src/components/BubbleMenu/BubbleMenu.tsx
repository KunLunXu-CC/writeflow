import clsx from 'clsx';
import { Card } from '@heroui/react';
import { FC, useEffect, useMemo } from 'react';
import { useWriteFlowContext } from '../WriteFlowContext';
import { BubbleMenuProps, BubbleMenuPortal, BubbleMenuItem } from '.';

const BubbleMenuContent: FC<BubbleMenuProps> = (props) => {
  const { className, items, children } = props;
  const writeFlow = useWriteFlowContext();

  const handledItems = useMemo(() => {
    if (!items) return [];

    return items
      .filter((item) => item.shouldShow?.() ?? true)
      .map((item) => {
        return {
          ...item,
        };
      });
  }, [items]);

  useEffect(() => {
    if (!writeFlow) return;
  }, [writeFlow]);

  return (
    <Card
      radius="sm"
      className={clsx(
        'inline-flex flex-row items-center gap-1 p-1',
        className,
      )}>
      {handledItems.map((item) => (
        <BubbleMenuItem
          {...item}
          key={item.key}
          onClick={item.onClick}
        />
      ))}
      {children}
    </Card>
  );
};

export const BubbleMenu: FC<BubbleMenuProps> = (props) => (
  <BubbleMenuPortal>
    <BubbleMenuContent {...props} />
  </BubbleMenuPortal>
);
