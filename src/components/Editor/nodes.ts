import { nodes } from 'prosemirror-schema-basic';
import { orderedList, bulletList, listItem } from 'prosemirror-schema-list';
import { tableNodes } from 'prosemirror-tables';

const listNodes = {
  ordered_list: {
    ...orderedList,
    content: 'list_item+',
    group: 'block',
  },
  bullet_list: {
    ...bulletList,
    content: 'list_item+',
    group: 'block',
  },
  list_item: {
    ...listItem,
    content: 'paragraph block*',
  },
};

function getStylesFromElement(elem: HTMLElement) {
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
}

const customNodes = {
  ...nodes,
  ...listNodes,
  ...tableNodes({
    tableGroup: 'block',
    cellContent: 'block+',
    cellAttributes: {
      background: {
        default: null,
        getFromDOM(dom) {
          const style = getStylesFromElement(dom);
          return style.background || style.backgroundColor || dom.style.backgroundColor || null;
        },
        setDOMAttr(value, attrs) {
          if (value) {
            attrs.style = (attrs.style || '') + `background-color: ${value};`;
          }
        },
      },
    },
  }),
};

export default customNodes;
