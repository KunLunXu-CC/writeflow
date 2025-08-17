import {
  EXTENSIONS_TYPE,
  ExtendableFunContext,
} from '@/components/WriteFlow/types';
import { InputRule } from 'prosemirror-inputrules';
import { NodeSpec } from 'prosemirror-model';
import { Command, Plugin } from 'prosemirror-state';
import { NodeViewConstructor } from 'prosemirror-view';

export interface ExtendableConfig<Options = unknown> {
  name: string;
  options?: Options;
  type?: EXTENSIONS_TYPE;

  /*
   * 添加 schema
   */
  addSchema: () => NodeSpec;

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
  addInputRules?: (context: ExtendableFunContext) => InputRule[];

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
  addKeymap?: (context: ExtendableFunContext) => Record<string, Command>;

  /**
   * This function adds a plugin to the editor.
   * @see https://tiptap.dev/docs/editor/guide/custom-extensions#plugins
   * @example
   * getPlugin() {
   *   return [tableEditing()]
   * },
   */
  addPlugins?: (context: ExtendableFunContext) => Plugin[];

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
  addNodeView?: (context: ExtendableFunContext) => NodeViewConstructor;
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
}
