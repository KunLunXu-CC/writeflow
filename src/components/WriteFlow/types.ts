/* eslint-disable @typescript-eslint/no-explicit-any */
import { Command, EditorState, Transaction } from 'prosemirror-state';
import { Extendable } from './core/Extendable';
import type { WriteFlow } from './WriteFlow';
import type { Node, NodeConfig } from './core/Node';
import type { ExtendableConfig } from './core/Extendable';
import { NodeType, Schema } from 'prosemirror-model';

export { WriteFlow, ExtendableConfig, NodeConfig };

export type AnyConfig = NodeConfig;

export type AnyExtension = Node | Extendable;

export type Primitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint;

export interface ExtendableFunContext {
  type: NodeType;
  writeFlow: WriteFlow;
  name: string;
  schema: Schema;
  options: Record<string, any>;
}

export type RemoveThis<T> = T extends (...args: any) => any
  ? (...args: Parameters<T>) => ReturnType<T>
  : T;

export type MaybeReturnType<T> = T extends (...args: any) => any
  ? ReturnType<T>
  : T;

export type MaybeThisParameterType<T> =
  Exclude<T, Primitive> extends (...args: any) => any
    ? ThisParameterType<Exclude<T, Primitive>>
    : any;

export type InputRuleMatch = {
  index: number;
  text: string;
  replaceWith?: string;
  match?: RegExpMatchArray;
  data?: Record<string, any>;
};

export type InputRuleFinder =
  | RegExp
  | ((text: string) => InputRuleMatch | null);

export type ExtendedRegExpMatchArray = RegExpMatchArray & {
  data?: Record<string, any>;
};

export interface WriteFlowOptions {
  element: Element;
  extensions?: Extensions;
}

export enum EXTENSIONS_TYPE {
  NODE = 'node',
  EXTENDABLE = 'extendable',
}

export type Extensions = AnyExtension[];

export type KeyboardShortcutCommand = (props: {
  writeFlow: WriteFlow;
}) => boolean;

export type ValuesOf<T> = T[keyof T];

export type PickValue<T, K extends keyof T> = T[K];
export type KeysWithTypeOf<T, Type> = {
  [P in keyof T]: T[P] extends Type ? P : never;
}[keyof T];

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;
interface Commands<ReturnType> {
  splitBlock: {
    /**
     * Forks a new node from an existing node.
     * @param options.keepMarks Keep marks from the previous node.
     * @example editor.commands.splitBlock()
     * @example editor.commands.splitBlock({ keepMarks: true })
     */
    splitBlock: (options?: { keepMarks?: boolean }) => ReturnType;
  };
}

export type UnionCommands<T = Command> = UnionToIntersection<
  ValuesOf<Pick<Commands<T>, KeysWithTypeOf<Commands<T>, object>>>
>;

export type RawCommands = {
  [Item in keyof UnionCommands]: UnionCommands<Command>[Item];
};

// #region
export type InputRuleHandler = (props: {
  state: EditorState;
  range: {
    to: number;
    from: number;
  };
  match: ExtendedRegExpMatchArray;
}) => Transaction | void | null;

// #endregion
