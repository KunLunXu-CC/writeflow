import { EditorView } from 'prosemirror-view';
import { DOMParser } from 'prosemirror-model';
import { EditorState, Plugin } from 'prosemirror-state';
import { AnyCommands, AnyHelpers, WriteFlowOptions, WFEvents } from '../types';
import ExtensionManager from './ExtensionManager';
import { EventEmitter } from './EventEmitter';

export class WriteFlow extends EventEmitter<WFEvents> {
  private options!: WriteFlowOptions;

  private extensionManager!: ExtensionManager;

  public view!: EditorView;

  constructor(options: WriteFlowOptions) {
    super();
    this.setOptions(options);
    this.createExtensionManager();
    // this.createCommandManager();

    this.mount(options.element);
  }

  private setOptions = (options: WriteFlowOptions) => {
    this.options = {
      ...options,
    };
  };

  /**
   * 将编辑器附加到 DOM, 最终创建一个新的编辑器视图(view)
   */
  private mount = (el: WriteFlowOptions['element']) => {
    if (typeof el === 'undefined') {
      throw new Error('[WriteFlow error]: 无法挂载编辑器, 因为在此环境中没有定义挂载点(element)。');
    }
    this.createView(el);
  };

  /**
   * 创建 PM 视图。
   */
  private createView = (el: WriteFlowOptions['element']) => {
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
  };

  /**
   * 创建编辑器状态
   */
  private createState = (): EditorState => {
    const plugins = this.extensionManager.plugins;
    const schema = this.extensionManager.schema;

    if (!plugins || !schema) {
      throw new Error(
        '[WriteFlow error]: 无法创建编辑器状态, 因为在此环境中没有定义插件(plugins)或模式(schema)。',
      );
    }

    return EditorState.create({
      plugins,
      doc: DOMParser.fromSchema(schema).parse(document.createElement('div')),
    });
  };

  // private createCommandManager() {
  //   this.commandManager = new CommandManager();
  // }

  private createExtensionManager = () => {
    this.extensionManager = new ExtensionManager(this.options.extensions || [], this);
  };

  /**
   * 注册 PM 插件
   *
   * @param plugin PM 插件
   * @param handlePlugins 控制如何将插件合并到现有插件中, 可二次处理、过滤插件
   * @returns 新的编辑器状态
   */
  public registerPlugin = (
    plugin: Plugin,
    handlePlugins?: (newPlugin: Plugin, plugins: Plugin[]) => Plugin[],
  ): EditorState => {
    if (!this.view) {
      throw new Error('[WriteFlow error]: no view.');
    }

    const plugins = handlePlugins?.(plugin, [...this.state.plugins]) ?? [
      ...this.state.plugins,
      plugin,
    ];

    const newState = this.state.reconfigure({ plugins });

    this.view.updateState(newState);

    return newState;
  };

  /**
   * 注销 PM 插件
   *
   * @param plugin PM 插件
   * @returns 新的编辑器状态
   */
  public unregisterPlugin = (plugin: Plugin): EditorState => {
    if (!this.view) {
      throw new Error('[WriteFlow error]: no view.');
    }

    const plugins = this.state.plugins.filter((p) => p !== plugin);

    const newState = this.state.reconfigure({ plugins });

    this.view.updateState(newState);

    return newState;
  };

  // #region get doc
  public getJSON = () => {
    return this.state.doc.toJSON();
  };
  // #endregion

  // #region Getters
  public get helpers(): AnyHelpers {
    return this.extensionManager.helpers;
  }

  public get commands(): AnyCommands {
    return this.extensionManager.commands;
  }

  public get state(): EditorState {
    return this.view.state;
  }

  public get schema(): EditorState['schema'] {
    return this.state.schema;
  }

  public get dispatch(): EditorView['dispatch'] {
    return this.view.dispatch;
  }

  // #endregion
}
