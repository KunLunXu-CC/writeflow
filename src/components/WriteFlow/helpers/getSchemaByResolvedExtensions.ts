import { NodeSpec, Schema } from 'prosemirror-model';
import type { WriteFlow } from '../WriteFlow';
import { getExtensionField } from './getExtensionField';
import { AnyExtension, EXTENSIONS_TYPE } from '../types';
import { nodes as basicNodes } from 'prosemirror-schema-basic';

/**
 * Creates a new Prosemirror schema based on the given extensions.
 * @param extensions An array of Tiptap extensions
 * @param editor The editor instance
 * @returns A Prosemirror schema
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

  console.log(
    '%c [ nodes ]-40',
    'font-size:13px; background:#1a9733; color:#5edb77;',
    nodes,
  );

  return new Schema({
    nodes: {
      ...basicNodes,
      ...nodes,
    },
    // marks: Mark,
  });
};

export default getSchemaByResolvedExtensions;
