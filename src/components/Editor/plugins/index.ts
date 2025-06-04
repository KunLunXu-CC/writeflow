import { history } from 'prosemirror-history';
import { tablePlugins } from '@/components/Editor/extension/tableBlock';
import buildKeymap from '@/components/Editor/plugins/buildKeymap';
import customInputRules from '@/components/Editor/plugins/buildInputRules';

const plugins = [...buildKeymap, ...tablePlugins, history(), customInputRules];

export default plugins;
