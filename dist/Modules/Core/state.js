"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const signal_1 = __importDefault(require("./signal"));
class State {
    constructor(value) {
        this.changed = new signal_1.default(); // old, new
        this.value = value;
    }
    is(value) {
        return this.value == value;
    }
    any(...values) {
        return values.includes(this.value);
    }
    set(newValue) {
        if (this.value !== newValue) {
            let oldValue = this.value;
            this.value = newValue;
            this.changed.emit([oldValue, newValue]);
        }
    }
}
exports.default = State;
