import clsx from 'clsx';
import { Card } from '@heroui/react';
import { BubbleMenuProps, BubbleMenuPortal, BubbleMenuItem } from '.';
import { useWriteFlowContext } from '../WriteFlowContext';
import { useEffect, useMemo } from 'react';

export const BubbleMenu: React.FC<BubbleMenuProps> = (props) => {
  const { children, className, items } = props;
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
    <BubbleMenuPortal>
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
    </BubbleMenuPortal>
  );
};
