import { AsyncLocalStorage } from "node:async_hooks";

class Context {
  static asyncLocalStorage = new AsyncLocalStorage();

  static setStore = (value, cb) => {
    return this.asyncLocalStorage.run(value, cb);
  };

  static getStore = () => {
    return this.asyncLocalStorage.getStore();
  };
}

export default Context;
