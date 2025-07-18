import { EXTENSIONS_TYPE } from '@/components/WriteFlow/types';

export interface ExtendableConfig<Options = unknown> {
  name: string;
  options?: Options;
  type: EXTENSIONS_TYPE;
}

export class Extendable<Options = unknown> {
  name: string;
  type = EXTENSIONS_TYPE.EXTENDABLE;
  options?: Options;
  config?: ExtendableConfig<Options>;

  constructor(config: ExtendableConfig<Options>, options?: Options) {
    this.options = options;
    this.config = config;
    this.name = this.config.name;
  }
}
