"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const signal_1 = __importDefault(require("../Core/signal"));
const network_1 = require("./network");
class Socket extends network_1.LocalMonoPeer {
    constructor(url, protocols, messageIndex = new network_1.MessageIndex(), messageHandler = new network_1.MessageHandler()) {
        super(messageIndex, messageHandler);
        this.closed = new signal_1.default();
        this.ws = new WebSocket(url, protocols);
        this.ws.binaryType = "arraybuffer";
        this.ws.onopen = (e) => { this.state.set(network_1.ConnectionState.CONNECTED); };
        this.ws.onclose = (e) => { this.close(); };
        this.ws.onerror = (e) => { this.close(); };
        this.ws.onmessage = (e) => { this.handleRaw(undefined, new Uint8Array(e.data)); };
    }
    send(message, data) {
        this.ws.send(this.messageIndex.createRaw(message, data));
    }
}
exports.default = Socket;
