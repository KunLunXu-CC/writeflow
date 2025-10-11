import clsx from 'clsx';
import { BubbleMenuItemProps } from '.';
import { Tooltip, Button } from '@heroui/react';

export const BubbleMenuItem: React.FC<BubbleMenuItemProps> = (props) => {
  const { label, onClick, tooltip, className } = props;
  return (
    <Tooltip
      radius="sm"
      content={tooltip}>
      <Button
        size="sm"
        radius="sm"
        variant="light"
        onPress={onClick}
        className={clsx('inline-flex items-center gap-1 min-w-0', className)}>
        {label}
      </Button>
    </Tooltip>
  );
};
