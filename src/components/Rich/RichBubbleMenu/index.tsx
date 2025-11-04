import { BubbleMenu } from '@/components/BubbleMenu';
import { useWriteFlowContext } from '@/components/WriteFlowContext';
import { useMemo } from 'react';

export const RichBubbleMenu = () => {
  const writeFlow = useWriteFlowContext();

  const items = useMemo(
    () => [
      {
        tooltip: '合并',
        key: 'mergeCells',
        onClick: writeFlow?.commands.mergeTableCells,
        icon: 'icon-merge-cells',
        // shouldShow: () => {
        //   const cells = writeFlow?.helpers.getTableSelectedCells?.();
        //   return cells.length > 1;
        // },
      },
      {
        tooltip: '插入行',
        key: 'insertRowBelow',
        // onClick: writeFlow?.commands.mergeTableCells,
        icon: 'icon-insert-row-below',
        // shouldShow: () => {
        //   const cells = writeFlow?.helpers.getTableSelectedCells?.();
        //   return cells.length > 1;
        // },
      },
      {
        tooltip: '插入列',
        key: 'insertColumnRight',
        // onClick: writeFlow?.commands.mergeTableCells,
        icon: 'icon-insert-row-right',
        // shouldShow: () => {
        //   const cells = writeFlow?.helpers.getTableSelectedCells?.();
        //   return cells.length > 1;
        // },
      },
      {
        tooltip: '删除列',
        key: 'deleteRow',
        // onClick: writeFlow?.commands.mergeTableCells,
        icon: 'icon-delete-row',
        // shouldShow: () => {
        //   const cells = writeFlow?.helpers.getTableSelectedCells?.();
        //   return cells.length > 1;
        // },
      },
      {
        tooltip: '删除列',
        key: 'deleteColumn',
        // onClick: writeFlow?.commands.mergeTableCells,
        icon: 'icon-delete-column',
        // shouldShow: () => {
        //   const cells = writeFlow?.helpers.getTableSelectedCells?.();
        //   return cells.length > 1;
        // },
      },
    ],
    [writeFlow],
  );

  return <BubbleMenu items={items} />;
};
