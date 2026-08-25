import { Schema, type MarkSpec, type NodeSpec } from 'prosemirror-model';

const nodes: Record<string, NodeSpec> = {
  doc: {
    content: 'block+',
  },
  text: {
    group: 'inline',
  },
  paragraph: {
    content: 'inline*',
    group: 'block',
  },
  heading: {
    attrs: {
      level: { default: 1 },
    },
    content: 'inline*',
    defining: true,
    group: 'block',
  },
  blockquote: {
    content: 'block+',
    defining: true,
    group: 'block',
  },
  horizontal_rule: {
    atom: true,
    group: 'block',
  },
  bullet_list: {
    content: 'list_item+',
    group: 'block',
  },
  ordered_list: {
    attrs: {
      order: { default: 1 },
    },
    content: 'list_item+',
    group: 'block',
  },
  list_item: {
    content: 'paragraph block*',
    defining: true,
  },
  task_list: {
    content: 'task_item+',
    group: 'block',
  },
  task_item: {
    attrs: {
      checked: { default: false },
    },
    content: 'paragraph block*',
    defining: true,
  },
  table: {
    content: 'table_row+',
    group: 'block',
    isolating: true,
    tableRole: 'table',
  },
  table_row: {
    content: '(table_cell | table_header)*',
    tableRole: 'row',
  },
  table_cell: {
    attrs: {
      colspan: { default: 1 },
      rowspan: { default: 1 },
      colwidth: { default: null },
    },
    content: 'block+',
    isolating: true,
    tableRole: 'cell',
  },
  table_header: {
    attrs: {
      colspan: { default: 1 },
      rowspan: { default: 1 },
      colwidth: { default: null },
    },
    content: 'block+',
    isolating: true,
    tableRole: 'header_cell',
  },
  code_block: {
    attrs: {
      language: { default: null },
    },
    code: true,
    content: 'text*',
    defining: true,
    group: 'block',
    marks: '',
  },
  hard_break: {
    group: 'inline',
    inline: true,
    selectable: false,
  },
  image: {
    attrs: {
      status: { default: null },
      uploadId: { default: null },
      src: { default: null },
      alt: { default: null },
      title: { default: null },
    },
    group: 'block',
  },
};

const marks: Record<string, MarkSpec> = {
  inline_code: {
    code: true,
    excludes: '_',
    inclusive: false,
  },
  link: {
    attrs: {
      href: {},
      title: { default: null },
    },
    inclusive: false,
  },
};

/** 创建不依赖 DOM 和样式资源的 Markdown 转换 Schema。 */
export const createWriteFlowMarkdownSchema = () => new Schema({ nodes, marks });

/** 服务端 Markdown 转换默认使用的 Schema。 */
export const writeFlowMarkdownSchema = createWriteFlowMarkdownSchema();
