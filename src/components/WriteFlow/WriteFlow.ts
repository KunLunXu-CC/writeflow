import { EditorView } from 'prosemirror-view';
import { WriteFlowOptions } from './types';
import { EditorState } from 'prosemirror-state';
import { DOMParser } from 'prosemirror-model';
import ExtensionManager from './core/ExtensionManager';

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

  /**
   * 创建 PM 视图。
   */
  private createView(el: WriteFlowOptions['element']) {
    this.view = new EditorView(el, {
      nodeViews: {
        // code_block: codeBlockNodeView,
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

    this.state = EditorState.create({
      plugins,
      doc: DOMParser.fromSchema(schema).parse(document.createElement('div')),
    });

    return this.state;
  }

  private setOptions(options: WriteFlowOptions) {
    this.options = {
      ...options,
    };
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
   * 将编辑器附加到 DOM, 最终创建一个新的编辑器视图(view)
   */
  private mount(el: WriteFlowOptions['element']) {
    if (typeof document === 'undefined') {
      throw new Error(
        '[WriteFlow error]: 无法挂载编辑器, 因为在此环境中没有定义挂载点(element)。',
      );
    }
    this.createView(el);
  }
}
