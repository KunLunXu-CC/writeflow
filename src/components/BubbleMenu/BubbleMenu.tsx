import clsx from 'clsx';
import { Card } from '@heroui/react';
import { BubbleMenuProps, BubbleMenuPortal, BubbleMenuItem } from '.';

export const BubbleMenu: React.FC<BubbleMenuProps> = (props) => {
  const { children, className, items } = props;

  return (
    <BubbleMenuPortal>
      <Card
        radius="sm"
        className={clsx(
          'inline-flex flex-row items-center gap-1 p-1',
          className,
        )}>
        {items?.map((item) => (
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
