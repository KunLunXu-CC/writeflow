import { Node } from '@kunlunxu/wf-core';
import { baseTableNodes } from '.';
import { NodeSpec } from 'prosemirror-model';

export const TableHeader = Node.create({
  name: 'table_header',

  addSchema: (): NodeSpec => baseTableNodes.table_header,
});
