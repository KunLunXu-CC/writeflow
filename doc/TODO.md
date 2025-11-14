

[ ] 扩展目录改为大写? 或者驼峰
[ ] 命令的调用报错了, 提示 insertParagraphBelow 需要一个参数

```js
addKeymap: ({ writeFlow }) => {
    return {
      'Mod-Enter': () => writeFlow.commands.insertParagraphBelow(), // Ctrl/Cmd + Enter: 在下方插入段落
      'Mod-Shift-Enter': () => writeFlow.commands.insertParagraphAbove(), // Ctrl/Cmd + Shift + Enter: 在上方插入段落
    };
  },
```

## base 扩展

- com + enter 向下换行
- com + shift + enter 向上换行
- writeFlow.state 获取, 现在的 state 并不是实时的？直接用有问题?
- writeFlow.dispatch, 现在的 dispatch 并不是实时的？直接用有问题?

## 表格扩展

> 自定义了 node:  https://codesandbox.io/p/sandbox/prosemirror-table-c5nkc?file=%2Fsrc%2Findex.js%3A109%2C1
> 单元格加了下拉菜单: https://codesandbox.io/p/sandbox/react-prosemirror-forked-ksco4l?file=%2Fsrc%2FApp.js
> 可拖拽排序: https://github.com/docmost/docmost/issues/463
> https://discuss.prosemirror.net/t/prosemirrot-tables-click-to-show-controls/7952?utm_source=chatgpt.com

- 表格删除(行、列)
- 表格插入(行、列)
- 表格合并(行、列)

## 主题

- 通过 stylelint 的 selector-class-pattern 限制 class
- 定义主题变量, 需要考虑基于 css 变量(颜色需要支持透明度计算)

