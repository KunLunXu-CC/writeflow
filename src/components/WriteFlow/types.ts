import { Extendable } from './core/Extendable';
import type { WriteFlow } from './core/WriteFlow';
import type { Node, NodeConfig } from './core/Node';
import type { Mark, MarkConfig } from './core/Mark';
import type { ExtendableConfig } from './core/Extendable';
import { MarkType, NodeType, Schema, Node as PMNode } from 'prosemirror-model';
import { EditorProps } from 'prosemirror-view';
export { WriteFlow, ExtendableConfig, NodeConfig };

export type Primitive = null | undefined | string | number | boolean | symbol | bigint;

export enum EXTENSIONS_TYPE {
  NODE = 'node',
  MARK = 'mark',
  EXTENDABLE = 'extendable',
}

/**
 * 扩展优先级
 * 数值越大优先级越高, 优先级越高快捷键等越先被触发、处理
 * 默认为 0, 数值尽可能按 100 的倍数递增
 */
export enum PRIORITY_LEVEL {
  LOW = 0,
  MEDIUM = 100,
  HIGH = 200,
  PREMIUM = 300,
}

/**
 * WFCommand(内部约定的命令)
 * 它们接收当前的编辑器状态和一个可选的派发函数作为参数,并返回一个布尔值或 Promise<boolean>, 表示命令是否成功执行
 * 返回 boolean 表示命令是否适用/执行成功(是否被处理了)
 */
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
export type AnyHelpers = Record<string, (opts?: any) => any>;

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

export interface WriteFlowValue {
  type?: string;
  marks?: WriteFlowValue[];
  content?: WriteFlowValue[];

  text?: string;
  attrs?: Record<string, any>;
}

export interface WriteFlowOptions extends EditorProps {
  element: Element;
  extensions?: AnyExtension[];
  initValue?: WriteFlowValue; // 初始内容, 字符串格式的 JSON
}

/** 事件 */
export enum WFEventKeys {
  /** 文档内容变更 */
  docChange = 'docChange',
}

export type WFEvents = {
  [WFEventKeys.docChange]: {
    doc: PMNode;
    writeFlow: WriteFlow;
    value: WriteFlowValue;
  };
};
