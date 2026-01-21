import { BubbleMenu } from '@/components/BubbleMenu';
import { useWriteFlowContext } from '@/components/WriteFlowContext';
import { useCallback, useMemo } from 'react';

export const RichBubbleMenu = () => {
  const writeFlow = useWriteFlowContext();

  const isSelectedTable = useCallback(() => {
    if (!writeFlow) {
      return false;
    }

    return !!writeFlow.helpers.getTableSelectedCells().length;
  }, [writeFlow]);

  const isSelectedTableMoreThanOne = useCallback(() => {
    if (!writeFlow) {
      return false;
    }

    return writeFlow.helpers.getTableSelectedCells().length > 1;
  }, [writeFlow]);

  const items = useMemo(() => {
    if (!writeFlow) {
      return [];
    }

    return [
      {
        tooltip: '拆分',
        key: 'splitCell',
        icon: 'icon-split-cells',
        shouldShow: isSelectedTable,
        onClick: writeFlow?.commands.splitTableCell,
      },
      {
        tooltip: '合并',
        key: 'mergeCells',
        icon: 'icon-merge-cells',
        shouldShow: isSelectedTableMoreThanOne,
        onClick: writeFlow?.commands.mergeTableCells,
      },
      {
        tooltip: '插入行',
        key: 'insertRowBelow',
        icon: 'icon-insert-row-below',
        shouldShow: isSelectedTable,
        onClick: writeFlow.commands.addTableRowAfter,
      },
      {
        tooltip: '插入列',
        key: 'insertColumnRight',
        icon: 'icon-insert-row-right',
        shouldShow: isSelectedTable,
        onClick: writeFlow.commands.addTableColumnAfter,
      },
      {
        tooltip: '删除行',
        key: 'deleteRow',
        icon: 'icon-delete-row',
        shouldShow: isSelectedTable,
        onClick: writeFlow.commands.deleteTableRow,
      },
      {
        tooltip: '删除列',
        key: 'deleteColumn',
        icon: 'icon-delete-column',
        shouldShow: isSelectedTable,
        onClick: writeFlow.commands.deleteTableColumn,
      },
    ];
  }, [writeFlow, isSelectedTable, isSelectedTableMoreThanOne]);

  return <BubbleMenu items={items} />;
};
