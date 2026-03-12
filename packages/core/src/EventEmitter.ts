interface EventsMap {
  // 定义事件映射,  { "事件名": 参数 }
  [event: string]: Record<string, any>;
}

// 提取所有事件名
type StringKeysOf<T> = Extract<keyof T, string>;

// 提取回调函数参数类型
type CallbackArgs<T extends EventsMap, EventName extends StringKeysOf<T>> = T[EventName];

// 提取回调函数返回值类型
type CallbackFunction<T extends EventsMap, EventName extends StringKeysOf<T>> = (
  args: CallbackArgs<T, EventName>,
) => any;

export class EventEmitter<T extends EventsMap> {
  private callbacks: { [key: string]: Array<(...args: any[]) => void> } = {};

  public on<EventName extends StringKeysOf<T>>(
    event: EventName,
    fn: CallbackFunction<T, EventName>,
  ): this {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }

    this.callbacks[event].push(fn);

    return this;
  }

  public emit<EventName extends StringKeysOf<T>>(
    event: EventName,
    args: CallbackArgs<T, EventName>,
  ): this {
    const callbacks = this.callbacks[event];

    if (callbacks) {
      callbacks.forEach((callback) => callback.call(this, args));
    }

    return this;
  }

  public off<EventName extends StringKeysOf<T>>(
    event: EventName,
    fn?: CallbackFunction<T, EventName>,
  ): this {
    const callbacks = this.callbacks[event];

    if (callbacks) {
      if (fn) {
        this.callbacks[event] = callbacks.filter((callback) => callback !== fn);
      } else {
        delete this.callbacks[event];
      }
    }

    return this;
  }

  public once<EventName extends StringKeysOf<T>>(
    event: EventName,
    fn: CallbackFunction<T, EventName>,
  ): this {
    const onceFn = (args: CallbackArgs<T, EventName>) => {
      this.off(event, onceFn);
      fn.call(this, args);
    };

    return this.on(event, onceFn);
  }

  public removeAllListeners(): void {
    this.callbacks = {};
  }
}
