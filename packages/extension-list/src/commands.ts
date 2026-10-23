import { WFCommand } from '@kunlunxu/wf-core';
import { Attrs, Node as PMNode, NodeType } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';

interface ConvertListOptions {
  /** 输入规则匹配内容的起止位置 */
  start?: number;
  end?: number;
  /** 转换后的列表与列表项类型 */
  listType: NodeType;
  itemType: NodeType;
  /** 有序列表的起始序号等列表属性 */
  listAttrs?: Attrs;
  /** 仅应用于触发输入规则的当前列表项 */
  currentItemAttrs?: Attrs;
}

const listNames = new Set(['bullet_list', 'ordered_list', 'task_list']);

/**
 * 转换光标所在的最近一层列表，并删除触发输入规则的文本
 */
export const convertList: WFCommand<ConvertListOptions> = ({ writeFlow }, options) => {
  if (options?.start === undefined || options.end === undefined) {
    return false;
  }

  const { start, end, listType, itemType, listAttrs, currentItemAttrs } = options;
  const { state, dispatch } = writeFlow;
  const $start = state.doc.resolve(start);
  let listDepth = -1;

  // 从光标位置向外查找，保证嵌套场景只转换最近一层列表
  for (let depth = $start.depth; depth > 0; depth -= 1) {
    if (listNames.has($start.node(depth).type.name)) {
      listDepth = depth;
      break;
    }
  }

  // 不在列表中或列表类型未改变时，交回原输入规则处理
  if (listDepth < 0 || $start.node(listDepth).type === listType) {
    return false;
  }

  // 删除输入标记前记录列表位置和当前列表项索引，删除文本不会改变这两个位置
  const listPos = $start.before(listDepth);
  const currentItemIndex = $start.index(listDepth);
  const tr = state.tr.delete(start, end);
  const sourceList = tr.doc.nodeAt(listPos);

  if (!sourceList) {
    return false;
  }

  const items: PMNode[] = [];

  // 任务列表使用 task_item，普通列表使用 list_item，因此需要同步重建直接子项
  sourceList.forEach((item, _, index) => {
    const attrs = index === currentItemIndex ? currentItemAttrs : undefined;
    items.push(itemType.createChecked(attrs, item.content, item.marks));
  });

  // createChecked 会校验重建后的子项是否满足目标列表的内容约束
  const targetList = listType.createChecked(listAttrs, items, sourceList.marks);

  tr.replaceWith(listPos, listPos + sourceList.nodeSize, targetList);
  // 整个列表被替换后，将光标恢复到已删除输入标记的起始位置
  tr.setSelection(TextSelection.create(tr.doc, start));
  dispatch(tr);
  return true;
};
