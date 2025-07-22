// import getSchemaByResolvedExtensions from '@/components/WriteFlow/helpers/getSchemaByResolvedExtensions.js';
import type { WriteFlow } from '../WriteFlow.js';
import { Schema } from 'prosemirror-model';

export default class ExtensionManager {
  editor!: WriteFlow;
  schema!: Schema;
  // extensions: Extensions;

  constructor(extensions: unknown[], editor: WriteFlow) {
    console.log(
      '%c [ extensions ]-7',
      'font-size:13px; background:#e1c2ff; color:#ffffff;',
      extensions,
    );

    this.editor = editor;
    // this.extensions = resolveExtensions(extensions);
    // this.editorSchema = getSchemaByResolvedExtensions(this.extensions, editor);
    // this.setupExtensions();
  }
}
