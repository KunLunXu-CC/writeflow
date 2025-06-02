import { Schema } from 'prosemirror-model';
import { history } from 'prosemirror-history';
import { tablePlugins } from '@/components/Editor/tableBlock';
import buildKeymap from '@/components/Editor/plugins/buildKeymap';
import customInputRules from '@/components/Editor/plugins/buildInputRules';

const buildPlugins = (schema: Schema) => {
  return [history(), customInputRules, ...buildKeymap(schema), ...tablePlugins];
};

export default buildPlugins;
