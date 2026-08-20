import { pick, sortBy } from 'lodash-es';
import { nodes as basicNodes } from 'prosemirror-schema-basic';
import type { MarkSpec, NodeSpec } from 'prosemirror-model';
import { Schema } from 'prosemirror-model';
import type { WriteFlow } from './WriteFlow';
import { getExtensionField } from './helpers/getExtensionField';
import { getSchemaTypeByName } from './helpers/getSchemaTypeByName';
import { AnyExtension, EXTENSIONS_TYPE, ExtendableFunContext } from './types';

export interface CreateWriteFlowSchemaOptions {
  extensions?: AnyExtension[];
  writeFlow?: WriteFlow;
}

/**
 * 根据扩展列表创建 ProseMirror Schema。
 * 这个方法不依赖浏览器 DOM，可在 Node 侧批量转换数据时复用前端同一套扩展配置。
 */
export const createWriteFlowSchema = (options: CreateWriteFlowSchemaOptions = {}) => {
  const extensions = sortBy(options.extensions || [], (extension) => -extension.priority);
  const schemaRef: { current?: Schema } = {};

  const getContext = (extension: AnyExtension): ExtendableFunContext => ({
    extension,
    schema: schemaRef.current as Schema,
    writeFlow: options.writeFlow as WriteFlow,
    type: schemaRef.current ? getSchemaTypeByName(extension.name, schemaRef.current) : null,
  });

  const { nodes, marks } = extensions.reduce<{
    nodes: Record<string, NodeSpec>;
    marks: Record<string, MarkSpec>;
  }>(
    (acc, extension) => {
      const addSchema = getExtensionField(extension, 'addSchema');

      if (!addSchema) {
        return acc;
      }

      switch (extension.type) {
        case EXTENSIONS_TYPE.NODE:
          acc.nodes[extension.name] = addSchema(getContext(extension)) as NodeSpec;
          break;
        case EXTENSIONS_TYPE.MARK:
          acc.marks[extension.name] = addSchema(getContext(extension)) as MarkSpec;
          break;
        default:
          break;
      }

      return acc;
    },
    {
      marks: {},
      nodes: pick(basicNodes, ['doc', 'text', 'paragraph']),
    },
  );

  schemaRef.current = new Schema({ nodes, marks });

  return schemaRef.current;
};
