import { NodeSpec, Schema } from 'prosemirror-model';
import type { WriteFlow } from '../WriteFlow';
import { getExtensionField } from './getExtensionField';
import { AnyExtension, EXTENSIONS_TYPE } from '../types';
import {
  nodes as basicNodes,
  marks as basicMarks,
} from 'prosemirror-schema-basic';

/**
 * 根据给定的扩展创建一个新的 Prosemirror 模式
 * @param extensions 扩展数组
 * @param writeFlow 编辑器实例
 * @returns Prosemirror 模式
 */
const getSchemaByResolvedExtensions = (
  extensions: AnyExtension[],
  writeFlow?: WriteFlow,
): Schema => {
  const nodes = extensions.reduce<Record<string, NodeSpec>>(
    (acc, extension) => {
      const getSchema = getExtensionField(extension, 'getSchema');
      if (extension.type !== EXTENSIONS_TYPE.NODE && !getSchema) {
        return acc;
      }

      const schema = getSchema({
        writeFlow,
        extension,
        name: extension.name,
        options: extension.options,
      });

      return {
        ...acc,
        [extension.name]: schema,
      };
    },
    {},
  );

  return new Schema({
    nodes: {
      ...basicNodes, // 基础节点: blockquote, code_block, doc、hard_break、heading,horizontal_rule、image、paragraph, text
      ...nodes,
    },
    marks: basicMarks,
  });
};

export default getSchemaByResolvedExtensions;
