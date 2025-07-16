import { EditorView } from 'prosemirror-view';
import { WriteFlowOptions } from './types';
import { EditorState } from 'prosemirror-state';
import { DOMParser } from 'prosemirror-model';
import { Schema } from 'prosemirror-model';
import { nodes } from 'prosemirror-schema-basic';
import CommandManager from './CommandManager';

export class WriteFlow {
  private options!: WriteFlowOptions;

  private commandManager!: CommandManager;

  private editorSchema!: Schema;
  private editorState!: EditorState;
  private editorView: EditorView | null = null;

  constructor(options: WriteFlowOptions) {
    this.setOptions(options);
    this.createCommandManager();
    this.mount(options.element);
  }

  private setOptions(options: WriteFlowOptions) {
    this.options = {
      ...options,
    };
  }

  private createCommandManager() {
    this.commandManager = new CommandManager();
  }

  /**
   * 将编辑器附加到 DOM, 最终创建一个新的编辑器视图(editorView)
   */
  private mount(el: WriteFlowOptions['element']) {
    if (typeof document === 'undefined') {
      throw new Error(
        '[WriteFlow error]: 无法挂载编辑器, 因为在此环境中没有定义挂载点(element)。',
      );
    }
    this.createEditorView(el);
  }

  /**
   * 创建 PM 视图。
   */
  private createEditorView(el: WriteFlowOptions['element']) {
    this.editorView = new EditorView(el, {
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
      state: this.createEditorState(),
    });

    return this.editorView;

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
  private createEditorState(): EditorState {
    this.editorState = EditorState.create({
      plugins: [],
      doc: DOMParser.fromSchema(this.createEditorSchema()).parse(
        document.createElement('div'),
      ),
    });

    return this.editorState;
  }

  /**
   * 创建编辑器模式
   */
  private createEditorSchema(): Schema {
    this.editorSchema = new Schema({
      nodes: {
        ...nodes,
        code_block: {
          ...nodes.code_block,
          attrs: {
            language: { default: null },
          },
        },
      },
      // marks: Mark,
    });

    return this.editorSchema;
  }
}
