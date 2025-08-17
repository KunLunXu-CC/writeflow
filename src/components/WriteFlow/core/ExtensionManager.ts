import type { WriteFlow } from './WriteFlow.js';
import { NodeSpec, Schema } from 'prosemirror-model';
import { AnyExtension, ExtendableFunContext, Extensions } from '../types';
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
import { NodeView } from 'prosemirror-view';

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
  nodeViews!: Record<string, NodeView>;

  constructor(extensions: Extensions, writeFlow: WriteFlow) {
    this.writeFlow = writeFlow;
    this.extensions = extensions;

    this.createSchema();
    this.createPlugins();
    this.createNodeViews();
  }

  /**
   * 获取扩展的上下文, 用于传递给扩展的函数参数
   * @param extension 扩展
   * @returns 扩展的上下文
   */
  private getContext = (extension: AnyExtension): ExtendableFunContext => {
    return {
      extension,
      schema: this.schema,
      writeFlow: this.writeFlow,
      type: getSchemaTypeByName(extension.name, this.schema),
    };
  };

  /**
   * 创建 schema
   * returns 返回一个包含所有扩展的 schema 对象
   */
  private createSchema = () => {
    const nodes = this.extensions.reduce<Record<string, NodeSpec>>(
      (acc, extension) => {
        const addSchema = getExtensionField(extension, 'addSchema');

        if (!addSchema) {
          return acc;
        }

        const context = this.getContext(extension);
        return {
          ...acc,
          [extension.name]: addSchema(context),
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
  };

  /**
   * 从扩展中获得所有注册的 Prosemirror 插件: 插件是 Prosemirror 的核心概念, 用于扩展编辑器功能(如: 输入规则、快捷键、菜单等)
   * @returns 一个 Prosemirror 插件数组
   */
  private createPlugins = () => {
    const pluginsByExtension: Plugin[] = [];
    const inputRulesByExtension: InputRule[] = [];
    const keymapByExtension: Plugin[] = [
      keymap(baseKeymap),
      keymap(customKeymap),
    ];

    this.extensions.forEach((extension) => {
      const context = this.getContext(extension);

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

      // 添加插件
      const addPlugins = getExtensionField(extension, 'addPlugins');
      if (addPlugins) {
        pluginsByExtension.push(...addPlugins(context));
      }
    });

    this.plugins = [
      ...keymapByExtension,
      ...pluginsByExtension,
      history(),
      inputRules({ rules: inputRulesByExtension }),
    ];
  };

  /**
   * 获取所有扩展的 nodeView 对象
   * @returns 一个包含所有扩展的 nodeView 对象的记录
   */
  private createNodeViews = () => {
    this.nodeViews = this.extensions.reduce<Record<string, NodeView>>(
      (acc, extension) => {
        const addNodeView = getExtensionField(extension, 'addNodeView');
        const context = this.getContext(extension);

        if (addNodeView) {
          acc[extension.name] = addNodeView(context);
        }

        return acc;
      },
      {},
    );
  };
}
