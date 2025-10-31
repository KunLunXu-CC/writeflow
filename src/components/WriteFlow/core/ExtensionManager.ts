import type { WriteFlow } from './WriteFlow.js';
import { MarkSpec, NodeSpec, Schema } from 'prosemirror-model';
import {
  AnyHelpers,
  AnyCommands,
  AnyExtension,
  EXTENSIONS_TYPE,
  ExtendableFunContext,
} from '../types';
import { Plugin } from 'prosemirror-state';
import { getExtensionField } from '../helpers/getExtensionField';
import { getSchemaTypeByName } from '../helpers/getSchemaTypeByName';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { InputRule, inputRules } from 'prosemirror-inputrules';
import { history } from 'prosemirror-history';
import {
  nodes as basicNodes,
  marks as basicMarks,
} from 'prosemirror-schema-basic';
import { NodeViewConstructor } from 'prosemirror-view';

/**
 * ExtensionManager 扩展管理器
 * 负责管理所有扩展的解析、创建, 包括:
 * - 创建 schema
 * - 创建 plugins
 * - 创建 nodeViews
 * - 创建 helpers
 * - 创建 commands
 * - 创建 keymaps
 * - 创建 inputRules
 */
export default class ExtensionManager {
  writeFlow!: WriteFlow;
  extensions: AnyExtension[] = [];

  schema!: Schema;
  plugins!: Plugin[];

  helpers: AnyHelpers = {};

  commands: AnyCommands = {};

  nodeViews!: Record<string, NodeViewConstructor>;

  constructor(extensions: AnyExtension[], writeFlow: WriteFlow) {
    this.writeFlow = writeFlow;
    this.extensions = extensions;

    this.createSchema();
    this.createPlugins();
    this.createNodeViews();

    this.collectHelpers();
    this.collectCommands();
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
    const { nodes, marks } = this.extensions.reduce<{
      nodes: Record<string, NodeSpec>;
      marks: Record<string, MarkSpec>;
    }>(
      (acc, extension) => {
        const addSchema = getExtensionField(extension, 'addSchema');

        if (!addSchema) {
          return acc;
        }

        const context = this.getContext(extension);

        switch (extension.type) {
          case EXTENSIONS_TYPE.NODE:
            acc.nodes[extension.name] = addSchema(context) as NodeSpec;
            break;
          case EXTENSIONS_TYPE.MARK:
            acc.marks[extension.name] = addSchema(context) as MarkSpec;
            break;
          default:
            break;
        }

        return acc;
      },
      {
        nodes: { ...basicNodes },
        marks: { ...basicMarks },
      },
    );

    this.schema = new Schema({ nodes, marks });
  };

  /**
   * 从扩展中获得所有注册的 Prosemirror 插件: 插件是 Prosemirror 的核心概念, 用于扩展编辑器功能(如: 输入规则、快捷键、菜单等)
   * @returns 一个 Prosemirror 插件数组
   */
  private createPlugins = () => {
    const pluginsByExtension: Plugin[] = [];
    const inputRulesByExtension: InputRule[] = [];
    const keymapByExtension: Plugin[] = [keymap(baseKeymap)];

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
    this.nodeViews = this.extensions.reduce<
      Record<string, NodeViewConstructor>
    >((acc, extension) => {
      const addNodeView = getExtensionField(extension, 'addNodeView');
      const context = this.getContext(extension);

      if (addNodeView) {
        acc[extension.name] = addNodeView(context);
      }

      return acc;
    }, {});
  };

  /**
   * 收集 helper
   */
  private collectHelpers = () => {
    this.helpers = this.extensions.reduce<AnyHelpers>((acc, extension) => {
      const context = this.getContext(extension);

      const addHelpers = getExtensionField(extension, 'addHelpers');
      if (addHelpers) {
        return { ...acc, ...addHelpers(context) };
      }

      return acc;
    }, {});
  };

  /**
   * 收集 command
   */
  private collectCommands = () => {
    this.commands = this.extensions.reduce<AnyCommands>((acc, extension) => {
      const context = this.getContext(extension);

      const addCommands = getExtensionField(extension, 'addCommands');
      if (addCommands) {
        return { ...acc, ...addCommands(context) };
      }

      return acc;
    }, {});
  };
}
