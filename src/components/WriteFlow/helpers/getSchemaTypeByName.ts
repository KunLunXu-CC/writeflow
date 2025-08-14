import type { MarkType, NodeType, Schema } from 'prosemirror-model';

/**
 * 尝试获取节点或标记类型
 * @param name 节点或标记类型的名称
 * @param schema Prosemirror 的 schema 对象
 * @returns 节点或标记类型, 或 null 如果它不存在
 */
export const getSchemaTypeByName = (
  name: string,
  schema: Schema,
): NodeType | MarkType | null => {
  return schema.nodes[name] || schema.marks[name] || null;
};
