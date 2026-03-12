import clsx from 'clsx';
import { Button, Tooltip } from '@heroui/react';
import { BubbleMenuItemProps } from './types';
import { Icon } from '..';

type BubbleMenuItemButtonProps = Omit<BubbleMenuItemProps, 'key'>;

export const BubbleMenuItem: React.FC<BubbleMenuItemButtonProps> = (props) => {
  const { icon, onClick, tooltip, className } = props;

  return (
    <Tooltip
      radius="sm"
      content={tooltip}>
      <Button
        size="sm"
        radius="sm"
        variant="light"
        onPress={onClick}
        className={clsx(
          'inline-flex size-8 min-w-0 items-center justify-center gap-1 p-0',
          className,
        )}>
        <Icon
          name={icon}
          className="text-base"
        />
      </Button>
    </Tooltip>
  );
};
