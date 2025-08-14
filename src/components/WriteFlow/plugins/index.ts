import { history } from 'prosemirror-history';
import { tablePlugins } from '@/components/WriteFlow/extensions/tmp/tableBlock';
import buildKeymap from '@/components/WriteFlow/plugins/buildKeymap';
import customInputRules from '@/components/WriteFlow/plugins/buildInputRules';

const plugins = [...buildKeymap, ...tablePlugins, history(), customInputRules];

export default plugins;
