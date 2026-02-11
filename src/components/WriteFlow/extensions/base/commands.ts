import { redo as pmRedo, undo as pmUndo } from 'prosemirror-history';
import { findWrapping } from 'prosemirror-transform';
import { WFCommand } from '../../types';
import { NodeType, Attrs } from 'prosemirror-model';

interface InsertWrappingOpts {
  nodeType: NodeType;

  end?: number;
  start?: number;
  /** wrapping node 的属性配置, key 是 node type name，value 是该 node 的属性, 例如: { task_item: { checked: true } } */
  attrs: Record<string, Attrs>;
}

/**
 * 重做命令
 * @param {object} content - 命令上下文
 * @param {object} content.writeFlow - 编辑器实例
 * @return boolean - 命令执行结果
 */
export const redo: WFCommand = ({ writeFlow }) => {
  const { state, dispatch } = writeFlow;

  return pmRedo(state, dispatch);
};

/**
 * 撤销命令
 * @param {object} content - 命令上下文
 * @param {object} content.writeFlow - 编辑器实例
 * @return boolean - 命令执行结果
 */
export const undo: WFCommand = ({ writeFlow }) => {
  const { state, dispatch } = writeFlow;

  return pmUndo(state, dispatch);
};

/**
 * 插入 wrapping node, wrapping node 是指 content 类型为 block 的节点
 *
 * - block node: 块节点, content 为 inline 或 text, 例如: paragraph、heading 等
 * - wrapping node: content 类型是 block 例如: blockquote、bullet_list、ordered_list 等
 * - Mark 例如: link、em、strong 等
 * @param {object} content - 命令上下文
 * @param {object} content.writeFlow - 编辑器实例
 * @param {InsertWrappingNodeOpts} opts - 配置项
 * @param {NodeType} opts.nodeType - 要插入的节点类型
 * @param {number} [opts.start] - 插入位置的开始位置, 默认为当前选区的 from
 * @param {number} [opts.end] - 插入位置的结束位置, 默认为当前选区的 to
 * @param {Record<string, Attrs>} [opts.attrs] - wrapping node 的属性配置, key 是 node type name，value 是该 node 的属性
 * @return boolean - 命令执行结果
 * @example
 * // 插入 blockquote
 * writeFlow.commands.insertWrapping({
 *   nodeType: writeFlow.schema.nodes.blockquote,
 * });
 */
export const insertWrapping: WFCommand<InsertWrappingOpts> = ({ writeFlow }, opts) => {
  const { state, dispatch } = writeFlow;

  if (!opts?.nodeType) {
    return false;
  }

  const { nodeType, attrs = {}, end = state.selection.to, start = state.selection.from } = opts;

  const tr = state.tr.delete(start, end);
  const $start = tr.doc.resolve(start);
  const range = $start.blockRange();
  const wrapping = range && findWrapping(range, nodeType);

  if (!wrapping || !range) {
    return false;
  }

  for (const w of wrapping) {
    const nodeAttrs = attrs[w.type.name];
    if (nodeAttrs) {
      w.attrs = { ...w.attrs, ...nodeAttrs };
    }
  }

  tr.wrap(range, wrapping);
  dispatch(tr);
  return true;
};
