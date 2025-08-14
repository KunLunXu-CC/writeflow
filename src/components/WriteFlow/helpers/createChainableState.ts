import type { EditorState, Transaction } from 'prosemirror-state';

/**
 * 将 Transaction 和 Editor State 转换为可链式调用的状态对象
 * @param config 要创建可链式调用的状态对象的 Transaction 和 Editor State
 * @returns 可链式调用的 Editor State 对象
 */
export function createChainableState(config: {
  transaction: Transaction;
  state: EditorState;
}): EditorState {
  const { state, transaction } = config;
  let { selection } = transaction;
  let { doc } = transaction;
  let { storedMarks } = transaction;

  return {
    ...state,
    apply: state.apply.bind(state),
    applyTransaction: state.applyTransaction.bind(state),
    plugins: state.plugins,
    schema: state.schema,
    reconfigure: state.reconfigure.bind(state),
    toJSON: state.toJSON.bind(state),
    get storedMarks() {
      return storedMarks;
    },
    get selection() {
      return selection;
    },
    get doc() {
      return doc;
    },
    get tr() {
      selection = transaction.selection;
      doc = transaction.doc;
      storedMarks = transaction.storedMarks;

      return transaction;
    },
  };
}
