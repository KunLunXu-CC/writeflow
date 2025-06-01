import { Schema } from 'prosemirror-model';
import { history } from 'prosemirror-history';
import buildKeymap from '@/components/Editor/plugins/buildKeymap';
import buildInputRules from '@/components/Editor/plugins/buildInputRules';
import { columnResizing, tableEditing } from 'prosemirror-tables';

const buildPlugins = (schema: Schema) => {
  return [history(), buildInputRules(schema), ...buildKeymap(schema), columnResizing(), tableEditing()];
};

export default buildPlugins;
