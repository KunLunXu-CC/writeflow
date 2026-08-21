# @kunlunxu/wf-extension-table

提供表格、表格行、普通单元格、表头单元格，以及表格选择、列宽调整、行列锚点和结构编辑命令。

## 注册

必须注册完整的表格节点集合：

```ts
import { Table, TableCell, TableHeader, TableRow } from '@kunlunxu/wf-extension-table';

const extensions = [Table, TableRow, TableCell, TableHeader];
```

单元格内容规则是 `block+`，因此还需要至少一个可用的文本块节点，通常是 `Paragraph`。

## 输入规则

在空文本块开头输入：

```text
|- 空格
```

会插入固定的两行三列表格。当前没有可配置行列数量的 `insertTable` command。

## 可视交互

- 鼠标悬停表格时，顶部显示列锚点，左侧显示行锚点。
- 点击顶部锚点长条可选择整列。
- 点击左侧锚点长条可选择整行。
- 点击锚点交界处的圆形 `+` 可在对应位置新增行或列。
- 拖动单元格右侧 resize handle 可调整列宽，默认最小展示宽度为 `100px`。
- 表格插件支持鼠标拖动跨单元格选择、`Shift` 点击扩展单元格选择和表格内容复制粘贴。

当前锚点 UI 只支持选择和新增，没有删除、合并、拆分按钮。

## Commands

| 命令                         | 行为                                          |
| ---------------------------- | --------------------------------------------- |
| `splitTableCell()`           | 拆分当前已合并且具有 rowspan/colspan 的单元格 |
| `mergeTableCells()`          | 合并矩形 CellSelection 中的单元格             |
| `addTableRowBefore()`        | 在当前选区所在行之前插入行                    |
| `addTableRowAfter()`         | 在当前选区所在行之后插入行                    |
| `addTableColumnBefore()`     | 在当前选区所在列之前插入列                    |
| `addTableColumnAfter()`      | 在当前选区所在列之后插入列                    |
| `deleteTableRow()`           | 删除当前行或选中的多行                        |
| `deleteTableColumn()`        | 删除当前列或选中的多列                        |
| `selectTableCells(options?)` | 选择当前单元格、指定单元格、整行或整列        |

### 删除行列

光标在目标单元格中时可直接调用：

```ts
writeFlow.commands.deleteTableRow();
writeFlow.commands.deleteTableColumn();
```

先点击锚点选择整行/整列再调用时，会删除对应结构；选中多行或多列时会批量删除。

底层命令不允许删除表格的全部行或全部列。如果只剩最后一行或最后一列，命令会返回 `false`。本包当前没有公开 `deleteTable()` 命令。

### 按索引选择

```ts
// 当前表格的指定行
writeFlow.commands.selectTableCells({ rowIndex: 1 });

// 当前表格的指定列
writeFlow.commands.selectTableCells({ colIndex: 2 });

// 指定单元格
writeFlow.commands.selectTableCells({ rowIndex: 1, colIndex: 2 });

// 没有参数时选择光标所在单元格
writeFlow.commands.selectTableCells();
```

索引超出范围时会被约束到最近的有效行或列。NodeView 内部还会传 `tablePos`，用于在页面有多张表时定位指定表格。

## Helpers

```ts
const cells = writeFlow.helpers.getTableSelectedCells();
```

仅当当前选区是 `CellSelection` 时返回 `{ node, pos }[]`；普通文本选区返回空数组。

## 快捷键

### 扩展显式注册

| 快捷键                         | 行为                                 |
| ------------------------------ | ------------------------------------ |
| `Tab`                          | 移动到下一个单元格                   |
| `Shift-Tab`                    | 移动到上一个单元格                   |
| `Backspace` / `Delete`         | 选中空的整行或整列时，删除对应行或列 |
| `Mod-Backspace` / `Mod-Delete` | 与普通删除键行为相同                 |

到达最后一个单元格后，`Tab` 不会自动新增行，也没有专门退出表格的逻辑；命令返回 `false` 后可能进入浏览器默认焦点行为。

### `tableEditing` 插件行为

| 快捷键                          | 行为                                                                     |
| ------------------------------- | ------------------------------------------------------------------------ |
| `ArrowLeft` / `ArrowRight`      | 在单元格边界间移动；普通文本内部仍是字符移动                             |
| `ArrowUp` / `ArrowDown`         | 在上下单元格间移动；从第一行向上或最后一行向下时尝试移动到表格外的相邻块 |
| `Shift-ArrowLeft/Right/Up/Down` | 在单元格边界从当前单元格向对应方向扩展 CellSelection                     |
| `Backspace`                     | 扩展未删除空行列时，清空选中单元格的内容                                 |
| `Mod-Backspace`                 | 扩展未删除空行列时，清空选中单元格的内容                                 |
| `Delete`                        | 扩展未删除空行列时，清空选中单元格的内容                                 |
| `Mod-Delete`                    | 扩展未删除空行列时，清空选中单元格的内容                                 |

删除键按以下顺序处理：

1. 选中整张表、整行或整列时，只有选区内每个单元格都只包含一个空文本块，才会删除对应结构。
2. 空的整表选区会删除整张表，空的整行或整列选区会删除对应行或列。
3. 删除行或列后取消结构选中，并将文本光标移动到删除位置处的相邻单元格；删除末尾结构时回退到前一个单元格。
4. 非空的整行或整列、普通 CellSelection 继续由 `tableEditing` 清空单元格内容。
5. 普通单元格文本光标仍使用 core 的基础删除行为。

图片等非文本节点不视为空内容。当表格仅剩一行或一列时，选中该空行或空列也等同于选中空的整张表，删除时会直接移除表格，并将光标移动到表格原位置附近的可编辑内容。

## 换行与退出表格

- 单元格内按 `Enter` 由 core 拆分当前文本块，会在同一个单元格中创建新段落，不新增表格行。
- 注册 `HardBreak` 后，`Shift-Enter` 会在当前单元格段落内插入硬换行。
- `ArrowUp` / `ArrowDown` 在表格顶部或底部会尝试移动到表格外已有的相邻块。
- 如果表格位于文档末尾且后面没有可编辑块，本包不会自动创建尾随段落，当前没有稳定的专属“退出表格”快捷键。
- `Paragraph` 的 `Mod-Enter` 按当前最内层深度插入段落，在单元格中调用通常只会新增单元格内部段落，不等同于退出整张表。

## 当前限制

- 没有公开 `insertTable()`、`deleteTable()`、移动行列、切换表头或设置单元格属性的 command。
- 删除行列、合并和拆分虽然有 command，但没有内置 UI 入口。
- 最后一个单元格按 `Tab` 不会自动创建新行。
- 文档末尾的表格缺少自动创建尾随段落的退出行为。
