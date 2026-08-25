import type { Node as ProseMirrorNode } from 'prosemirror-model';
import {
  defaultMarkdownSerializer,
  MarkdownSerializer,
  type MarkdownSerializerState,
} from 'prosemirror-markdown';

export interface ProseMirrorNodeToMarkdownOptions {
  node: ProseMirrorNode;
  strict?: boolean;
  tightLists?: boolean;
}

const serializeImage = (state: MarkdownSerializerState, node: ProseMirrorNode) => {
  const src = String(node.attrs.src ?? '').replace(/[()]/g, '\\$&');
  const title = node.attrs.title ? ` "${String(node.attrs.title).replace(/"/g, '\\"')}"` : '';

  state.write(`![${state.esc(String(node.attrs.alt ?? ''))}](${src}${title})`);
  state.closeBlock(node);
};

/** 创建 WriteFlow 节点对应的 Markdown 序列化器。 */
export const createWriteFlowMarkdownSerializer = (options: { strict?: boolean } = {}) => {
  const serializeTableCell = (node: ProseMirrorNode) => {
    return serializer.serialize(node).trim().replace(/\|/g, '\\|').replace(/\n+/g, ' ');
  };

  const serializer = new MarkdownSerializer(
    {
      ...defaultMarkdownSerializer.nodes,
      code_block(state, node) {
        const backtickRuns = node.textContent.match(/`{3,}/g);
        const longestRun = backtickRuns?.sort((a, b) => a.length - b.length).at(-1);
        const fence = longestRun ? `${longestRun}\`` : '```';
        const language = node.attrs.language ? String(node.attrs.language) : '';

        state.write(`${fence}${language}\n`);
        state.text(node.textContent, false);
        state.write('\n');
        state.write(fence);
        state.closeBlock(node);
      },
      horizontal_rule(state, node) {
        state.write('---');
        state.closeBlock(node);
      },
      bullet_list(state, node) {
        state.renderList(node, '  ', () => '- ');
      },
      task_list(state, node) {
        state.renderList(node, '      ', (index) => {
          return `- [${node.child(index).attrs.checked ? 'x' : ' '}] `;
        });
      },
      task_item(state, node) {
        state.renderContent(node);
      },
      image: serializeImage,
      table(state, node) {
        const rows = Array.from({ length: node.childCount }, (_, index) => node.child(index));
        const columnCount = Math.max(1, ...rows.map((row) => row.childCount));
        const renderRow = (row: ProseMirrorNode) => {
          const cells = Array.from({ length: columnCount }, (_, index) => {
            return index < row.childCount ? serializeTableCell(row.child(index)) : '';
          });

          state.write(`| ${cells.join(' | ')} |\n`);
        };

        if (rows.length === 0) {
          state.write('|  |\n| --- |');
          state.closeBlock(node);
          return;
        }

        renderRow(rows[0]);
        state.write(`| ${Array.from({ length: columnCount }, () => '---').join(' | ')} |\n`);
        rows.slice(1).forEach(renderRow);
        state.closeBlock(node);
      },
      table_row() {},
      table_header() {},
      table_cell() {},
    },
    {
      ...defaultMarkdownSerializer.marks,
      inline_code: defaultMarkdownSerializer.marks.code,
    },
    {
      strict: options.strict ?? true,
    },
  );

  return serializer;
};

/** 默认使用严格模式，遇到未知节点或 mark 时抛出错误。 */
export const writeFlowMarkdownSerializer = createWriteFlowMarkdownSerializer();

const lenientWriteFlowMarkdownSerializer = createWriteFlowMarkdownSerializer({ strict: false });

/** 将 ProseMirror 文档节点转换为 Markdown。 */
export const proseMirrorNodeToMarkdown = ({
  node,
  strict = true,
  tightLists,
}: ProseMirrorNodeToMarkdownOptions) => {
  const serializer = strict ? writeFlowMarkdownSerializer : lenientWriteFlowMarkdownSerializer;

  return serializer.serialize(node, { tightLists });
};
