import { Node } from '@/components/WriteFlow/core/Node';

export const TableCell = Node.create({
  name: 'tableCell',

  // 决定了如果渲染节点, 比如: 渲染 heading 节点时, 会渲染成 <h1> 标签
  // 用于往 schema 中注册节点, 会根据 this.name 注册成对应的节点
  getSchema() {
    return {
      content: 'block+',

      tableRole: 'cell',

      isolating: true,

      toDOM() {
        return ['td', {}, 0];
      },
    };
  },
});
