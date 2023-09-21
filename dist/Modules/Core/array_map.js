"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayMap = void 0;
class ArrayMap {
    constructor() {
        this.map = new Map();
    }
    *[Symbol.iterator]() {
        for (const value of this.map)
            yield value;
    }
    keys() {
        return this.map.keys();
    }
    /*values() {
        return this.map.values();
    }*/
    has(key) {
        return this.map.has(key);
    }
    get(key) {
        return this.map.get(key);
    }
    set(key, ...values) {
        if (values.length === 0)
            this.map.delete(key);
        else
            this.map.set(key, values);
    }
    delete(key) {
        this.map.delete(key);
    }
    add(key, ...values) {
        let keyValues = this.get(key);
        if (keyValues === undefined)
            this.set(key, ...values);
        else
            keyValues.concat(values);
    }
    remove(key, ...values) {
        let keyValues = this.get(key);
        if (keyValues === undefined)
            return;
        for (let i = keyValues.length - 1; i >= 0; i--) {
            if (values.includes(keyValues[i]))
                keyValues.splice(i, 1);
        }
        if (keyValues.length === 0)
            this.delete(key);
    }
}
exports.ArrayMap = ArrayMap;
