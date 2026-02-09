import { InputRule } from 'prosemirror-inputrules';
import { MarkSpec, MarkType } from 'prosemirror-model';
import { buildClickPlugin } from './buildClickPlugin';
import { marks as basicMarks } from 'prosemirror-schema-basic';
import { Mark } from '@/components/WriteFlow/core/Mark';

import './index.scss';

console.log('%c [ basicMarks ]-8', 'font-size:13px; background:pink; color:#bf2c9f;', basicMarks);

const inputRegex = /\[(?<title>[^\]]+)\]\((?<href>https?:\/\/[^\s)]+)(?: "([^"]+)")?\)$/;

export const Link = Mark.create({
  name: 'link',

  addPlugins: () => [buildClickPlugin()],

  addSchema: (): MarkSpec => ({
    attrs: {
      href: {
        validate: 'string',
      },
      title: {
        default: null,
        validate: 'string|null',
      },
    },
    inclusive: false,
    toDOM: ({ attrs }) => [
      'a',
      {
        ...attrs,
        class: 'wf-link',
      },
      0,
    ],
    parseDOM: [
      {
        tag: 'a[href]',
        getAttrs: (dom) => {
          const href = dom.getAttribute('href');
          const title = dom.getAttribute('title');
          return { href, title };
        },
      },
    ],
  }),

  // 返回 InputRule 对象 { find, handler }[] 的数组
  addInputRules: ({ type }) => [
    new InputRule(inputRegex, (state, match, start, end) => {
      const { tr } = state;
      const linkMark = type as MarkType; // 使用 link mark

      if (linkMark) {
        tr.delete(start, end); // 删除整个匹配的链接文本

        const { title, href } = (match as any).groups;

        // 插入链接文本并添加 link mark
        const linkTextStart = tr.selection.from;
        tr.insertText(title, linkTextStart);
        tr.addMark(linkTextStart, linkTextStart + title.length, linkMark.create({ href }));
        tr.removeStoredMark(linkMark); // 移除 storedMark
      }

      return tr;
    }),
  ],
});
