/* eslint-disable @typescript-eslint/no-explicit-any */
import { Extendable } from './core/Extendable';
import type { WriteFlow } from './core/WriteFlow';
import type { Node, NodeConfig } from './core/Node';
import type { Mark, MarkConfig } from './core/Mark';
import type { ExtendableConfig } from './core/Extendable';
import { MarkType, NodeType, Schema } from 'prosemirror-model';
import { EditorProps } from 'prosemirror-view';
import { Command } from 'prosemirror-state';
export { WriteFlow, ExtendableConfig, NodeConfig };

export type Primitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint;

export enum EXTENSIONS_TYPE {
  NODE = 'node',
  MARK = 'mark',
  EXTENDABLE = 'extendable',
}

/**
 * WFCommand(命令) 没直接用 prosemirror-state 中的 Command 类型, 是因为想要直接传入 WriteFlow 实例。但作用基本一致
 * 它们接收当前的编辑器状态和一个可选的派发函数作为参数,并返回一个布尔值表示命令是否成功执行
 * 返回值的含义如下:
 *
 * true - 命令成功执行, 表示:
 * - 命令适用于当前状态 - 该命令可以在当前编辑器状态下执行
 * - 操作已执行(如果提供了 dispatch) - 命令已经修改了编辑器状态
 * - 停止传播 - 如果多个命令绑定到同一个快捷键,返回 true 会阻止后续命令执行
 *
 * false - 命令不适用或执行失败, 表示:
 * - 命令不适用 - 当前状态下无法执行该命令
 * - 继续传播 - 允许尝试执行下一个命令(在快捷键链中)
 * - 不修改状态 - 编辑器状态保持不变
 */
export type WFCommand = (wf: WriteFlow) => boolean;

export type AnyExtensionConfig = NodeConfig | MarkConfig | ExtendableConfig;

export type AnyExtension<Options = any> =
  | Node<Options>
  | Mark<Options>
  | Extendable<Options>;

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

export type HelperFunction = (...args: any[]) => any;

export type CommandFunction = (...args: any[]) => any;

export type AnyHelpers = Record<string, HelperFunction>;

export type AnyCommands = Record<string, CommandFunction>;
