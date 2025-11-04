import clsx from 'clsx';
import { BubbleMenuItemProps } from '.';
import { Tooltip, Button } from '@heroui/react';
import Icon from '@/components/Icon';

export const BubbleMenuItem: React.FC<BubbleMenuItemProps> = (props) => {
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
          'inline-flex justify-center items-center gap-1 min-w-0 size-8 p-0',
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
