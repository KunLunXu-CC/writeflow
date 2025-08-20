import { tableNodes } from 'prosemirror-tables';

export * from './cell';
export * from './header';
export * from './row';
export * from './table';

export const baseTableNodes = tableNodes({
  tableGroup: 'block',
  cellContent: 'block+',
  cellAttributes: {
    background: {
      default: null,
      getFromDOM(dom) {
        return (dom.style && dom.style.backgroundColor) || null;
      },
      setDOMAttr(value, attrs) {
        if (value)
          attrs.style = (attrs.style || '') + `background-color: ${value};`;
      },
    },
  },
});
