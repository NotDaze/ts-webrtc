/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*
sdp: 'v=0\r\n' +
'o=- 8311241009587343762 2 IN IP4 127.0.0.1\r\n' +
's=-\r\n' +
't=0 0\r\n' +
'a=group:BUNDLE 0\r\n' +
'a=extmap-allow-mixed\r\n' +
'a=msid-semantic: WMS\r\n' +
'm=application 9 UDP/DTLS/SCTP webrtc-datachannel\r\n' +
'c=IN IP4 0.0.0.0\r\n' +
'a=ice-ufrag:akAp\r\n' +
'a=ice-pwd:w+R4CtwP58PIO5tL7RYAK0sp\r\n' +
'a=ice-options:trickle\r\n' +
'a=fingerprint:sha-256 7C:CD:66:A5:BC:E9:CB:35:BC:2E:0C:5B:EA:F2:B3:33:B5:4E:F8:D8:24:55:1E:17:BF:C7:CE:5B:8C:85:FE:3A\r\n' +
'a=setup:active\r\n' +
'a=mid:0\r\n' +
'a=sctp-port:5000\r\n' +
'a=max-message-size:262144\r\n'

*/
/*
=sdp: 'v=0\r\n' +
'o=mozilla...THIS_IS_SDPARTA-99.0 8440494408006261249 0 IN IP4 0.0.0.0\r\n' +
='s=-\r\n' +
='t=0 0\r\n' +
='a=fingerprint:sha-256 DD:1F:DC:13:D8:CD:5E:DE:27:71:83:C9:AE:D2:22:20:5D:29:94:4D:36:85:7C:D0:C8:A7:D0:0E:A2:C2:E8:1E\r\n' +
='a=group:BUNDLE 0\r\n' +
='a=ice-options:trickle\r\n' +
='a=msid-semantic:WMS *\r\n' +
='m=application 9 UDP/DTLS/SCTP webrtc-datachannel\r\n' +
='c=IN IP4 0.0.0.0\r\n' +
'a=sendrecv\r\n' +
='a=ice-pwd:2dbdc4b99dd2b7021f1c4eeccc0f7023\r\n' +
='a=ice-ufrag:355a7d6f\r\n' +
='a=mid:0\r\n' +
='a=setup:active\r\n' +
='a=sctp-port:5000\r\n'
='a=max-message-size:1073741823\r\n'

*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const game_client_1 = __importDefault(__webpack_require__(1));
//const socket = new Socket("ws://localhost:5050", ["soap"]);
const client = new game_client_1.default("ws://localhost:5050");
client.connected.connect(() => {
    console.log("connected!");
    //client.sendAll(new Uint8Array([ 1, 2, 3, 4, 5 ]));
});
window.onbeforeunload = () => {
    client.close();
};


/***/ }),
/* 1 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RemoteGameClient = void 0;
const network_1 = __webpack_require__(2);
const mesh_client_1 = __importStar(__webpack_require__(9));
const arg_1 = __importDefault(__webpack_require__(8));
const GameMessages = new network_1.MessageIndex();
const TEST = GameMessages.newMessage(arg_1.default.STRING2);
class RemoteGameClient extends mesh_client_1.RemoteMeshClient {
    constructor() {
        super();
    }
}
exports.RemoteGameClient = RemoteGameClient;
class LocalGameClient extends mesh_client_1.default {
    constructor(serverUrl, protocols = []) {
        super(RemoteGameClient, serverUrl, protocols, GameMessages, new network_1.MessageHandler);
        this.connected.connect(() => {
            this.sendAll(TEST, "Hello world!");
        });
        this.onMessage(TEST, (packet) => {
            console.log(packet.peer.getID(), ": ", packet.data);
        });
    }
}
exports["default"] = LocalGameClient;


/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Group = exports.RemotePeer = exports.LocalMultiPeer = exports.LocalMonoPeer = exports.RemotePeerIndex = exports.MessageHandler = exports.MessageIndex = exports.Message = exports.Packet = exports.ConnectionState = exports.TransferMode = void 0;
const state_1 = __importDefault(__webpack_require__(3));
const signal_1 = __importStar(__webpack_require__(4));
const byteistream_1 = __importDefault(__webpack_require__(6));
const byteostream_1 = __importDefault(__webpack_require__(7));
const arg_1 = __importDefault(__webpack_require__(8));
var TransferMode;
(function (TransferMode) {
    TransferMode[TransferMode["RELIABLE"] = 0] = "RELIABLE";
    TransferMode[TransferMode["ORDERED"] = 1] = "ORDERED";
    TransferMode[TransferMode["UNRELIABLE"] = 2] = "UNRELIABLE";
})(TransferMode || (exports.TransferMode = TransferMode = {}));
var ConnectionState;
(function (ConnectionState) {
    ConnectionState[ConnectionState["NEW"] = 0] = "NEW";
    ConnectionState[ConnectionState["CONNECTING"] = 1] = "CONNECTING";
    ConnectionState[ConnectionState["CONNECTED"] = 2] = "CONNECTED";
    ConnectionState[ConnectionState["DISCONNECTED"] = 3] = "DISCONNECTED";
    //CLOSED, // maybe
})(ConnectionState || (exports.ConnectionState = ConnectionState = {}));
class Packet {
    //public raw: Uint8Array;
    //public branching = new Array<number>();
    //public branching: Array<number>;
    constructor(message, peer, data, raw = new Uint8Array()) {
        this.message = message;
        this.peer = peer;
        this.data = data;
        //this.raw = raw;
    }
}
exports.Packet = Packet;
class Message {
    //private conditions = new Array<(packet: Packet) => boolean>;
    constructor(arg, transferMode = TransferMode.RELIABLE) {
        this.arg = arg;
        this.transferMode = transferMode;
    }
    getTransferMode() {
        return this.transferMode;
    }
    encode(data) {
        return arg_1.default.encode(this.arg, data);
    }
    streamEncode(data, stream) {
        arg_1.default.streamEncode(this.arg, data, stream);
    }
    decode(raw) {
        return arg_1.default.decode(this.arg, raw);
    }
    streamDecode(stream) {
        return arg_1.default.streamDecode(this.arg, stream);
    }
}
exports.Message = Message;
class MessageIndex {
    constructor(messages = new Array) {
        this.idByteCount = 2;
        this.messages = Array.from(messages);
    }
    duplicate() {
        return new MessageIndex(this.messages);
    }
    addMessage(message) {
        this.messages.push(message);
        //this.messages.add(message);
        //return message;
    }
    newMessage(arg) {
        //return this.add(new Message(arg));
        const message = new Message(arg);
        //console.log(this.messages.getID(message))
        //console.log(this.messages.hasValue(message));
        this.addMessage(message);
        return message;
    }
    createRaw(message, data) {
        let messageID = this.messages.indexOf(message);
        if (messageID < 0)
            throw "Invalid Message.";
        //let encodedData = message.encodePacketData(data);
        let stream = new byteostream_1.default();
        stream.write(arg_1.default.encodeInt(messageID, this.idByteCount));
        message.streamEncode(data, stream);
        /*return ByteOStream.join(
            Arg.encodeInt(messageID, this.idByteCount),
            message.streamEncode(data)
        );*/
        return stream.bytes;
        /*let out = new Uint8Array(this.idByteCount + encodedData.length);
        
        out.set(Arg.encodeInt(messageID, this.idByteCount), 0);
        out.set(encodedData, this.idByteCount);
        
        return out;*/
    }
    createPackets(peer, raw) {
        //console.log(raw);
        let stream = new byteistream_1.default(raw);
        let packets = new Array();
        while (!stream.complete) {
            let messageID = arg_1.default.decodeInt(stream.next(this.idByteCount));
            let message = this.messages[messageID];
            if (!message)
                console.error("Unrecognized Message | ", messageID, " | ", raw);
            packets.push(new Packet(message, peer, message.streamDecode(stream)));
        }
        stream.verifyExactComplete();
        return packets;
    }
}
exports.MessageIndex = MessageIndex;
class MessageHandler {
    constructor() {
        this.conditions = new Map();
        this.signals = new Map();
    }
    hasMessageSignal(message) {
        return this.signals.has(message);
    }
    getMessageSignal(message) {
        let signal = this.signals.get(message);
        if (!signal) {
            signal = new signal_1.default();
            this.signals.set(message, signal);
        }
        return signal;
    }
    addCallback(message, callback) {
        this.getMessageSignal(message).connect(callback);
    }
    removeCallback(message, callback) {
        if (this.hasMessageSignal(message)) {
            this.getMessageSignal(message).disconnect(callback);
        }
    }
    addCondition(messages, condition) {
        var _a;
        for (const message of (messages instanceof Message ? [messages] : messages)) {
            if (!this.conditions.has(message))
                this.conditions.set(message, new Set());
            (_a = this.conditions.get(message)) === null || _a === void 0 ? void 0 : _a.add(condition);
        }
    }
    removeCondition(messages, condition) {
        var _a;
        for (const message of (messages instanceof Message ? [messages] : messages)) {
            if (this.conditions.has(message))
                (_a = this.conditions.get(message)) === null || _a === void 0 ? void 0 : _a.delete(condition);
        }
    }
    onMessage(message, callback) {
        this.addCallback(message, callback);
    }
    handlePacket(packet) {
        if (this.hasMessageSignal(packet.message)) {
            let conditions = this.conditions.get(packet.message);
            if (conditions) {
                for (const condition of conditions) {
                    let out = condition(packet);
                    if (out !== undefined) {
                        if (out !== "") {
                            console.error("Network Condition Failed: ", out);
                        }
                        return;
                    }
                }
            }
            this.getMessageSignal(packet.message).emit(packet);
        }
    }
    handlePackets(packets) {
        for (const packet of packets) {
            this.handlePacket(packet);
        }
    }
}
exports.MessageHandler = MessageHandler;
class RemotePeerIndex {
    constructor() {
        this.index = new Map();
        this.peers = new Set();
        this.ids = new Set();
        this.highestID = -1;
        this.freeIDs = new Array();
    }
    /*private callbacks = new Map<number,(arg: [ConnectionState, ConnectionState]) => void>();
    private stateIndex = {
        [ConnectionState.NEW]: new Set<PeerType>(),
        [ConnectionState.CONNECTING]: new Set<PeerType>(),
        [ConnectionState.CONNECTED]: new Set<PeerType>(),
        [ConnectionState.DISCONNECTED]: new Set<PeerType>()
    };*/
    get size() {
        return this.peers.size;
    }
    *[Symbol.iterator]() {
        for (const peer of this.peers) {
            yield (peer);
        }
    }
    trim() {
        while (this.highestID >= 0) {
            // If highest freed id is our highest id, trim and continue
            if (this.freeIDs.at(-1) === this.highestID) {
                this.freeIDs.pop();
                this.highestID--;
            }
            else {
                return;
            }
        }
    }
    freeID(id) {
        if (id === this.highestID) { // Trim
            this.highestID--;
            this.trim();
        }
        else {
            // Sorted add
            for (let i = 0; i < this.freeIDs.length; i++) {
                if (id < this.freeIDs[i]) {
                    this.freeIDs.splice(i, 0, id);
                    return;
                }
            }
            // Bigger than all, add at end
            this.freeIDs.push(id);
        }
    }
    unfreeID(id) {
        if (id > this.highestID) {
            // Add intervening free ids. If old highest is 0, and new is 2, 1 is now free
            for (let i = this.highestID + 1; i < id; i++)
                this.freeIDs.push(i);
            this.highestID = id;
        }
        else { // Using a free ID, from the array
            let index = this.freeIDs.indexOf(id);
            if (index >= 0)
                this.freeIDs.splice(index, 1);
            else
                console.error("RemotePeerIndex duplicate ID error.");
        }
    }
    getNextID() {
        // Use lowest freed ID, if we have any
        if (this.freeIDs.length > 0)
            return this.freeIDs[0];
        return this.highestID + 1;
    }
    stateFilter(...states) {
        let peers = new Set();
        for (const peer of this.peers)
            if (peer.state.any(...states))
                peers.add(peer);
        return peers;
        //return this.stateIndex[state];
    }
    peersFromIDs(ids) {
        if (ids == undefined)
            return this.peers;
        let out = new Set();
        for (const id of ids) {
            let peer = this.index.get(id);
            if (peer != undefined) // error message?
                out.add(peer);
        }
        return out;
    }
    idsFromPeers(peers) {
        let out = new Set();
        for (const peer of peers)
            out.add(peer.getID());
        return out;
    }
    getStatus() {
        let status = [new Set(), new Set(), new Set()];
        for (const peer of this.peers) {
            switch (peer.state.value) {
                case ConnectionState.CONNECTED:
                    status[1].add(peer);
                    break;
                case ConnectionState.DISCONNECTED:
                    status[2].add(peer);
                    break;
                default:
                    status[0].add(peer);
            }
        }
        return status;
    }
    getIDStatus() {
        let status = this.getStatus();
        let idStatus = [new Set(), new Set(), new Set()];
        for (let i = 0; i < 3; i++)
            idStatus[i] = this.idsFromPeers(status[i]);
        return idStatus;
    }
    /*hasID(id: number): boolean {
        return this.index.has(id);
    }*/
    /*hasPeer(peer: PeerType): boolean {
        return this.peers.has(peer);
    }*/
    hasPeer(id) {
        return this.index.has(id);
    }
    getPeer(id) {
        return this.index.get(id);
    }
    add(peer, id = this.getNextID()) {
        if (this.ids.has(id))
            console.error("Remote Peer ID collision");
        /*let callback = peer.state.changed.pconnect(-1, ([oldState, newState]: [ConnectionState, ConnectionState]) => {
            
            this.stateIndex[oldState].delete(peer);
            this.stateIndex[newState].add(peer);
            
        });
        
        this.callbacks.set(id, callback);*/
        this.index.set(id, peer);
        this.peers.add(peer);
        this.ids.add(id);
        this.unfreeID(id);
    }
    remove(id) {
        let peer = this.index.get(id);
        if (peer == undefined) {
            console.error("Removing RemotePeer from index that isn't there.");
            return;
        }
        this.index.delete(id);
        this.peers.delete(peer);
        this.ids.delete(id);
        this.freeID(id);
        /*let callback = this.callbacks.get(id);
        peer.state.changed.disconnect(callback);
        
        this.callbacks.delete(id);*/
    }
}
exports.RemotePeerIndex = RemotePeerIndex;
class Peer {
    constructor() {
        this.id = -1;
        this.state = new state_1.default(ConnectionState.NEW);
        this.connected = new signal_1.default();
        this.disconnected = new signal_1.default();
        this.connecting = new signal_1.default();
        this.connectionFailed = new signal_1.default();
        this.closed = new signal_1.default();
        this.state.changed.connect(([oldState, newState]) => {
            switch (newState) {
                case ConnectionState.NEW:
                    break;
                case ConnectionState.CONNECTING:
                    this.connecting.emit();
                    break;
                case ConnectionState.CONNECTED:
                    this.connected.emit();
                    break;
                case ConnectionState.DISCONNECTED:
                    if (oldState == ConnectionState.CONNECTED)
                        this.disconnected.emit();
                    else
                        this.connectionFailed.emit();
                    break;
            }
        });
    }
    hasID() {
        return this.id >= 0;
    }
    getID() {
        return this.id;
    }
    setID(newID) {
        this.id = newID;
    }
    close() {
        this.state.set(ConnectionState.DISCONNECTED);
        this.closed.emit();
    }
}
class LocalPeer extends Peer {
    constructor(messageIndex = new MessageIndex(), messageHandler = new MessageHandler()) {
        super();
        this.messageIndex = messageIndex;
        this.messageHandler = messageHandler;
    }
    //private handleRaw(peer: RemotePeer, raw: Uint8Array): void {
    //	this.handlePackets(this.messageIndex.createPackets(peer, raw));
    //}
    handlePackets(packets) {
        for (const packet of packets)
            this.handlePacket(packet);
    }
    handlePacket(packet) {
        this.messageHandler.handlePacket(packet);
    }
    handleRaw(peer, raw) {
        this.handlePackets(this.messageIndex.createPackets(peer, raw));
    }
    newMessage(arg, transferMode = TransferMode.RELIABLE) {
        return this.messageIndex.newMessage(arg);
    }
    addCondition(messages, condition) {
        this.messageHandler.addCondition(messages, condition);
    }
    removeCondition(messages, condition) {
        this.messageHandler.removeCondition(messages, condition);
    }
    addCallback(message, callback) {
        this.messageHandler.addCallback(message, callback);
    }
    removeCallback(message, callback) {
        this.messageHandler.removeCallback(message, callback);
    }
    onMessage(message, callback) {
        this.addCallback(message, callback);
    }
}
class LocalMonoPeer extends LocalPeer {
    constructor(messageIndex = new MessageIndex(), messageHandler = new MessageHandler()) {
        super(messageIndex, messageHandler);
    }
    send(message, data) {
    }
}
exports.LocalMonoPeer = LocalMonoPeer;
class LocalMultiPeer extends LocalPeer {
    constructor() {
        super(...arguments);
        this.peerAdded = new signal_1.default();
        this.peerDropped = new signal_1.default();
        this.peerConnected = new signal_1.default();
        this.peerDisconnected = new signal_1.default();
        this.peerConnecting = new signal_1.default();
        this.peerConnectionFailed = new signal_1.default();
        this.peerIndex = new RemotePeerIndex();
        this.peerListeners = new Map();
    }
    get peers() {
        return this.peerIndex.peers;
    }
    get ids() {
        return this.peerIndex.ids;
    }
    //private messageIndex: MessageIndex;
    //private messageHandler: MessageHandler;
    // Peer Management
    /*public hasPeerID(id: number): boolean {
        return this.ids.has(id);
    }
    public hasPeer(peer: RemotePeerType): boolean {
        return this.peers.has(peer);
    }*/
    hasPeer(id) {
        return this.peerIndex.hasPeer(id);
    }
    getPeer(id) {
        return this.peerIndex.getPeer(id);
    }
    getPeers() {
        return this.peers;
    }
    addPeer(peer, id = this.peerIndex.getNextID()) {
        let listener = new signal_1.SignalListener();
        this.peerListeners.set(peer, listener);
        listener.connect(peer.rawReceived, (raw) => { this.handleRaw(peer, raw); });
        listener.connect(peer.connected, () => { this.peerConnected.emit(peer); });
        listener.connect(peer.disconnected, () => { this.peerDisconnected.emit(peer); });
        listener.connect(peer.connecting, () => { this.peerConnecting.emit(peer); });
        listener.connect(peer.connectionFailed, () => { this.peerConnectionFailed.emit(peer); });
        this.peerIndex.add(peer, id);
        peer.setID(id);
        //peer.setLocalPeer(this);
        this.peerAdded.emit(peer);
        switch (peer.state.value) {
            case ConnectionState.CONNECTED:
                this.peerConnected.emit(peer);
                break;
            case ConnectionState.CONNECTING:
                this.peerConnecting.emit(peer);
                break;
            case ConnectionState.DISCONNECTED:
                this.peerConnectionFailed.emit(peer);
                break;
        }
    }
    dropPeer(peer) {
        var _a;
        if (this.getPeer(peer.getID()) != peer)
            console.error("Attempted to drop invalid peer.");
        if (!this.peerListeners.has(peer)) {
            console.error("Dropping peer that has no listener.");
        }
        else { // disconnect signals
            (_a = this.peerListeners.get(peer)) === null || _a === void 0 ? void 0 : _a.disconnectAll();
            this.peerListeners.delete(peer);
        }
        this.peerIndex.remove(peer.getID());
        //peer.close();
        this.peerDropped.emit(peer);
    }
    getStatus() {
        return this.peerIndex.getStatus();
    }
    getIDStatus() {
        return this.peerIndex.getIDStatus();
    }
    // Inbound Messages
    // Outbound Messages
    sendSafe(peers, raw, transferMode) {
        for (const peer of peers) {
            if (!this.peers.has(peer))
                console.error("Attempted to send to invalid peer.");
            else
                peer.sendRaw(raw, transferMode);
        }
    }
    sendRaw(peers, raw, transferMode = TransferMode.RELIABLE) {
        this.sendSafe(new Set(peers instanceof RemotePeer ? [peers] : peers), raw, transferMode);
    }
    sendRawAll(raw, transferMode = TransferMode.RELIABLE) {
        this.sendSafe(this.peers, raw, transferMode);
    }
    sendRawAllExcept(exclusions, raw, transferMode = TransferMode.RELIABLE) {
        let peers = new Set(this.peers);
        for (const peer of (exclusions instanceof RemotePeer ? [exclusions] : exclusions))
            peers.delete(peer);
        this.sendSafe(peers, raw, transferMode);
    }
    send(target, message, data, transferMode = message.getTransferMode()) {
        this.sendRaw(target, this.messageIndex.createRaw(message, data), transferMode);
    }
    sendAll(message, data, transferMode = message.getTransferMode()) {
        this.sendRawAll(this.messageIndex.createRaw(message, data), transferMode);
    }
    sendAllExcept(exclusions, message, data, transferMode = message.getTransferMode()) {
        this.sendRawAllExcept(exclusions, this.messageIndex.createRaw(message, data), transferMode);
    }
}
exports.LocalMultiPeer = LocalMultiPeer;
class RemotePeer extends Peer {
    constructor() {
        super();
        this.rawReceived = new signal_1.default();
        //public localPeer: LocalMultiPeer;
        this.groups = new Set(); // weakset?
        this.closed.connect(() => {
            for (const group of new Set(this.groups)) {
                group.remove(this);
            }
        });
    }
    /*public setLocalPeer(peer: LocalMultiPeer): void {
        this.localPeer = peer;
    }
    public getLocalPeer(): LocalMultiPeer | undefined {
        return this.localPeer;
    }*/
    // Group Management
    hasGroup(group) {
        return this.groups.has(group);
    }
    hasStratumGroup(stratum) {
        return this.getStratumGroup(stratum) !== undefined;
    }
    getStratumGroup(stratum) {
        for (const group of this.groups) {
            if (stratum.has(group)) {
                return group;
            }
        }
        return undefined;
    }
    handleGroupEntry(group) {
        if (this.hasGroup(group))
            console.error("Attempted to add RemotePeer to duplicate group.");
        if (group.hasStratum() && this.hasStratumGroup(group.getStratum()))
            console.error("Added RemotePeer to more than one group in a given stratum.");
        this.groups.add(group);
    }
    handleGroupExit(group) {
        if (!this.hasGroup(group))
            console.error("Attempted to remove RemotePeer from group it isn't in.");
        this.groups.delete(group);
    }
    // Inbound Messages
    handleRaw(raw) {
        this.rawReceived.emit(raw);
    }
    // Outbound Messages
    sendRaw(raw, transferMode = TransferMode.RELIABLE) {
    }
}
exports.RemotePeer = RemotePeer;
class Group {
    //protected nextID = 0; // probably convert to an array of freed IDs
    //private tags = new Set<Symbol>();
    /*[Symbol.iterator] (): Iterator<PeerType> {
        for (const peer of this.peerIndex.values()) {
            yield(peer);
        }
    }*/
    get peers() {
        return this.peerIndex.peers;
    }
    get ids() {
        return this.peerIndex.ids;
    }
    constructor(localPeer, stratum) {
        this.dropped = new signal_1.default();
        //public emptied = new Signal<void>();
        //public filled = new Signal<void>();
        this.peersAdded = new signal_1.default();
        this.peersRemoved = new signal_1.default();
        this.peersLeaving = new signal_1.default();
        this.peerIndex = new RemotePeerIndex(); // weakset?
        this.localPeer = localPeer;
        this.stratum = stratum;
    }
    hasStratum() {
        return this.stratum !== undefined;
    }
    getStratum() {
        return this.stratum;
    }
    getPeers() {
        return this.peers;
    }
    getPeerCount() {
        return this.peers.size;
    }
    isEmpty() {
        return this.getPeerCount() == 0;
    }
    isFull() {
        return this.capacity != undefined && this.getPeerCount() >= this.capacity;
    }
    hasCapacity() {
        return this.capacity != undefined;
    }
    getCapacity() {
        return this.capacity == undefined ? -1 : this.capacity;
    }
    getRemainingCapacity() {
        return this.capacity == undefined ? -1 : (this.capacity - this.getPeerCount());
    }
    has(...peers) {
        for (const peer of peers) {
            if (!this.peers.has(peer))
                return false;
        }
        return true;
    }
    add(...peers) {
        let added = new Array();
        for (const peer of peers) {
            if (!this.has(peer)) {
                added.push(peer);
            }
            if (this.isFull()) {
                //this.filled.emit();
                break;
            }
        }
        for (const peer of added)
            this.peers.add(peer);
        for (const peer of added)
            peer.handleGroupEntry(this);
        this.peersAdded.emit(added);
        return added;
    }
    ;
    remove(...peers) {
        //let removed = peers.filter(this.has.bind(this));
        let removed = new Array();
        for (const peer of peers) {
            if (this.has(peer)) {
                removed.push(peer);
            }
        }
        this.peersLeaving.emit(removed);
        for (const peer of removed)
            this.peers.delete(peer);
        for (const peer of removed)
            peer.handleGroupExit(this);
        this.peersRemoved.emit(removed);
        return removed;
    }
    ;
    send(peers, message, data, transferMode = message.getTransferMode()) {
        this.localPeer.send(peers, message, data, transferMode);
    }
    sendAll(message, data, transferMode = message.getTransferMode()) {
        this.localPeer.send(this.peers, message, data, transferMode);
    }
    sendAllExcept(exclusions, message, data, transferMode = message.getTransferMode()) {
        let peers = new Set(this.peers);
        for (const peer of (exclusions instanceof RemotePeer ? [exclusions] : exclusions))
            peers.delete(peer);
        this.localPeer.send(peers, message, data, transferMode);
    }
    kill() {
        this.remove(...this.getPeers());
        //this.killed.emit();
    }
}
exports.Group = Group;
/*export class Acknowledgement extends Deferrable<Array<Packet>> {
    
    //static ACCEPT = Symbol();
    //static REJECT = Symbol();
    
    
    
    
    
    private localPeer: LocalPeer;
    private message: Message;
    
    private peers = new Set<RemotePeer>();
    private packets = new Array<Packet>();
    
    // Internals
    private onMessage: (packet: Packet) => void;
    
    private condition?: ((packet: Packet) => boolean);
    private timeout?: NodeJS.Timeout;
    
    constructor(localPeer: LocalPeer, message: Message, peers: RemotePeer | Iterable<RemotePeer>) {
        
        super();
        
        this.localPeer = localPeer;
        this.message = message;
        
        this.peers = new Set<RemotePeer>(peers instanceof RemotePeer ? [peers] : peers);
        
        this.onMessage = ((packet: Packet) => {
            
            if (this.peers.has(packet.peer)) {
                
                if (this.condition == null || this.condition(packet) == true) {
                    
                    this.peers.delete(packet.peer);
                    this.packets.push(packet);
                    
                    if (this.peers.size == 0)
                        this.resolve(this.packets);
                    
                }
                
            }
            
        });
        
        this.server.onMessage(message, this.onMessage);
        
    }
    
    private cleanup() {
        
        if (this.server != null && this.message != null)
            this.server.removeCallback(this.message, this.onMessage);
        
        if (this.timeout)
            clearTimeout(this.timeout);
        
    }
    
    public resolve(packets: Array<Packet> | PromiseLike<Array<Packet>>): void {
        
        this.cleanup();
        super.resolve(packets);
        
    }
    public reject(reason?: any): void {
        
        this.cleanup();
        super.resolve(reason);
        
    }
    
    public withCondition(condition: (packet: Packet) => boolean): Acknowledgement {
        this.condition = condition;
        return this;
    }
    public withTimeout(timeSec: number): Acknowledgement {
        
        if (this.timeout)
            clearTimeout(this.timeout);
        
        this.timeout = setTimeout((): void => {
            this.reject("Acknowledgement timed out.");
        }, timeSec * 1000);
        
        return this;
    }
    
}*/


/***/ }),
/* 3 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const signal_1 = __importDefault(__webpack_require__(4));
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
exports["default"] = State;


/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignalListener = void 0;
const priority_set_1 = __importDefault(__webpack_require__(5));
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
exports["default"] = Signal;


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class PrioritySet {
    constructor() {
        this.map = new Map();
        this.priorities = new Array();
    }
    *[Symbol.iterator]() {
        for (const priority of this.priorities) {
            let values = this.map.get(priority);
            if (values) {
                for (const value of values) {
                    yield value;
                }
            }
            /*let values = this.map.get(this.priorities[i]);
            
            for(let j = values.length - 1; j >= 0; j--) {
                yield values[j];
            }*/
        }
    }
    *backwards() {
        for (const priority of this.priorities) {
            let values = this.map.get(priority);
            if (values) {
                for (const value of values) {
                    yield value;
                }
            }
        }
    }
    /*get priorities() {
        return this.priorities;
    }
    get values() {
        return this.map;
    }*/
    addPriority(priority) {
        for (let i = 0; i < this.priorities.length; i++) {
            if (priority < this.priorities[i]) {
                this.priorities.splice(i, 0, priority);
                return;
            }
        }
        this.priorities.push(priority);
    }
    deletePriority(priority) {
        // should probably binary search
        let index = this.priorities.indexOf(priority);
        if (index >= 0)
            this.priorities.splice(index, 1);
    }
    has(value) {
        for (const set of this.map.values()) {
            if (set.has(value))
                return true;
        }
        return false;
    }
    add(priority, ...values) {
        if (values.length === 0)
            return;
        let set = this.map.get(priority);
        if (set) {
            for (const value of values) {
                set.add(value);
            }
        }
        else {
            this.addPriority(priority);
            this.map.set(priority, new Set(values));
        }
    }
    delete(...values) {
        for (const priority of this.priorities) {
            let set = this.map.get(priority);
            if (set) {
                for (const value of values)
                    set.delete(value);
            }
            /*let arr = this.map.get(priority);

            if (arr) {

                let index = arr.indexOf(value);

                if (index >= 0) {
                    arr.splice(index, 1);

                    if (arr.length === 0) {
                        this.#deletePriority(priority);
                        this.map.delete(priority);
                    }

                    break;
                }
            }*/
        }
    }
    clear() {
        this.map.clear();
        this.priorities = new Array();
    }
}
exports["default"] = PrioritySet;


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class ByteIStream {
    constructor(bytes) {
        this.index = 0;
        this.bytes = bytes;
        //this.index = 0;
    }
    get complete() {
        return this.index >= this.bytes.length;
    }
    get exactComplete() {
        return this.index === this.bytes.length;
    }
    next(count) {
        //console.log(this.bytes.slice(this.index, this.index + count));
        return this.bytes.slice(this.index, this.index += count);
    }
    verifyExactComplete() {
        if (!this.exactComplete) {
            console.error("ByteIStream Error");
            console.error(this.bytes);
            console.error(this.index);
        }
    }
}
exports["default"] = ByteIStream;


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class ByteOStream {
    static join(...byteArrays) {
        if (byteArrays.length === 0)
            return new Uint8Array();
        if (byteArrays.length === 1)
            return byteArrays[0].slice();
        let totalLength = 0;
        for (const byteArray of byteArrays) {
            totalLength += byteArray.length;
        }
        let out = new Uint8Array(totalLength);
        let nextIndex = 0;
        for (const byteArray of byteArrays) {
            out.set(byteArray, nextIndex);
            nextIndex += byteArray.length;
        }
        return out;
    }
    constructor(...segments) {
        this.segments = segments.slice();
    }
    write(bytes) {
        this.segments.push(bytes);
    }
    clear() {
        this.segments = new Array();
    }
    get bytes() {
        this.segments = [ByteOStream.join(...this.segments)];
        return this.segments[0];
    }
}
exports["default"] = ByteOStream;


/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


//const ByteStream = require("../Core/bytestream");
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const byteistream_1 = __importDefault(__webpack_require__(6));
const byteostream_1 = __importDefault(__webpack_require__(7));
const LOG256 = Math.log(256);
const TEXT_ENCODER = new TextEncoder();
const TEXT_DECODER = new TextDecoder();
;
//import { joinByteArrays, ByteOStream, ByteIStream } from "../Core/byteistream"
class HeaderFootprint {
    constructor(iterations, bytes) {
        this.iterations = iterations;
        this.bytes = bytes;
    }
}
class Arg {
    static setSafe(newSafe) {
        this.safe = newSafe;
    }
    static calculateByteCount(choiceCount) {
        return Math.max(1, Math.ceil(Math.log(choiceCount) / LOG256));
    }
    static calculateChoiceCount(byteCount) {
        return 1 << 8 * byteCount;
    }
    static joinByteArrays(...byteArrays) {
        return byteostream_1.default.join(...byteArrays);
    }
    static encodeInt(value, byteCount) {
        byteCount = (byteCount != null ? byteCount : Arg.calculateByteCount(value));
        let out = new Uint8Array(byteCount);
        for (let i = 0; i < byteCount; i++) {
            out[i] = (value & 255);
            value = value >> 8;
        }
        if (value > 0) {
        }
        return out;
    }
    static decodeInt(bytes) {
        let out = 0;
        for (let i = 0; i < bytes.length; i++) {
            out += (bytes[i] << i * 8);
        }
        return out;
    }
    static encodeFloat(value, min, precision, byteCount) {
        return this.encodeInt(Math.round((value - min) / precision), byteCount);
    }
    static decodeFloat(bytes, min, precision) {
        return min + this.decodeInt(bytes) * precision;
    }
    static encodeStr(str) {
        return TEXT_ENCODER.encode(str);
    }
    static decodeStr(bytes) {
        return TEXT_DECODER.decode(bytes);
    }
    static createHeader(footprint, byteCount) {
        if (footprint.iterations <= 0)
            return new Uint8Array();
        let segments = new Array;
        for (let i = 0; i < footprint.iterations; i++) {
            let lengthToEncode = (i == 0 ? byteCount : segments[0].length);
            let newSegmentLength = Arg.calculateByteCount(lengthToEncode);
            if (i == footprint.iterations - 1) { // last iteration
                if (footprint.bytes < newSegmentLength)
                    throw "Length header too small to encode value";
                newSegmentLength = footprint.bytes;
            }
            segments.unshift(this.encodeInt(lengthToEncode, newSegmentLength));
        }
        return Arg.joinByteArrays(...segments);
    }
    static withHeader(footprint, bytes) {
        return Arg.joinByteArrays(this.createHeader(footprint, bytes.length), bytes);
    }
    static resolveHeader(stream, footprint) {
        let byteCount = footprint.bytes;
        for (let i = 0; i < footprint.iterations; i++) {
            byteCount = this.decodeInt(stream.next(byteCount));
        }
        return byteCount;
    }
    static matches(arg, value) {
        if (arg == null) {
            return value == null;
        }
        else if (arg instanceof Arg) {
            return arg.matches(value);
        }
        else if (Array.isArray(arg)) {
            if (!Array.isArray(value) || arg.length !== value.length)
                return false;
            for (let i = 0; i < arg.length; i++) {
                if (!this.matches(arg[i], value[i]))
                    return false;
            }
            return true;
        }
        else {
            for (const key in arg) {
                if (!this.matches(arg[key], (key in value) ? value[key] : null))
                    return false;
            }
            return true;
        }
    }
    static matchesAll(arg, values) {
        for (const value of values) {
            if (!Arg.matches(arg, value))
                return false;
        }
        return true;
    }
    static streamEncodeAll(arg, values, stream) {
        for (const value of values) {
            Arg.streamEncode(arg, value, stream);
        }
    }
    static streamDecodeAll(arg, count, stream) {
        let out = new Array();
        for (let i = 0; i < count; i++) {
            out.push(Arg.streamDecode(arg, stream));
        }
        return out;
    }
    static encode(arg, value) {
        if (!this.matches(arg, value))
            console.error("Arg/Value Mismatch | ", value, " | ", arg);
        let stream = new byteostream_1.default();
        this.streamEncode(arg, value, stream);
        return stream.bytes;
    }
    static streamEncode(arg, value, stream) {
        if (arg == null) {
            if (value != null)
                console.error("Invalid null arg footprint.");
        }
        else if (arg instanceof Arg) {
            arg.streamEncode(value, stream);
        }
        else if (Array.isArray(arg)) {
            for (let i = 0; i < arg.length; i++)
                this.streamEncode(arg[i], value[i], stream);
        }
        else {
            for (const key in arg) {
                this.streamEncode(arg[key], value[key], stream);
            }
        } // TODO: improve error handling
    }
    static decode(arg, bytes) {
        return this.streamDecode(arg, new byteistream_1.default(bytes));
    }
    static streamDecodeSafe(arg, stream) {
        let decoded = this.streamDecode(arg, stream);
        stream.verifyExactComplete();
        return decoded;
    }
    static streamDecode(arg, stream) {
        if (arg == null) {
            return null;
        }
        else if (arg instanceof Arg) {
            return arg.streamDecode(stream);
        }
        else if (arg instanceof Array) {
            let decoded = new Array();
            for (const subarg of arg)
                decoded.push(this.streamDecode(subarg, stream));
            return decoded;
        }
        else {
            let decoded = {};
            for (const key in arg) {
                decoded[key] = this.streamDecode(arg[key], stream);
            }
            return decoded;
        }
    }
    static test(arg, value) {
        let encoded = Arg.encode(arg, value);
        let decoded = Arg.decode(arg, encoded);
        //console.log("Arg test failed!");
        console.log(value);
        console.log(decoded);
        console.log(encoded);
    }
    static int(byteCount, min) {
        return new IntArg(byteCount, min);
    }
    static float(min, max, precision = 0.01) {
        return new FloatArg(min, max, precision);
    }
    static str(iterCount = 1, byteCount = 2) {
        return new StrArg(iterCount, byteCount);
    }
    static choice(...choices) {
        return new ChoiceArg(...choices);
    }
    static array(arg, byteCount = 2) {
        return new ArrayArg(arg, byteCount);
    }
    static branch(...paths) {
        return new BranchArg(paths);
    }
    static const(value) {
        return new ConstArg(value, true);
    }
    static auto(value) {
        return new ConstArg(value, false);
    }
    static default(arg, fallback) {
        return new BranchArg([new ConstArg(fallback, false), arg]);
    }
    static optional(arg) {
        return Arg.default(arg, null);
    }
    constructor(headerFootprint) {
        this.headerFootprint = headerFootprint;
    }
    matches(value) {
        console.error("Override Arg.matches");
        return false;
    }
    encode(value) {
        console.error("Override Arg.encode");
        return new Uint8Array();
    }
    streamEncode(value, stream) {
        stream.write(this.encode(value));
    }
    decode(bytes) {
        console.error("Override Arg.decode");
    }
    streamDecode(stream) {
        let byteCount = Arg.resolveHeader(stream, this.headerFootprint);
        let bytes = stream.next(byteCount);
        return this.decode(bytes);
    }
}
Arg.safe = true;
exports["default"] = Arg;
class ChoiceArg extends Arg {
    constructor(...choices) {
        super(new HeaderFootprint(0, Arg.calculateByteCount(choices.length)));
        this.choices = choices;
    }
    matches(value) {
        return this.choices.includes(value);
    }
    encode(value) {
        let index = this.choices.indexOf(value);
        if (index < 0)
            console.error("Invalid ChoiceArg choice: ", value, " | ", this.choices);
        return Arg.encodeInt(index, this.headerFootprint.bytes);
    }
    decode(bytes) {
        return this.choices[Arg.decodeInt(bytes)];
    }
}
class IntArg extends Arg {
    constructor(byteCount, min = 0) {
        super(new HeaderFootprint(0, byteCount));
        this.min = min;
        this.max = min + Arg.calculateChoiceCount(byteCount);
    }
    matches(value) {
        if (typeof value != "number")
            return false;
        return Number.isInteger(value) && value >= this.min && value < this.max;
    }
    encode(value) {
        return Arg.encodeInt(value - this.min, this.headerFootprint.bytes);
    }
    decode(bytes) {
        return Arg.decodeInt(bytes) + this.min;
    }
}
class FloatArg extends Arg {
    constructor(min, max, precision) {
        if (precision === undefined)
            precision = 0.01;
        super(new HeaderFootprint(0, Arg.calculateByteCount((max - min) / precision)));
        this.min = (min === undefined ? 0 : min);
        this.max = this.min + precision * Arg.calculateChoiceCount(this.headerFootprint.bytes);
        this.precision = precision;
    }
    matches(value) {
        if (typeof value != "number")
            return false;
        return value >= this.min && value < this.max;
    }
    encode(value) {
        return Arg.encodeFloat(value, this.min, this.precision, this.headerFootprint.bytes);
    }
    decode(bytes) {
        return Arg.decodeFloat(bytes, this.min, this.precision);
    }
}
class StrArg extends Arg {
    constructor(iterations, bytes) {
        super(new HeaderFootprint(iterations, bytes));
    }
    matches(value) {
        if (typeof value != "string")
            return false;
        return true; // TODO: should probably length check
    }
    encode(value) {
        return Arg.withHeader(this.headerFootprint, Arg.encodeStr(value));
    }
    decode(bytes) {
        return Arg.decodeStr(bytes);
    }
}
class ArrayArg extends Arg {
    constructor(arg, byteCount = 2) {
        // special length header that tells how many copies of the sublist you get
        // also, this is certified black magic
        super(new HeaderFootprint(1, byteCount));
        this.arg = arg;
    }
    matches(values) {
        if (!Array.isArray(values) && !(values instanceof Set))
            return false;
        return Arg.matchesAll(this.arg, values);
    }
    /*public encode(values: Array<any>): Uint8Array {
        
        return Arg.joinByteArrays(
            Arg.createHeader(this.headerFootprint, values.length), // header
            ...(values.map(value => { return Arg.encode(this.arg, value) })) // encoded values
        );
        
        //return Arg.joinByteArrays([ header, encoded ]);
        
    }*/
    streamEncode(values, stream) {
        stream.write(Arg.createHeader(this.headerFootprint, Array.isArray(values) ? values.length : values.size));
        //for (const value of values)
        //	Arg.streamEncode(this.arg, value, stream);
        Arg.streamEncodeAll(this.arg, values, stream);
    }
    streamDecode(stream) {
        return Arg.streamDecodeAll(this.arg, Arg.resolveHeader(stream, this.headerFootprint), stream);
        /*let decoded = new Array<any>();
        
        for (let i = 0; i < valueCount; i++) {
            decoded.push(Arg.streamDecode(this.arg, stream));
        }
        
        
        return decoded;*/
    }
}
class DictArg extends Arg {
    constructor(keyArg, valueArg, byteCount = 2) {
        super(new HeaderFootprint(1, byteCount));
        this.keyArg = keyArg;
        this.valueArg = valueArg;
    }
    matches(obj) {
        if (obj instanceof Map)
            return Arg.matchesAll(this.keyArg, obj.keys()) && Arg.matchesAll(this.valueArg, obj.values());
        else if (typeof obj == "object" && Object.getPrototypeOf(obj) === Object.prototype)
            return Arg.matchesAll(this.keyArg, Object.keys(obj)) && Arg.matchesAll(this.valueArg, Object.values(obj));
        else
            return false;
    }
    streamEncode(obj, stream) {
        if (obj instanceof Map) {
            stream.write(Arg.createHeader(this.headerFootprint, obj.size));
            for (const [key, value] of obj) {
                Arg.streamEncode(this.keyArg, key, stream);
                Arg.streamEncode(this.valueArg, value, stream);
            }
        }
        else { // Generic object, probably a literal
            let keys = Object.keys(obj);
            stream.write(Arg.createHeader(this.headerFootprint, keys.length));
            for (const key of keys) {
                Arg.streamEncode(this.keyArg, key, stream);
                Arg.streamEncode(this.valueArg, obj[key], stream);
            }
        }
    }
    streamDecode(stream) {
        let valueCount = Arg.resolveHeader(stream, this.headerFootprint);
        let decoded = {};
        for (let i = 0; i < valueCount; i++) {
            let key = Arg.streamDecode(this.keyArg, stream);
            let value = Arg.streamDecode(this.valueArg, stream);
            decoded[key] = value;
        }
        return decoded;
    }
}
class BranchArg extends Arg {
    constructor(paths, byteCount = 1) {
        super(new HeaderFootprint(1, byteCount));
        this.paths = Array.from(paths);
    }
    matches(value) {
        for (const path of this.paths) {
            if (Arg.matches(path, value))
                return true;
        }
        return false;
    }
    streamEncode(value, stream) {
        for (let i = 0; i < this.paths.length; i++) {
            //console.log(i)
            if (Arg.matches(this.paths[i], value)) { // Use first matching path
                stream.write(Arg.encodeInt(i, this.headerFootprint.bytes));
                Arg.streamEncode(this.paths[i], value, stream);
                return;
            }
        }
        console.error("No match found for BranchArg.");
    }
    streamDecode(stream) {
        let path = Arg.resolveHeader(stream, this.headerFootprint);
        return Arg.streamDecode(// Header tells us which path to use
        this.paths[path], stream);
    }
}
class ConstArg extends Arg {
    constructor(value, mandatory = true) {
        super(new HeaderFootprint(0, 0));
        this.value = value;
        this.mandatory = mandatory;
    }
    matches(value) {
        if (value === this.value)
            return true;
        else if (value == null)
            return !this.mandatory;
        else
            return false;
    }
    streamEncode(value, stream) {
        if (value == null) {
            if (this.mandatory) {
                console.error("Invalid value for mandatory constArg");
            }
        }
        else if (value != this.value) {
            console.error("Invalid value for ConstArg");
        }
    }
    streamDecode(stream) {
        return this.value;
    }
}
Arg.UINT1 = Arg.int(1, 0);
Arg.UINT2 = Arg.int(2, 0);
Arg.UINT4 = Arg.int(4, 0);
Arg.UINT6 = Arg.int(6, 0);
Arg.INT1 = Arg.int(1, -128);
Arg.INT2 = Arg.int(2, -32768);
Arg.INT4 = Arg.int(4, -2147483648);
Arg.INT6 = Arg.int(6, -281474976710656);
Arg.CHAR = Arg.str(0, 1);
Arg.STRING1 = Arg.str(1, 1);
Arg.STRING2 = Arg.str(1, 2);
Arg.BOOL = Arg.choice(false, true);
/*let arg = {
    peerID: Arg.UINT2,
    //media: Arg.STRING1,
    //index: Arg.UINT2,
    //name: Arg.STRING2
    candidate: Arg.STRING2,
    sdpMLineIndex: Arg.INT2,
    sdpMid: Arg.STRING2,
    usernameFragment: Arg.STRING2
};*/
/*let encoded = Arg.encode(arg, {
    peerID: 2,
    candidate: "candidate",
    sdpMLineIndex: 12,
    sdpMid: "yeah",
    usernameFragment: "yeah"
})*/
//let encoded = Arg.encode(arg, { peerID: 0, candidate: "candidate:0 1 UDP 2122252543 ebde5967-d563-4beb-bada-3bc12fa08c35.local 62385 typ host", sdpMid: "0", sdpMLineIndex: 0, usernameFragment: "65db9032" });
/*let arg = Arg.STRING2;

let encoded = new Uint8Array([ 7, 0, 0, 0, 0, 0, 1, 0, 48, 0, 128, 8, 0, 99, 51, 52, 51, 50, 55, 98, 52 ]);


console.log(Arg.decode({
    peerID: Arg.UINT2,
    //media: Arg.STRING1,
    //index: Arg.UINT2,
    //name: Arg.STRING2
    candidate: Arg.STRING2,
    sdpMid: Arg.STRING2,
    sdpMLineIndex: Arg.UINT2,
    usernameFragment: Arg.STRING2
}, encoded))

Arg.test({
    peerID: Arg.UINT2,
    //media: Arg.STRING1,
    //index: Arg.UINT2,
    //name: Arg.STRING2
    candidate: Arg.STRING2,
    sdpMid: Arg.STRING2,
    sdpMLineIndex: Arg.UINT2,
    usernameFragment: Arg.STRING2
}, { peerID: 0, candidate: "candidate:0 1 UDP 2122252543 ebde5967-d563-4beb-bada-3bc12fa08c35.local 62385 typ host", sdpMid: "0", sdpMLineIndex: 0, usernameFragment: "65db9032" });
//console.log(encoded, Arg.decode(arg, encoded))*/
//console.log(Arg.decode(Arg.INT1, Arg.encode(Arg.INT1, 120)));
//console.log(Arg.encode(arg, 1));
/*let arg = Arg.UINT1;
let argList = [ arg, Arg.array([ arg, arg ]), { a: [ arg, arg ], b: arg } ];


let encoded = Arg.encode(argList, [0, [[1, 2], [3, 4], [5, 7]], { a: [ 55, 77 ], b: 66 }]);

console.log(encoded);

let decoded = Arg.decode(argList, encoded);

console.log(decoded);*/
/*let arg = Arg.branch(
    Arg.array(Arg.UINT1),
    Arg.array(Arg.STRING2),
    Arg.array(Arg.array(Arg.CHAR)),
    { x: Arg.UINT1, y: Arg.UINT1 },
    [ Arg.UINT2, Arg.UINT2 ],
    null
);

//console.log(Arg.encode(arg, [ 1, 2 ]));

let encoded = Arg.encode(arg, { x: 2, y: 10 });
//let encoded = Arg.encode(arg, null);
//let encoded = Arg.encode(arg, [ 1, 2, 255, 33, 85 ]);
//let encoded = Arg.encode(arg, [ ["a", "b"], ["c"] ]);
//let encoded = Arg.encode(arg, [ "w", "heeee" ]);

console.log(encoded);
console.log(Arg.decode(arg, encoded));*/
//console.log(Arg.encodeInt(0));


/***/ }),
/* 9 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


//import "webrtc-adapter";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RemoteMeshClient = void 0;
const signal_1 = __importDefault(__webpack_require__(4));
const network_1 = __webpack_require__(2);
//import Arg from "../Network/arg"
const websocket_client_1 = __importDefault(__webpack_require__(10));
const signaling_1 = __importStar(__webpack_require__(11));
/*export enum MeshStatus {
    
    PENDING,
    PARTIAL,
    CONNECTED,
    DISCONNECTED,
    
}*/
class RemoteMeshClient extends network_1.RemotePeer {
    //connectionReady = new Signal<void>();
    //answerCreated = new Signal<RTCSessionDescription>();
    //connectionReady = new Signal<void>();
    static getPeerIDs(peers) {
        let out = new Set();
        for (const peer of peers)
            out.add(peer.getID());
        return out;
    }
    //private channelReliable = );
    //private channelUnreliable = );
    //private a = this.rtcConnection.createDataChannel()
    constructor() {
        super();
        this.sessionDescriptionCreated = new signal_1.default();
        this.iceCandidateCreated = new signal_1.default();
        this.connection = new RTCPeerConnection({
            iceServers: [
                {
                    urls: ["stun:stun.l.google.com:19302"]
                }
            ]
        });
        this.channels = new Map;
        this.channels.set(network_1.TransferMode.RELIABLE, this.createDataChannel("reliable", {
            id: 0,
            negotiated: true,
            //maxPacketLifeTime: 10000,
            //maxRetransmits:
            //ordered: true,
        }));
        this.channels.set(network_1.TransferMode.UNRELIABLE, this.createDataChannel("unreliable", {
            id: 1,
            negotiated: true,
            maxRetransmits: 0,
            ordered: false,
        }));
        /*this.connection.ondatachannel = (ev: RTCDataChannelEvent) => {
            
            let channel = ev.channel;
            let transferMode: TransferMode;
            
            if (channel.id == 0)
                transferMode = TransferMode.RELIABLE;
            else if (channel.id == 1)
                transferMode = TransferMode.UNRELIABLE;
            else {
                console.error("Invalid channel");
                return;
            }
            
            this.initDataChannel(channel);
            this.channels.set(transferMode, channel);
            
        };*/
        this.connection.onconnectionstatechange = (ev) => {
            //console.log(this.channels.get(TransferMode.RELIABLE)?.readyState);
            switch (this.connection.connectionState) {
                case "new":
                    this.state.set(network_1.ConnectionState.NEW);
                    break;
                case "connecting":
                    this.state.set(network_1.ConnectionState.CONNECTING);
                    break;
                case "connected":
                    //this.state.set(ConnectionState.CONNECTING);
                    console.log("yaeh");
                    this.checkConnected(); // Not necessarily connected, channels must be open
                    break;
                case "disconnected":
                    this.state.set(network_1.ConnectionState.DISCONNECTED);
                    break;
                case "closed":
                    this.state.set(network_1.ConnectionState.DISCONNECTED);
                    break;
                case "failed":
                    console.error("MeshPeer connection failed.");
                    this.state.set(network_1.ConnectionState.DISCONNECTED);
                    break;
            }
        };
        this.connection.onicegatheringstatechange = (ev) => {
            // "new" | "gathering" | "complete"
            //this.checkConnected();
            //console.log("Gathering State: ", this.connection.iceGatheringState);
        };
        this.connection.onsignalingstatechange = (ev) => {
            // "closed" | "have-local-offer" | "have-local-pranswer" | "have-remote-offer" | "have-remote-pranswer" | "stable"
            /*switch (this.connection.signalingState) {
                
                case "have-local-pranswer": case "have-remote-pranswer": case "stable":
                    
                    for (const pendingCandidate of this.pendingCandidates)
                        this.addRemoteIceCandidate(pendingCandidate);
                    
                    this.pendingCandidates = [];
                    
                
            }*/
            //console.log("Signaling State: ", this.connection.signalingState);
        };
        this.connection.onicecandidate = (ev) => {
            //console.log(ev.candidate);
            //this.iceCandidateCreated.emit(ev.candidate?.toJSON());
            /*if (ev.candidate && ev.candidate.candidate) {
                
                if (this.connection.canTrickleIceCandidates)
                    this.iceCandidateCreated.emit(ev.candidate.toJSON());
                
            }
            else {
                
                if (!this.connection.canTrickleIceCandidates) {
                    this.sessionDescriptionCreated.emit(this.connection.localDescription?.toJSON());
                    console.log(this.connection.localDescription?.toJSON());
                }
                
            }*/
            if (ev.candidate && ev.candidate.candidate)
                this.iceCandidateCreated.emit(ev.candidate.toJSON());
        };
    }
    checkConnected() {
        if (!this.state.is(network_1.ConnectionState.CONNECTING))
            return;
        if (this.connection.connectionState !== "connected")
            return;
        // All channels must be open
        for (const channel of this.channels.values()) {
            if (channel.readyState !== "open")
                return;
        }
        // We're fully connected
        this.state.set(network_1.ConnectionState.CONNECTED);
    }
    createOffer() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.state.any(network_1.ConnectionState.NEW, network_1.ConnectionState.DISCONNECTED)) {
                console.log("Attempted to create offer for invalid peer.");
                return;
            }
            this.state.set(network_1.ConnectionState.CONNECTING);
            let offer = yield this.connection.createOffer({ /* iceRestart: true, */});
            yield this.connection.setLocalDescription(offer);
            /*if (this.connection.canTrickleIceCandidates === true)
                this.sessionDescriptionCreated.emit(offer);
            else
                console.log("No trickling");*/
            //console.log("Can Trickle: ", this.connection.canTrickleIceCandidates);
            if (offer.sdp == undefined)
                console.error("Failed offer creation.");
            else
                this.sessionDescriptionCreated.emit(offer);
        });
    }
    setRemoteDescription(description) {
        return __awaiter(this, void 0, void 0, function* () {
            //type RTCSdpType = "answer" | "offer" | "pranswer" | "rollback";
            if (this.state.is(network_1.ConnectionState.CONNECTED)) {
                console.log("Received remote description for peer that is already connected.");
                return;
            }
            if (description.type === "offer" && this.state.is(network_1.ConnectionState.CONNECTING)) {
                console.log("Received remote offer for peer that is already connecting.");
                return;
            }
            this.state.set(network_1.ConnectionState.CONNECTING);
            yield this.connection.setRemoteDescription(description);
            if (description.type === "offer") {
                let answer = yield this.connection.createAnswer();
                yield this.connection.setLocalDescription(answer);
                this.sessionDescriptionCreated.emit(answer);
            }
        });
    }
    addRemoteIceCandidate(candidate) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.state.is(network_1.ConnectionState.CONNECTING)) {
                //console.log("Received remote ice candidate for peer that isn't connecting.");
                //console.log(candidate);
            }
            yield this.connection.addIceCandidate(candidate);
        });
    }
    ;
    createDataChannel(label, init) {
        let channel = this.connection.createDataChannel(label, init);
        this.initDataChannel(channel);
        return channel;
    }
    initDataChannel(channel) {
        channel.onmessage = (ev) => __awaiter(this, void 0, void 0, function* () {
            console.log("Message! ", ev.data);
            if (ev.data instanceof Blob) {
                this.handleRaw(new Uint8Array(yield ev.data.arrayBuffer()));
            }
            else if (ev.data instanceof ArrayBuffer) {
                this.handleRaw(new Uint8Array(ev.data));
            }
            else {
                console.log("Invalid RTCDataChannel Message: ", ev.data);
            }
        });
        channel.onopen = (ev) => {
            console.log("Channel opened!");
            this.checkConnected();
        };
        channel.onclose = (ev) => {
            //if (this.state.is(ConnectionState.CONNECTED))
        };
    }
    ;
    sendRaw(raw, transferMode = network_1.TransferMode.RELIABLE) {
        if (!this.state.is(network_1.ConnectionState.CONNECTED)) {
            console.error("Attempted to send to RemoteMeshClient that is not connected.");
        }
        let channel = this.channels.get(transferMode);
        if (channel == undefined) {
            console.error("Invalid MeshClient channel.");
            return;
        }
        channel.send(raw);
    }
}
exports.RemoteMeshClient = RemoteMeshClient;
class LocalMeshClient extends network_1.LocalMultiPeer {
    constructor(remoteClientClass, serverUrl, protocols = [], messageIndex = new network_1.MessageIndex(), messageHandler = new network_1.MessageHandler()) {
        super(messageIndex, messageHandler);
        this.stable = false;
        this.fullyConnected = false;
        this.socket = new websocket_client_1.default(serverUrl, protocols, signaling_1.default.duplicate());
        this.clientClass = remoteClientClass;
        this.socket.connected.connect(() => {
            console.log("Connected to server");
        });
        this.connected.connect(() => {
            //this.sendServer(MESH_);
        });
        this.peerAdded.connect((peer) => {
            peer.sessionDescriptionCreated.connect((description) => {
                this.sendServer(signaling_1.MESH_SESSION_DESCRIPTION_CREATED, {
                    peerID: peer.getID(),
                    type: description.type,
                    sdp: description.sdp
                });
            });
            peer.iceCandidateCreated.connect((candidate) => {
                this.sendServer(signaling_1.MESH_ICE_CANDIDATE_CREATED, {
                    peerID: peer.getID(),
                    candidate: candidate.candidate,
                    sdpMid: candidate.sdpMid,
                    sdpMLineIndex: candidate.sdpMLineIndex,
                    usernameFragment: candidate.usernameFragment
                });
            });
            if (this.id > peer.id)
                peer.createOffer();
            if (this.state.is(network_1.ConnectionState.CONNECTED)) // Late join, tell the server about it
                this.sendStatus();
        });
        this.peerDropped.connect((peer) => {
            peer.close();
            if (this.state.is(network_1.ConnectionState.CONNECTED))
                this.sendStatus();
        });
        this.peerConnectionFailed.connect((peer) => {
            //this.checkAndSendStatus();
            //this.state.set(ConnectionState.DISCONNECTED);
            this.close();
            // TODO improve
        });
        this.peerConnected.connect((peer) => {
            //console.log("yippee")
            if (this.state.is(network_1.ConnectionState.CONNECTING)) {
                let status, [pending, connected, disconnected] = this.getIDStatus();
                //let [pending, connected, disconnected] = status;
                if (pending.size === 0) { // Everyone is done connecting
                    //this.checkStatus(status);
                    this.sendStatus(status);
                    this.state.set(network_1.ConnectionState.CONNECTED);
                }
            }
            else if (this.state.is(network_1.ConnectionState.CONNECTED)) { // Late join, send updated status
                this.sendStatus();
            }
        });
        this.peerDisconnected.connect((peer) => {
            if (this.state.is(network_1.ConnectionState.CONNECTING)) {
                //console.error("Connection failed.");
                this.close();
            }
        });
        this.closed.connect(() => {
            this.state.set(network_1.ConnectionState.DISCONNECTED);
            for (const peer of this.getPeers())
                this.dropPeer(peer);
        });
        this.initMessageHandling();
    }
    initMessageHandling() {
        this.addCondition(// Mesh is connecting or connected
        [
            signaling_1.MESH_TERMINATE,
            signaling_1.MESH_CONNECT_PEERS,
            signaling_1.MESH_DISCONNECT_PEERS,
            signaling_1.MESH_SESSION_DESCRIPTION_CREATED,
            signaling_1.MESH_ICE_CANDIDATE_CREATED,
        ], (packet) => {
            if (!this.state.any(network_1.ConnectionState.CONNECTING, network_1.ConnectionState.CONNECTED))
                return "Message received for mesh that is not initialized.";
        });
        this.addCondition([
            signaling_1.MESH_SESSION_DESCRIPTION_CREATED,
            signaling_1.MESH_ICE_CANDIDATE_CREATED
        ], (packet) => {
            let peer = this.getPeer(packet.data.peerID);
            if (peer == undefined || !peer.state.is(network_1.ConnectionState.CONNECTING))
                return "Invalid SDP/ICE transport.";
        });
        this.socket.onMessage(signaling_1.MESH_INITIALIZE, (packet) => {
            if (this.state.any(network_1.ConnectionState.CONNECTING, network_1.ConnectionState.CONNECTED)) {
                console.error("Attempted to initialize mesh that is already initialized.");
                return;
            }
            this.state.set(network_1.ConnectionState.CONNECTING);
            this.setID(packet.data.localID);
            this.createPeers(packet.data.peerIDs);
        });
        this.socket.onMessage(signaling_1.MESH_TERMINATE, (packet) => {
            this.close();
        });
        this.socket.onMessage(signaling_1.MESH_CONNECT_PEERS, (packet) => {
            this.createPeers(packet.data.peerIDs);
        });
        this.socket.onMessage(signaling_1.MESH_DISCONNECT_PEERS, (packet) => {
            this.dropPeers(packet.data.peerIDs);
        });
        this.socket.onMessage(signaling_1.MESH_SESSION_DESCRIPTION_CREATED, (packet) => {
            var _a;
            (_a = this.getPeer(packet.data.peerID)) === null || _a === void 0 ? void 0 : _a.setRemoteDescription({
                type: packet.data.type,
                sdp: packet.data.sdp
            });
        });
        this.socket.onMessage(signaling_1.MESH_ICE_CANDIDATE_CREATED, (packet) => {
            var _a;
            (_a = this.getPeer(packet.data.peerID)) === null || _a === void 0 ? void 0 : _a.addRemoteIceCandidate({
                candidate: packet.data.candidate,
                sdpMid: packet.data.sdpMid,
                sdpMLineIndex: packet.data.sdpMLineIndex,
                usernameFragment: packet.data.usernameFragment
            });
        });
        //this.onMessage(MESH_DISCONNECT_PEERS, (packet: Packet<RemoteMeshClient>) => {
        //});
    }
    createPeers(ids) {
        for (const id of ids) {
            if (id !== this.id && !this.ids.has(id)) // Error message?
                this.addPeer(new this.clientClass(), id);
        }
    }
    dropPeers(ids) {
        for (const id of ids) {
            let peer = this.getPeer(id);
            if (peer)
                this.dropPeer(peer);
        }
    }
    getPeerIDs(peers = this.peers) {
        let out = new Set();
        for (const peer of peers)
            out.add(peer.getID());
        return out;
    }
    /*private checkStatus(): [connected: Set<RemoteClientType>, disconnected: Set<RemoteClientType>, pending: Set<RemoteClientType>] {
        
        if (this.state.is(ConnectionState.CONNECTED)) {
            let status = this.getStatus();
            this.statusUpdate.emit(status);
            return status;
        }
        
    }*/
    sendStatus(status = this.getIDStatus()) {
        this.sendServer(signaling_1.MESH_CLIENT_STATUS_UPDATE, status);
    }
    isStable() {
        return this.stable;
    }
    sendServer(message, data) {
        this.socket.send(message, data);
    }
}
exports["default"] = LocalMeshClient;


/***/ }),
/* 10 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const signal_1 = __importDefault(__webpack_require__(4));
const network_1 = __webpack_require__(2);
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
exports["default"] = Socket;


/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MESH_CLIENT_STATUS_UPDATE = exports.MESH_STATUS_UPDATE = exports.MESH_ICE_CANDIDATE_CREATED = exports.MESH_SESSION_DESCRIPTION_CREATED = exports.MESH_STABILIZED = exports.MESH_DISCONNECT_PEERS = exports.MESH_CONNECT_PEERS = exports.MESH_TERMINATE = exports.MESH_INITIALIZE = void 0;
const arg_1 = __importDefault(__webpack_require__(8));
const network_1 = __webpack_require__(2);
const MESSAGE_INDEX = new network_1.MessageIndex();
/*export type StatusUpdate = {
    [ConnectionState.CONNECTING]: Array<number>,
    [ConnectionState.CONNECTED]: Array<number>,
    [ConnectionState.DISCONNECTED]: Array<number>,
};*/
//const STUN = MESSAGE_INDEX.newMessage(Message.RAW);
exports.MESH_INITIALIZE = MESSAGE_INDEX.newMessage({
    localID: arg_1.default.UINT2,
    peerIDs: arg_1.default.array(arg_1.default.UINT2)
});
exports.MESH_TERMINATE = MESSAGE_INDEX.newMessage();
exports.MESH_CONNECT_PEERS = MESSAGE_INDEX.newMessage({
    peerIDs: arg_1.default.array(arg_1.default.UINT2)
});
exports.MESH_DISCONNECT_PEERS = MESSAGE_INDEX.newMessage({
    peerIDs: arg_1.default.array(arg_1.default.UINT2)
});
//const MESH_CREATION_COMPLETED = MESSAGE_INDEX.newMessage();
exports.MESH_STABILIZED = MESSAGE_INDEX.newMessage();
//const MESH_DESTABILIZED = MESSAGE_INDEX.newMessage();
exports.MESH_SESSION_DESCRIPTION_CREATED = MESSAGE_INDEX.newMessage({
    peerID: arg_1.default.UINT2,
    type: arg_1.default.choice("offer", "answer"),
    sdp: arg_1.default.STRING2
});
exports.MESH_ICE_CANDIDATE_CREATED = MESSAGE_INDEX.newMessage({
    peerID: arg_1.default.UINT2,
    //media: Arg.STRING1,
    //index: Arg.UINT2,
    //name: Arg.STRING2
    candidate: arg_1.default.STRING2,
    sdpMid: arg_1.default.STRING2,
    sdpMLineIndex: arg_1.default.UINT2,
    usernameFragment: arg_1.default.STRING2
});
exports.MESH_STATUS_UPDATE = MESSAGE_INDEX.newMessage([]);
/*export const MESH_CLIENT_STATUS_UPDATE = MESSAGE_INDEX.newMessage([{
    pendingIDs: Arg.array(Arg.UINT2),
    connectedIDs: Arg.array(Arg.UINT2),
    disconnectedIDs: Arg.array(Arg.UINT2),
}]);*/
exports.MESH_CLIENT_STATUS_UPDATE = MESSAGE_INDEX.newMessage([
    arg_1.default.array(arg_1.default.UINT2),
    arg_1.default.array(arg_1.default.UINT2),
    arg_1.default.array(arg_1.default.UINT2)
]);
exports["default"] = MESSAGE_INDEX;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ })()
;