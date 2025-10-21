import {
  AnyHelpers,
  EXTENSIONS_TYPE,
  ExtendableFunContext,
} from '@/components/WriteFlow/types';
import { InputRule } from 'prosemirror-inputrules';
import { MarkSpec, NodeSpec } from 'prosemirror-model';
import { Command, Plugin } from 'prosemirror-state';
import { NodeViewConstructor } from 'prosemirror-view';

export interface ExtendableConfig<Options = unknown> {
  name: string;
  options?: Options;
  type?: EXTENSIONS_TYPE;

  /*
   * 添加 schema
   */
  addSchema?: (context: ExtendableFunContext<Options>) => NodeSpec | MarkSpec;

  /**
   * This function adds commands to the editor
   * @see https://tiptap.dev/docs/editor/guide/custom-extensions#commands
   * @example
   * addCommands() {
   *   return {
   *     myCommand: () => ({ chain }) => chain().setMark('type', 'foo').run(),
   *   }
   * }
   */
  // addCommands?: (this: {
  //   name: string;
  //   options: Options;
  //   type: EXTENSIONS_TYPE;
  //   editor: WriteFlow;
  // }) => Partial<RawCommands>;

  /**
   * This function registers keyboard shortcuts.
   * @see https://tiptap.dev/docs/editor/guide/custom-extensions#keyboard-shortcuts
   * @example
   * addKeyboardShortcuts() {
   *   return {
   *     'Mod-l': () => this.editor.commands.toggleBulletList(),
   *   }
   * },
   */
  // addKeyboardShortcuts?: (this: {
  //   name: string;
  //   options: Options;
  //   type: EXTENSIONS_TYPE;
  //   editor: WriteFlow;
  // }) => {
  //   [key: string]: KeyboardShortcutCommand;
  // };

  /**
   * This function adds input rules to the editor.
   * @see https://tiptap.dev/docs/editor/guide/custom-extensions#input-rules
   * @example
   * addInputRules() {
   *   return [
   *     markInputRule({
   *       find: inputRegex,
   *       type: this.type,
   *     }),
   *   ]
   * },
   */
  addInputRules?: (context: ExtendableFunContext<Options>) => InputRule[];

  /**
   * This function adds keyboard shortcuts to the editor.
   * @see https://tiptap.dev/docs/editor/guide/custom-extensions#keyboard-shortcuts
   * @example
   * addKeymap() {
   *   return {
   *     'Mod-l': () => this.editor.commands.toggleBulletList(),
   *   }
   * },
   */
  addKeymap?: (
    context: ExtendableFunContext<Options>,
  ) => Record<string, Command>;

  /**
   * This function adds a plugin to the editor.
   * @see https://tiptap.dev/docs/editor/guide/custom-extensions#plugins
   * @example
   * getPlugin() {
   *   return [tableEditing()]
   * },
   */
  addPlugins?: (context: ExtendableFunContext<Options>) => Plugin[];

  /**
   * This function adds a node view to the editor.
   * @see https://tiptap.dev/docs/editor/guide/custom-extensions#node-views
   * @example
   * addNodeView() {
   *   return (node, view, getPos, decorations, innerDecorations) => {
   *     return view.dom.appendChild(document.createElement('div'));
   *   }
   * },
   */
  addNodeView?: (context: ExtendableFunContext<Options>) => NodeViewConstructor;

  /**
   * This function adds helpers to the editor.
   * @see https://tiptap.dev/docs/editor/guide/custom-extensions#helpers
   * @example
   * addHelpers() {
   *   return {
   *     myHelper: () => 'myHelper',
   *   }
   * },
   */
  addHelpers?: (context: ExtendableFunContext<Options>) => AnyHelpers;
}

export class Extendable<Options = unknown> {
  name: string;
  type = EXTENSIONS_TYPE.EXTENDABLE;
  options?: Options;
  config?: ExtendableConfig<Options>;

  constructor(config: ExtendableConfig<Options>) {
    this.config = config;
    this.name = this.config.name;
    this.options = config.options;
  }

  /**
   * 创建一个新的 Extendable 实例
   * @param config - 扩展配置对象或返回配置对象的函数
   */
  static create<Options = unknown>(
    config: ExtendableConfig<Options> | (() => ExtendableConfig<Options>),
  ) {
    const resolvedConfig = typeof config === 'function' ? config?.() : config;
    return new Extendable<Options>(resolvedConfig);
  }
}
