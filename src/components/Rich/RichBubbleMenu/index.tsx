import { BubbleMenu } from '@/components/BubbleMenu';
import Icon from '@/components/Icon';
import { useWriteFlowContext } from '@/components/WriteFlowContext';
import { useMemo } from 'react';

export const RichBubbleMenu = () => {
  const writeFlow = useWriteFlowContext();

  const items = useMemo(
    () => [
      {
        key: 'mergeCells',
        tooltip: '合并单元格',
        onClick: () => {
          writeFlow?.commands.mergeTableCells?.();
        },
        label: (
          <Icon
            className="text-base"
            name="icon-merge-cells"
          />
        ),
        shouldShow: () => {
          const cells = writeFlow?.helpers.getTableSelectedCells?.();
          return cells.length > 1;
        },
      },
    ],
    [writeFlow],
  );

  return <BubbleMenu items={items} />;
};
