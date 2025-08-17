import { Node } from '@/components/WriteFlow/core/Node';

export const TableRow = Node.create({
  name: 'tableRow',

  // 决定了如果渲染节点, 比如: 渲染 heading 节点时, 会渲染成 <h1> 标签
  // 用于往 schema 中注册节点, 会根据 this.name 注册成对应的节点
  addSchema() {
    return {
      content: '(tableCell | tableHeader)*',
      tableRole: 'row',

      toDOM() {
        return ['tr', {}, 0];
      },
    };
  },
});
