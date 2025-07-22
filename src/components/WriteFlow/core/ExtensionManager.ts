import getSchemaByResolvedExtensions from '@/components/WriteFlow/helpers/getSchemaByResolvedExtensions';
import type { WriteFlow } from '../WriteFlow.js';
import { Schema } from 'prosemirror-model';
import { Extensions } from '../types.js';

export default class ExtensionManager {
  editor!: WriteFlow;
  schema!: Schema;
  extensions: Extensions = [];

  constructor(extensions: unknown[], editor: WriteFlow) {
    console.log(
      '%c [ extensions ]-7',
      'font-size:13px; background:#e1c2ff; color:#ffffff;',
      extensions,
    );

    this.editor = editor;

    this.schema = getSchemaByResolvedExtensions(this.extensions, editor);
    // this.extensions = resolveExtensions(extensions);
    // this.editorSchema = getSchemaByResolvedExtensions(this.extensions, editor);
    // this.setupExtensions();
  }

  // this.schema = new Schema({
  //   nodes: {
  //     ...nodes,
  //     code_block: {
  //       ...nodes.code_block,
  //       attrs: {
  //         language: { default: null },
  //       },
  //     },
  //   },
  //   // marks: Mark,
  // });
}
