import { Plugin, TextSelection } from 'prosemirror-state';
import {
  WriteFlow,
  InputRuleFinder,
  InputRuleHandler,
  ExtendedRegExpMatchArray,
} from '../types';
import { getTextContentFromNodes } from '../helpers/getTextContentFromNodes';
import { isRegExp } from '../helpers/isRegExp';

export class InputRule {
  find: InputRuleFinder;
  handler: InputRuleHandler;

  constructor(config: { find: InputRuleFinder; handler: InputRuleHandler }) {
    this.find = config.find;
    this.handler = config.handler;
  }
}

const inputRuleMatcherHandler = (
  text: string,
  find: InputRuleFinder,
): ExtendedRegExpMatchArray | null => {
  if (isRegExp(find)) {
    return (find as RegExp).exec(text);
  }

  const inputRuleMatch = find(text);

  if (!inputRuleMatch) {
    return null;
  }

  const result: ExtendedRegExpMatchArray = [inputRuleMatch.text];

  result.index = inputRuleMatch.index;
  result.input = text;
  result.data = inputRuleMatch.data;

  if (inputRuleMatch.replaceWith) {
    if (!inputRuleMatch.text.includes(inputRuleMatch.replaceWith)) {
      console.warn(
        '[tiptap warn]: "inputRuleMatch.replaceWith" must be part of "inputRuleMatch.text".',
      );
    }

    result.push(inputRuleMatch.replaceWith);
  }

  return result;
};

const runInputRule = (config: {
  writeFlow: WriteFlow;
  from: number;
  to: number;
  text: string;
  inputRules: InputRule[];
  plugin: Plugin;
}): boolean => {
  const { writeFlow, from, to, text, inputRules, plugin } = config;
  const { view } = writeFlow;
  if (!view) {
    return false;
  }

  /**
    Holds `true` when a
    [composition](https://w3c.github.io/uievents/#events-compositionevents)
    is active.
  */
  if (view.composing) {
    return false;
  }

  const $from = view.state.doc.resolve(from);

  if (
    // check for code node
    $from.parent.type.spec.code ||
    // check for code mark
    !!($from.nodeBefore || $from.nodeAfter)?.marks.find(
      (mark) => mark.type.spec.code,
    )
  ) {
    return false;
  }

  let matched = false;

  const textBefore = getTextContentFromNodes($from) + text;

  inputRules.forEach((rule) => {
    if (matched) {
      return;
    }

    const match = inputRuleMatcherHandler(textBefore, rule.find);

    if (!match) {
      return;
    }

    // const tr = view.state.tr;

    // TODO: 可链式调用
    // const state = createChainableState({
    //   state: view.state,
    //   transaction: tr,
    // });
    const range = {
      from: from - (match[0].length - text.length),
      to,
    };

    // const { commands, chain, can } = new CommandManager({
    //   editor,
    //   state,
    // });

    const handlerTr = rule.handler({
      state: view.state,
      range,
      match,
    });

    // stop if there are no changes
    if (!handlerTr || !handlerTr.steps.length) {
      return;
    }

    // store transform as meta data
    // so we can undo input rules within the `undoInputRules` command
    handlerTr.setMeta(plugin, {
      transform: handlerTr,
      from,
      to,
      text,
    });

    view.dispatch(handlerTr);

    matched = true;
  });

  return matched;
};

/**
 * 创建一个输入规则插件。当启用时，它将产生文本
 * 匹配任何给定规则的输入，以触发规则的行动。
 * 参考文档: https://prosemirror.net/docs/ref/#inputrules
 */
export const inputRulesPlugin = (props: {
  writeFlow: WriteFlow;
  inputRules: InputRule[];
}): Plugin => {
  const { writeFlow, inputRules } = props;

  const plugin = new Plugin({
    state: {
      init() {
        return null;
      },
      // apply(tr, prev, state)
      apply(tr, prev) {
        return tr.selectionSet || tr.docChanged ? null : prev;
      },
    },

    props: {
      handleTextInput(view, from, to, text) {
        return runInputRule({
          writeFlow,
          from,
          to,
          text,
          plugin,
          inputRules,
        });
      },

      handleDOMEvents: {
        compositionend: (view) => {
          setTimeout(() => {
            const { $cursor } = view.state.selection as TextSelection;

            if ($cursor) {
              runInputRule({
                writeFlow,
                from: $cursor.pos,
                to: $cursor.pos,
                text: '',
                inputRules,
                plugin,
              });
            }
          });

          return false;
        },
      },

      // 添加对输入规则的支持，以便在输入时触发
      // 这是有用的，例如代码块
      handleKeyDown(view, event) {
        if (event.key !== 'Enter') {
          return false;
        }

        const { $cursor } = view.state.selection as TextSelection;

        if ($cursor) {
          return runInputRule({
            writeFlow,
            from: $cursor.pos,
            to: $cursor.pos,
            text: '\n',
            inputRules,
            plugin,
          });
        }

        return false;
      },
    },

    isInputRules: true,
  }) as Plugin;

  return plugin;
};
