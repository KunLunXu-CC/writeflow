import clsx from 'clsx';
import { Card } from '@heroui/react';
import { FC, useMemo } from 'react';
import { BubbleMenuProps, BubbleMenuPortal, BubbleMenuItem } from '.';

const BubbleMenuContent: FC<BubbleMenuProps> = (props) => {
  const { className, items, children } = props;

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

  if (handledItems.length === 0 && !children) {
    return null;
  }

  return (
    <Card
      radius="sm"
      className={clsx('inline-flex flex-row items-center gap-1 p-1', className)}>
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
