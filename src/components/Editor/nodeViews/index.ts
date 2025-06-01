import { NodeViewConstructor } from 'prosemirror-view';
import { codeBlockNodeView } from '@/components/Editor/nodeViews/codeBlock';

const nodeViews: { [node: string]: NodeViewConstructor } = {
  code_block: codeBlockNodeView,
};

export default nodeViews;
