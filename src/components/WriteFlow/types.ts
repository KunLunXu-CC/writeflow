import { Extendable } from './core/Extendable';
import type { WriteFlow } from './core/WriteFlow';
import type { Node, NodeConfig } from './core/Node';
import type { Mark, MarkConfig } from './core/Mark';
import type { ExtendableConfig } from './core/Extendable';
import { MarkType, NodeType, Schema } from 'prosemirror-model';
import { EditorProps } from 'prosemirror-view';
export { WriteFlow, ExtendableConfig, NodeConfig };

export type Primitive = null | undefined | string | number | boolean | symbol | bigint;

export enum EXTENSIONS_TYPE {
  NODE = 'node',
  MARK = 'mark',
  EXTENDABLE = 'extendable',
}

export type WFCommand<Options = any, ReturnData = Promise<boolean> | boolean> = (
  context: { writeFlow: WriteFlow; extension: AnyExtension },
  options?: Options,
) => ReturnData;

/**
 * WFHelper(内部约定的辅助函数)
 * 它们接收当前的编辑器状态和一个可选的派发函数作为参数,并返回任意类型的值
 */
export type WFHelper<Return = any, Options = any> = (
  context: { writeFlow: WriteFlow; extension: AnyExtension },
  options?: Options,
) => Return;

/**
 * 对外暴露的辅助函数
 */
export type AnyHelpers = Record<string, (opts?: Record<string, any>) => any>;

/**
 * 对外暴露的命令
 */
export type AnyCommands = Record<string, (opts?: any) => any>;

export type AnyExtensionConfig = NodeConfig | MarkConfig | ExtendableConfig;

export type AnyExtension<Options = any> = Node<Options> | Mark<Options> | Extendable<Options>;

export interface ExtendableFunContext<Options = any> {
  extension: AnyExtension<Options>;
  schema: Schema;
  writeFlow: WriteFlow;
  type: NodeType | MarkType | null;
}

export type RemoveThis<T> = T extends (...args: any) => any
  ? (...args: Parameters<T>) => ReturnType<T>
  : T;

export interface WriteFlowOptions extends EditorProps {
  element: Element;
  extensions?: AnyExtension[];
}
