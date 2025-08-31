/* eslint-disable @typescript-eslint/no-explicit-any */
import { Extendable } from './core/Extendable';
import type { WriteFlow } from './core/WriteFlow';
import type { Node, NodeConfig } from './core/Node';
import type { Mark, MarkConfig } from './core/Mark';
import type { ExtendableConfig } from './core/Extendable';
import { MarkType, NodeType, Schema } from 'prosemirror-model';

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

export type AnyConfig = NodeConfig | MarkConfig;

export type AnyExtension<Options = unknown> =
  | Node<Options>
  | Mark<Options>
  | Extendable<Options>;

export type Extensions = AnyExtension[];

export interface ExtendableFunContext<Options = unknown> {
  extension: AnyExtension<Options>;
  schema: Schema;
  writeFlow: WriteFlow;
  type: NodeType | MarkType | null;
}

export type RemoveThis<T> = T extends (...args: any) => any
  ? (...args: Parameters<T>) => ReturnType<T>
  : T;

export interface WriteFlowOptions {
  element: Element;
  extensions?: Extensions;
}
