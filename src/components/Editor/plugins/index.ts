import { history } from 'prosemirror-history';
import { tablePlugins } from '@/components/Editor/tableBlock';
import buildKeymap from '@/components/Editor/plugins/buildKeymap';
import customInputRules from '@/components/Editor/plugins/buildInputRules';

const buildPlugins = () => {
  return [history(), customInputRules, buildKeymap(), ...tablePlugins];
};

export default buildPlugins;
