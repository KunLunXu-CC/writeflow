import { Extendable } from './core/Extendable';

export interface WriteFlowOptions {
  element: Element;
  extensions: unknown[];
}

export enum EXTENSIONS_TYPE {
  NODE = 'node',
  EXTENDABLE = 'extendable',
}

export type AnyExtension = Extendable;
export type Extensions = AnyExtension[];
