import { Schema } from 'prosemirror-model';
import { history } from 'prosemirror-history';
import { tablePlugins } from '@/components/Editor/tableBlock';
import buildKeymap from '@/components/Editor/plugins/buildKeymap';
import buildInputRules from '@/components/Editor/plugins/buildInputRules';

const buildPlugins = (schema: Schema) => {
  return [history(), buildInputRules(schema), ...buildKeymap(schema), ...tablePlugins];
};

export default buildPlugins;
