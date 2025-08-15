import type { WriteFlow } from '../WriteFlow.js';
import { NodeSpec, Schema } from 'prosemirror-model';
import { ExtendableFunContext, Extensions, EXTENSIONS_TYPE } from '../types';
import { Plugin } from 'prosemirror-state';
import { getExtensionField } from '../helpers/getExtensionField';
import { getSchemaTypeByName } from '../helpers/getSchemaTypeByName';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { InputRule, inputRules } from 'prosemirror-inputrules';
import {
  nodes as basicNodes,
  marks as basicMarks,
} from 'prosemirror-schema-basic';

export default class ExtensionManager {
  writeFlow!: WriteFlow;
  extensions: Extensions = [];

  schema!: Schema;
  inputRules!: Plugin;
  plugins!: Plugin[];

  constructor(extensions: Extensions, writeFlow: WriteFlow) {
    this.writeFlow = writeFlow;
    this.extensions = extensions;

    this.createSchema();
    this.createInputRules();
    this.createPlugins();
  }

  /**
   * 从扩展中获得所有注册的 Prosemirror 插件: 插件是 Prosemirror 的核心概念, 用于扩展编辑器功能(如: 输入规则、快捷键、菜单等)
   * @returns 一个 Prosemirror 插件数组
   */
  private createPlugins() {
    // const extensions = sortExtensions([...this.extensions].reverse())
    // const inputRules: InputRule[] = [];

    // this.extensions.forEach((extension) => {
    //   // 执行方法时需要传递的上下文
    //   const context = {
    //     name: extension.name,
    //     writeFlow: this.writeFlow,
    //     options: extension.options,
    //     type: getSchemaTypeByName(extension.name, this.schema),
    //     // storage: this.editor.extensionStorage[extension.name as keyof Storage],
    //   } as ExtendableFunContext;

    //   const addInputRules = getExtensionField(extension, 'addInputRules');

    //   inputRules.push(...(addInputRules?.(context) || []));
    // });

    this.plugins = [keymap(baseKeymap), this.inputRules];
  }

  private createInputRules() {
    const inputRulesByExtension: InputRule[] = [];

    this.extensions.forEach((extension) => {
      const addInputRules = getExtensionField(extension, 'addInputRules');

      const context = {
        schema: this.schema,
        name: extension.name,
        writeFlow: this.writeFlow,
        options: extension.options,
        type: getSchemaTypeByName(extension.name, this.schema),
        // storage: this.editor.extensionStorage[extension.name as keyof Storage],
      } as ExtendableFunContext;

      inputRulesByExtension.push(...(addInputRules?.(context) || []));
    });
    this.inputRules = inputRules({ rules: inputRulesByExtension });
  }

  private createSchema() {
    const nodes = this.extensions.reduce<Record<string, NodeSpec>>(
      (acc, extension) => {
        const getSchema = getExtensionField(extension, 'getSchema');
        if (extension.type !== EXTENSIONS_TYPE.NODE && !getSchema) {
          return acc;
        }

        const schema = getSchema({
          extension,
          name: extension.name,
          writeFlow: this.writeFlow,
          options: extension.options,
        });

        return {
          ...acc,
          [extension.name]: schema,
        };
      },
      {},
    );

    this.schema = new Schema({
      nodes: {
        ...basicNodes, // 基础节点: blockquote, code_block, doc、hard_break、heading,horizontal_rule、image、paragraph, text
        ...nodes,
      },
      marks: basicMarks,
    });
  }
}
