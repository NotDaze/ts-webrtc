"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignalListener = void 0;
const priority_set_1 = __importDefault(require("./priority_set"));
//const PrioritySet = require("./priority_set");
class SignalListener {
    constructor() {
        this.connections = new Map();
    }
    register(signal, callback) {
        var _a;
        if (!this.connections.has(signal))
            this.connections.set(signal, new Set());
        (_a = this.connections.get(signal)) === null || _a === void 0 ? void 0 : _a.add(callback);
    }
    pconnect(signal, priority, callback) {
        this.register(signal, callback);
        return signal.pconnect(priority, callback);
    }
    connect(signal, callback) {
        this.register(signal, callback);
        return signal.connect(callback);
    }
    disconnect(signal, callback) {
        var _a;
        if (this.connections.has(signal))
            (_a = this.connections.get(signal)) === null || _a === void 0 ? void 0 : _a.delete(callback);
        return signal.disconnect(callback);
    }
    disconnectAll() {
        for (const [signal, callbacks] of this.connections) {
            for (const callback of callbacks)
                signal.disconnect(callback);
        }
        this.connections.clear();
    }
}
exports.SignalListener = SignalListener;
class Signal {
    constructor() {
        //static DISCONNECT: symbol = Symbol();
        this.callbacks = new priority_set_1.default();
    }
    static fromEvent(emitter, event) {
        let signal = new Signal();
        signal.bindEvent(emitter, event);
        return signal;
    }
    static fromSignal(signal) {
        let newSignal = new Signal();
        newSignal.bindSignal(signal);
        return newSignal;
    }
    bindEvent(emitter, event) {
        emitter.on(event, this.emit.bind(this)); // fuck javascript
    }
    bindSignal(signal) {
        signal.connect(this.emit.bind(this));
    }
    pconnect(priority, callback) {
        this.callbacks.add(priority, callback);
        return callback;
    }
    connect(callback) {
        return this.pconnect(0, callback);
    }
    disconnect(callback) {
        this.callbacks.delete(callback);
    }
    disconnectAll() {
        this.callbacks.clear();
    }
    emit(arg) {
        for (const callback of this.callbacks) {
            //let out = callback(args);
            callback(arg);
            //if (out === Signal.DISCONNECT)
            //	this.disconnect(callback);
        }
    }
}
exports.default = Signal;
