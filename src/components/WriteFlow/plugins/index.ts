import { history } from 'prosemirror-history';
import customInputRules from '@/components/WriteFlow/plugins/buildInputRules';

const plugins = [history(), customInputRules];

export default plugins;
