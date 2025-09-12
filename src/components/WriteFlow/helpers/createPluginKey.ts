import { PluginKey } from 'prosemirror-state';

/**
 * 创建插件键
 * @param key - 插件键, 可以是字符串或 PluginKey 实例
 * @returns 插件键实例
 */
export const createPluginKey = (key?: string | PluginKey) => {
  if (!key) {
    throw new Error('key is required');
  }

  if (key instanceof PluginKey) {
    return key;
  }

  return new PluginKey(key);
};
