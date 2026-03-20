

[ ] 扩展目录改为大写? 或者驼峰
[ ] 每个扩展, 个性化的样式, 移到对应的扩展内(参考 image)
[ ] 加粗、删除线、下划线...
[ ] prosemirror-gapcursor 遇到表格光标有概率会落在表格前后
[ ] 复制内容为 MD
[ ] 插入图片, 光标不要默认选择当前
[ ] 插入 ---, , 光标不要默认选择当前, 而且选择时光标在上方
[ ] 插入链接后, 希望链接前后如果有内容, 需要给个横向间距
[ ] 不同插件设置不同 placeholder
[ ] 内容一开始就是标题，按删除键删除不了, 非开始可以, 需要看下其他的行不行

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


## 图标

直接 iconfont 找
https://www.iconfont.cn/manage/index?manage_type=myprojects&projectId=5034983
