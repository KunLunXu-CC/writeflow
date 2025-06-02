import { NodeSpec } from 'prosemirror-model';
import { tableNodes as tableNodesOriginal } from 'prosemirror-tables';
import { columnResizing, tableEditing } from 'prosemirror-tables';

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

// let schema = new Schema({
//   nodes: markdownSchema.spec.nodes.append(tableNodes({
//     tableGroup: "block",
//     cellContent: "block+",
//     cellAttributes: {
//       background: {
//         default: null,
//         getFromDOM(dom) { return dom.style.backgroundColor || null },
//         setDOMAttr(value, attrs) { if (value) attrs.style = (attrs.style || "") + `background-color: ${value};` }
//       }
//     }
//   })),
//   marks: markdownSchema.spec.marks
// })
