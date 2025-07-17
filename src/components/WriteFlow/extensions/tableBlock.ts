import { NodeSpec } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';
import { InputRule } from 'prosemirror-inputrules';
import { columnResizing, tableEditing } from 'prosemirror-tables';
import { tableNodes as tableNodesOriginal } from 'prosemirror-tables';
import mySchema from '@/components/WriteFlow/schema';

const ROW_COUNT_INPUT_RULE = 2;
const COL_COUNT_INPUT_RULE = 3;

// 表格插件
export const tablePlugins = [columnResizing(), tableEditing()];

const getStylesFromElement = (elem: HTMLElement) => {
  const tr = elem.parentElement;
  const tbody = tr?.parentElement;
  const table = tbody?.parentElement;
  const div = table?.parentElement;
  const styles = div?.querySelectorAll('style');
  let classDeclaration = '';

  Array.from(styles || []).forEach((style) => {
    const regex = new RegExp(`.${elem.className}\\s*{([^}]+)}`, 'i');
    const match = (style as HTMLStyleElement).innerHTML.match(regex);
    if (match) {
      classDeclaration = match[1];
    }
  });
  const definitions: Record<string, string> = {};
  classDeclaration.split('\n').forEach((line) => {
    const [, name, value] = line.match(/([^:]+): ?([^;]+)/) || [];
    definitions[name.trim()] = value.trim();
  });
  return definitions;
};

// 表格输入规则, 将一个以 |- 开头的文本块转换为表格
export const tableInputRule = new InputRule(
  /^\|-\s$/,
  (state, match, start, end) => {
    const cellNodes = Array.from(
      { length: COL_COUNT_INPUT_RULE },
      () => mySchema.nodes.table_cell.createAndFill()!,
    );

    const rowNodes = Array.from(
      { length: ROW_COUNT_INPUT_RULE },
      () => mySchema.nodes.table_row.createAndFill(null, cellNodes)!,
    );

    const tableNode = mySchema.nodes.table.createAndFill(null, rowNodes)!;
    const tr = state.tr.delete(start, end).replaceSelectionWith(tableNode);
    return tr.setSelection(TextSelection.create(tr.doc, start));
  },
);

// 表格节点
export const tableNodes: Record<string, NodeSpec> = tableNodesOriginal({
  tableGroup: 'block',
  cellContent: 'block+',
  cellAttributes: {
    background: {
      default: null,
      getFromDOM(dom) {
        const style = getStylesFromElement(dom);
        return (
          style.background ||
          style.backgroundColor ||
          dom.style.backgroundColor ||
          null
        );
      },
      setDOMAttr(value, attrs) {
        if (value) {
          attrs.style = (attrs.style || '') + `background-color: ${value};`;
        }
      },
    },
  },
});
