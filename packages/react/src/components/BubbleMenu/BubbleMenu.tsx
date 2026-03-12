import clsx from 'clsx';
import { Card } from '@heroui/react';
import { FC, useMemo } from 'react';
import { BubbleMenuItem } from './BubbleMenuItem';
import { BubbleMenuPortal } from './BubbleMenuPortal';
import { BubbleMenuItemProps, BubbleMenuProps } from './types';

const resolveItemKey = (item: BubbleMenuItemProps, index: number) =>
  item.id || item.key || `item-${index}`;

const BubbleMenuContent: FC<BubbleMenuProps> = ({ className, items, children }) => {
  const visibleItems = useMemo(() => {
    if (!items) return [];
    return items.filter((item) => item.shouldShow?.() ?? true);
  }, [items]);

  if (visibleItems.length === 0 && !children) {
    return null;
  }

  return (
    <Card
      radius="sm"
      className={clsx('inline-flex flex-row items-center gap-1 p-1', className)}>
      {visibleItems.map((item, index) => (
        <BubbleMenuItem
          {...item}
          key={resolveItemKey(item, index)}
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
