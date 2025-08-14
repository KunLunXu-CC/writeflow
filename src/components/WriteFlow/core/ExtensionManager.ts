import getSchemaByResolvedExtensions from '@/components/WriteFlow/helpers/getSchemaByResolvedExtensions';
import type { WriteFlow } from '../WriteFlow.js';
import { Schema } from 'prosemirror-model';
import { ExtendableFunContext, Extensions } from '../types.js';
import { Plugin } from 'prosemirror-state';
import { resolveExtensions } from '../helpers/resolveExtensions';
import { InputRule, inputRulesPlugin } from '../InputRules';
import { getExtensionField } from '../helpers/getExtensionField';
import { getSchemaTypeByName } from '../helpers/getSchemaTypeByName';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';

export default class ExtensionManager {
  writeFlow!: WriteFlow;
  schema!: Schema;
  extensions: Extensions = [];

  constructor(extensions: Extensions, writeFlow: WriteFlow) {
    this.writeFlow = writeFlow;
    this.extensions = resolveExtensions(extensions);
    this.schema = getSchemaByResolvedExtensions(this.extensions, writeFlow);
    // this.editorSchema = getSchemaByResolvedExtensions(this.extensions, editor);
    // this.setupExtensions();
  }

  /**
   * 从扩展中获得所有注册的 Prosemirror 插件: 插件是 Prosemirror 的核心概念, 用于扩展编辑器功能(如: 输入规则、快捷键、菜单等)
   * @returns 一个 Prosemirror 插件数组
   */
  get plugins(): Plugin[] {
    // const extensions = sortExtensions([...this.extensions].reverse())
    const inputRules: InputRule[] = [];

    this.extensions.forEach((extension) => {
      // 执行方法时需要传递的上下文
      const context = {
        name: extension.name,
        writeFlow: this.writeFlow,
        options: extension.options,
        type: getSchemaTypeByName(extension.name, this.schema),
        // storage: this.editor.extensionStorage[extension.name as keyof Storage],
      } as ExtendableFunContext;

      const addInputRules = getExtensionField(extension, 'addInputRules');

      inputRules.push(...(addInputRules?.(context) || []));
    });

    return [
      keymap(baseKeymap),
      inputRulesPlugin({
        inputRules,
        writeFlow: this.writeFlow,
      }),
    ];
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
