import { CodeBlockView } from '@/components/Editor/nodeViews/codeBlock';

const nodeViews = {
  code_block: (node, view, getPos) => new CodeBlockView(node, view, getPos),
};

export default nodeViews;
