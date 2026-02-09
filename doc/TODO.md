

[ ] 扩展目录改为大写? 或者驼峰
[ ] 每个扩展, 个性化的样式, 移到对应的扩展内(参考 image)
[ ] 加粗、删除线、下划线...
[ ] prosemirror-gapcursor 遇到表格光标有概率会落在表格前后
[ ] 下面 md 转换会多出一个 task list
```text
4. 接下来不将整个逻辑串起来, 交互细节如下:
- 用户输入内容后, 点击发送按钮
- 会将用户输入消息存储起来, 同时调用 `DeepSeek` 接口 
- 调用 `DeepSeek` 期间, 用户将会有一个提示
```
[ ] 主题设计: 亮色、暗色
[ ] 代码块:
  - diff 没有主题色
  - 横向滚动条, hover 有个很明显的白色滚动条

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
