import { EXTENSIONS_TYPE } from '@/components/WriteFlow/types';
import {
  Extendable,
  ExtendableConfig,
} from '@/components/WriteFlow/core/Extendable';

export interface MarkConfig<Options = unknown>
  extends ExtendableConfig<Options> {
  name: string;
}

/**
 * Mark 类用于创建自定义标记扩展。
 * @see 参考 https://tiptap.dev/api/extensions#create-a-new-extension
 */
export class Mark<Options = unknown> extends Extendable<Options> {
  type = EXTENSIONS_TYPE.MARK;

  /**
   * 创建一个新的 Mark 实例
   * @param config - 标记配置对象或返回配置对象的函数
   */
  static create<Options = unknown>(
    config: MarkConfig<Options> | (() => MarkConfig<Options>),
  ) {
    const resolvedConfig = typeof config === 'function' ? config?.() : config;
    return new Mark<Options>(resolvedConfig);
  }

  constructor(config: MarkConfig<Options>) {
    super(config);
  }
}
