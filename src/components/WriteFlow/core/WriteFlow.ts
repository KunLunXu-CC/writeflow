import { EditorView } from 'prosemirror-view';
import { WriteFlowOptions } from '../types';
import { DOMParser } from 'prosemirror-model';
import { EditorState, Plugin } from 'prosemirror-state';
import ExtensionManager from './ExtensionManager';

export class WriteFlow {
  private options!: WriteFlowOptions;

  private extensionManager!: ExtensionManager;

  public state!: EditorState;
  public view: EditorView | null = null;

  constructor(options: WriteFlowOptions) {
    this.setOptions(options);
    this.createExtensionManager();
    // this.createCommandManager();

    this.mount(options.element);
  }

  private setOptions(options: WriteFlowOptions) {
    this.options = {
      ...options,
    };
  }

  /**
   * 将编辑器附加到 DOM, 最终创建一个新的编辑器视图(view)
   */
  private mount(el: WriteFlowOptions['element']) {
    if (typeof el === 'undefined') {
      throw new Error(
        '[WriteFlow error]: 无法挂载编辑器, 因为在此环境中没有定义挂载点(element)。',
      );
    }
    this.createView(el);
  }

  /**
   * 创建 PM 视图。
   */
  private createView(el: WriteFlowOptions['element']) {
    this.view = new EditorView(el, {
      nodeViews: {
        ...this.extensionManager.nodeViews,
      },
      attributes: {
        ...this.options.attributes,
      },
      // ...this.options.editorProps,
      // attributes: {
      //   // add `role="textbox"` to the editor element
      //   role: 'textbox',
      //   ...this.options.editorProps?.attributes,
      // },
      // dispatchTransaction: this.dispatchTransaction.bind(this),
      state: this.createState(),
    });

    return this.view;

    // editorRef.current = new EditorView(editorDom.current, {
    //   nodeViews: {
    //     code_block: codeBlockNodeView,
    //   },
    //   state: EditorState.create({
    //     plugins,
    //     doc: DOMParser.fromSchema(mySchema).parse(
    //       document.createElement('div'),
    //     ),
    //   }),
    // });

    // `editor.view` is not yet available at this time.
    // Therefore we will add all plugins and node views directly afterwards.
    // const newState = this.state.reconfigure({
    //   plugins: this.extensionManager.plugins,
    // });

    // this.view.updateState(newState);

    // this.createNodeViews();
    // this.prependClass();
    // this.injectCSS();

    // Let’s store the editor instance in the DOM element.
    // So we’ll have access to it for tests.
    // const dom = this.view.dom as TiptapEditorHTMLElement;

    // dom.editor = this;
  }

  /**
   * 创建编辑器状态
   */
  private createState(): EditorState {
    const plugins = this.extensionManager.plugins;
    const schema = this.extensionManager.schema;

    if (!plugins || !schema) {
      throw new Error(
        '[WriteFlow error]: 无法创建编辑器状态, 因为在此环境中没有定义插件(plugins)或模式(schema)。',
      );
    }

    this.state = EditorState.create({
      plugins,
      doc: DOMParser.fromSchema(schema).parse(document.createElement('div')),
    });

    return this.state;
  }

  // private createCommandManager() {
  //   this.commandManager = new CommandManager();
  // }

  private createExtensionManager() {
    this.extensionManager = new ExtensionManager(
      this.options.extensions || [],
      this,
    );
  }

  /**
   * 注册 PM 插件
   *
   * @param plugin PM 插件
   * @param handlePlugins 控制如何将插件合并到现有插件中, 可二次处理、过滤插件
   * @returns 新的编辑器状态
   */
  public registerPlugin(
    plugin: Plugin,
    handlePlugins?: (newPlugin: Plugin, plugins: Plugin[]) => Plugin[],
  ): EditorState {
    if (!this.view) {
      throw new Error('[WriteFlow error]: no view.');
    }

    const plugins = handlePlugins?.(plugin, [...this.state.plugins]) ?? [
      ...this.state.plugins,
      plugin,
    ];

    const state = this.state.reconfigure({ plugins });

    this.view.updateState(state);

    return state;
  }

  /**
   * 取消注册 PM 插件
   *
   * @param nameOrPluginKeyToRemove 插件名称或插件键
   * @returns 新的编辑器状态或 undefined
   */
  // public unregisterPlugin(
  //   nameOrPluginKeyToRemove: string | PluginKey | (string | PluginKey)[],
  // ): EditorState | undefined {
  //   if (!this.view) {
  //     throw new Error('[WriteFlow error]: no view.');
  //   }

  //   const prevPlugins = this.state.plugins;
  //   let plugins = prevPlugins;

  //   const targetNames = ([] as (string | PluginKey)[])
  //     .concat(nameOrPluginKeyToRemove)
  //     .map((nameOrPluginKey) => {
  //       if (typeof nameOrPluginKey === 'string') {
  //         return `${nameOrPluginKey}$`;
  //       }
  //       // PluginKey doesn't expose its internal name in types; cast to any
  //       return ((nameOrPluginKey as unknown as { key?: string })?.key ||
  //         '') as string;
  //     })
  //     .filter((n): n is string => Boolean(n));

  //   plugins = plugins.filter((plugin) => {
  //     const currentKeyName = (plugin.spec.key as unknown as { key?: string })
  //       ?.key;
  //     if (!currentKeyName) return true;
  //     return !targetNames.some((name) => currentKeyName.startsWith(name));
  //   });

  //   if (prevPlugins.length === plugins.length) {
  //     // No plugin was removed, so we don’t need to update the state
  //     return undefined;
  //   }

  //   const state = this.state.reconfigure({
  //     plugins,
  //   });

  //   this.view.updateState(state);

  //   return state;
  // }
}
