import { AnyExtension, AnyExtensionConfig } from '../types';

/**
 * 获取扩展的配置项
 * @param extension 扩展
 * @param field 配置项
 * @returns 配置项的值
 */
export function getExtensionField<K extends keyof AnyExtensionConfig>(
  extension: AnyExtension,
  field: K,
): AnyExtensionConfig[K] | undefined {
  if (extension.config === undefined) {
    return undefined;
  }

  return extension.config[field];
}
