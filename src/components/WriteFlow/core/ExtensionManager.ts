import type { WriteFlow } from '../WriteFlow.js';
import { NodeSpec, Schema } from 'prosemirror-model';
import { ExtendableFunContext, Extensions, EXTENSIONS_TYPE } from '../types';
import { Command, Plugin } from 'prosemirror-state';
import { getExtensionField } from '../helpers/getExtensionField';
import { getSchemaTypeByName } from '../helpers/getSchemaTypeByName';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { InputRule, inputRules } from 'prosemirror-inputrules';
import { redo, undo, history } from 'prosemirror-history';
import {
  nodes as basicNodes,
  marks as basicMarks,
} from 'prosemirror-schema-basic';

const isMac = globalThis.navigator?.userAgent.includes('Mac');
const modKey = isMac ? 'Mod-' : 'Ctrl-';

const customKeymap: Record<string, Command> = {
  [`${modKey}z`]: undo, // 撤销
  [`${modKey}Shift-z`]: redo, // 重做
};

export default class ExtensionManager {
  writeFlow!: WriteFlow;
  extensions: Extensions = [];

  schema!: Schema;
  plugins!: Plugin[];

  constructor(extensions: Extensions, writeFlow: WriteFlow) {
    this.writeFlow = writeFlow;
    this.extensions = extensions;

    this.createSchema();
    this.createPlugins();
  }
  private createSchema() {
    if (!this.extensions) {
      throw new Error(
        '[WriteFlow error]: 无法创建编辑器模式, 因为在此环境中没有定义扩展(extensions)。',
      );
    }

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

  /**
   * 从扩展中获得所有注册的 Prosemirror 插件: 插件是 Prosemirror 的核心概念, 用于扩展编辑器功能(如: 输入规则、快捷键、菜单等)
   * @returns 一个 Prosemirror 插件数组
   */
  private createPlugins() {
    if (!this.extensions) {
      throw new Error(
        '[WriteFlow error]: 无法创建编辑器插件, 因为在此环境中没有定义扩展(extensions)。',
      );
    }

    const inputRulesByExtension: InputRule[] = [];
    const keymapByExtension: Plugin[] = [
      keymap(baseKeymap),
      keymap(customKeymap),
    ];

    this.extensions.forEach((extension) => {
      const context = {
        schema: this.schema,
        name: extension.name,
        writeFlow: this.writeFlow,
        options: extension.options,
        type: getSchemaTypeByName(extension.name, this.schema),
        // storage: this.editor.extensionStorage[extension.name as keyof Storage],
      } as ExtendableFunContext;

      // 添加快捷键
      const addKeymap = getExtensionField(extension, 'addKeymap');
      if (addKeymap) {
        keymapByExtension.unshift(keymap(addKeymap(context))); // 注意这里: 将扩展的快捷键插件插入到数组的最前面, 这样会优先执行扩展的快捷键
      }

      // 添加输入规则
      const addInputRules = getExtensionField(extension, 'addInputRules');
      if (addInputRules) {
        inputRulesByExtension.push(...addInputRules(context));
      }
    });

    this.plugins = [
      ...keymapByExtension,
      history(),
      inputRules({ rules: inputRulesByExtension }),
    ];
  }
}
