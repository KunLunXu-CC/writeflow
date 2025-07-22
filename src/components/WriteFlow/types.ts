export interface WriteFlowOptions {
  element: Element;
  extensions: unknown[];
}

export enum EXTENSIONS_TYPE {
  NODE = 'node',
  EXTENDABLE = 'extendable',
}
