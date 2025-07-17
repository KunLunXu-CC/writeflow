import { EXTENSIONS_TYPE } from '@/components/WriteFlow/types';

/**
 * Node 类用于创建自定义节点扩展。
 * @see 参考 https://tiptap.dev/api/extensions#create-a-new-extension
 */
export class Node<Options = unknown> {
  type = EXTENSIONS_TYPE.NODE;
  options?: Options;
  config?: NodeConfig;

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

  constructor(config: NodeConfig) {
    this.config = config;
  }
}

export interface NodeConfig<Options = unknown> {
  name: string;
  options?: Options;
}
