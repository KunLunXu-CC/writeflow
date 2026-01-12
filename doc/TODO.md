

[ ] 扩展目录改为大写? 或者驼峰
[ ] 每个扩展, 个性化的样式, 移到对应的扩展内(参考 image)
[ ] 加粗、删除线、下划线...
[ ] `` 语法
[ ] 表格内, list 样式
[ ] 表头 hover 拖拽样式
[ ] 表格合并单元格后, 无法取消合并

## base 扩展

- com + enter 向下换行
- com + shift + enter 向上换行

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

