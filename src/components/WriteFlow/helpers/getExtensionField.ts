import { AnyExtension, RemoveThis, AnyConfig } from '../types';

/**
 * 获取扩展的配置项
 * @param extension 扩展
 * @param field 配置项
 * @returns 配置项的值
 */
export function getExtensionField<T = any, E extends AnyExtension = any>(
  extension: E,
  field: keyof AnyConfig,
): RemoveThis<T> {
  if (extension.config === undefined) {
    return (() => {}) as RemoveThis<T>;
  }

  return extension.config[
    field as keyof typeof extension.config
  ] as RemoveThis<T>;
}
