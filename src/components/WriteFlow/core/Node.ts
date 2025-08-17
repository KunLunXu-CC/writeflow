import { EXTENSIONS_TYPE } from '@/components/WriteFlow/types';
import {
  Extendable,
  ExtendableConfig,
} from '@/components/WriteFlow/core/Extendable';

export interface NodeConfig<Options = unknown>
  extends ExtendableConfig<Options> {
  name: string;
}

/**
 * Node 类用于创建自定义节点扩展。
 * @see 参考 https://tiptap.dev/api/extensions#create-a-new-extension
 */
export class Node<Options = unknown> extends Extendable<Options> {
  type = EXTENSIONS_TYPE.NODE;

  /**
   * 创建一个新的 Node 实例
   * @param config - 节点配置对象或返回配置对象的函数
   */
  static create<Options = unknown>(
    config: NodeConfig<Options> | (() => NodeConfig<Options>),
  ) {
    const resolvedConfig = typeof config === 'function' ? config?.() : config;
    return new Node<Options>(resolvedConfig);
  }

  constructor(config: NodeConfig<Options>) {
    super(config);
  }
}
