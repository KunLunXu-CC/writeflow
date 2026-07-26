import { WFCommand } from '@kunlunxu/wf-core';
import { isNumber } from 'lodash-es';
import { Selection, TextSelection } from 'prosemirror-state';

export interface InsertHorizontalRuleOptions {
  end?: number;
  start?: number;
}

export const insertHorizontalRule: WFCommand<InsertHorizontalRuleOptions> = (
  { writeFlow },
  options,
) => {
  const { start, end } = options ?? {};
  const { state, schema, dispatch } = writeFlow;
  const { tr } = state;

  // 1. 删除选中的内容
  if (isNumber(start) && isNumber(end)) {
    tr.delete(start, end);
  }

  // 2. 插入水平线
  const hr = schema.nodes.horizontal_rule.create();
  const positionBeforeRule = tr.selection.from;
  const mappingStart = tr.mapping.maps.length;
  tr.replaceSelectionWith(hr);

  // 3. 插入水平线后，插入一个段落节点
  const positionAfterRule = tr.mapping.slice(mappingStart).map(positionBeforeRule, 1);
  const $positionAfterRule = tr.doc.resolve(positionAfterRule);
  const parentEnd = $positionAfterRule.end();
  let nextSelection = Selection.findFrom($positionAfterRule, 1, true);

  // 如果没有找到下一个可选的节点，或者下一个节点的位置大于父节点的结束位置，则插入一个新的段落节点
  if (!nextSelection || nextSelection.from >= parentEnd) {
    const nextNode = schema.nodes.paragraph?.createAndFill();

    if (!nextNode) {
      return false;
    }

    tr.insert(positionAfterRule, nextNode);
    nextSelection = TextSelection.create(tr.doc, positionAfterRule + 1);
  }

  // 4. 设置光标位置到新插入的段落节点
  dispatch(tr.setSelection(nextSelection).scrollIntoView());
  return true;
};
