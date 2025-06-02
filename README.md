This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## TODO

- 列表 TAB 快捷键实现, https://codesandbox.io/p/sandbox/wizardly-nova-t9mzsm
- checkbox

https：//github.com/ocavue/rino/blob/5136c00f17365ebd8d8f43c45a627780401b1476/packages/web/src/editor/extensions/list/list-extension.ts#L199
https://github.com/ProseMirror/prosemirror-markdown/issues/42
```js
public inputRules({ type }: ExtensionManagerNodeTypeParams) {
    return [
        new InputRule(/^\[([ |x])\] $/, function (state: EditorState, match, start, end) {
            const $from = state.selection.$from
            if (
                $from.depth >= 3 &&
                $from.node(-1).type.name === "rinoListItem" &&
                $from.node(-2).type.name === "rinoBulletList" &&
                $from.index(-1) === 0 // The cursor is at the first child (paragraph) of this list item.
            ) {
                const attrs = { checked: match[1] === "x" }
                const listItemPos = $from.before(-1)
                return state.tr.delete(start, end).insert(listItemPos + 1, type.create(attrs))
            }
            return null
        }),
    ]
}
```

- 行内代码块

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
