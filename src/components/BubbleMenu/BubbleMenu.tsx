import clsx from 'clsx';
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { BubbleMenuProps, BubbleMenuPortal, BubbleMenuItem } from '.';

export const BubbleMenu: React.FC<BubbleMenuProps> = (props) => {
  const { children, className, items } = props;

  return (
    <BubbleMenuPortal>
      <Popover className={clsx('inline-fle items-center gap-2', className)}>
        <PopoverTrigger>
          <div className='h-[10px] w-[10px] overflow-hidden'>111</div> 
        </PopoverTrigger>
        <PopoverContent>
          <div className='inline-flex items-center gap-2'>
          {items?.map((item) => (
            <BubbleMenuItem {...item} key={item.key} onClick={item.onClick} />
          ))}
          {children}
          </div>
        </PopoverContent>
    </Popover>
    </BubbleMenuPortal>
  )
};


