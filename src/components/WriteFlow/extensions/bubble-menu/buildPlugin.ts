import { createPluginKey } from '../../helpers/createPluginKey';
import { BubbleMenuPluginView, BubbleMenuPluginViewParams } from './PluginView';

import { Plugin, PluginKey } from 'prosemirror-state';

interface BuildBubbleMenuPluginParams extends Omit<BubbleMenuPluginViewParams, 'view'> {
  pluginKey?: PluginKey | string;
}

export const buildBubbleMenuPlugin = (params: BuildBubbleMenuPluginParams) => {
  const { element, pluginKey = 'bubbleMenu', options } = params;
  if (!params.element) {
    throw new Error('element is required');
  }

  return new Plugin({
    key: createPluginKey(pluginKey),
    view: (view) => new BubbleMenuPluginView({ view, element, options }),
  });
};
