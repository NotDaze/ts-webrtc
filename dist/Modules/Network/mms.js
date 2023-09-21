"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const state_1 = __importDefault(require("../Core/state"));
const signal_1 = __importDefault(require("../Core/signal"));
const arg_1 = __importDefault(require("./arg"));
const wss_1 = require("./wss");
const MESSAGE_INDEX = new wss_1.MessageIndex();
//const STUN = MESSAGE_INDEX.newMessage(Message.RAW);
const MESH_INITIALIZE = MESSAGE_INDEX.newMessage({
    localID: arg_1.default.UINT2,
    peerIDs: arg_1.default.array(arg_1.default.UINT2)
});
const MESH_TERMINATE = MESSAGE_INDEX.newMessage();
const MESH_CONNECT_PEERS = MESSAGE_INDEX.newMessage({
    peerIDs: arg_1.default.array(arg_1.default.UINT2)
});
const MESH_DISCONNECT_PEERS = MESSAGE_INDEX.newMessage({
    peerIDs: arg_1.default.array(arg_1.default.UINT2)
});
const MESH_CONNECTION_STATUS_UPDATE = MESSAGE_INDEX.newMessage({
    connectedIDs: arg_1.default.array(arg_1.default.UINT2),
    //disconnectedIDs: Arg.array(Arg.UINT2)
    //failedIDs: Arg.array(Arg.UINT2),
});
//const MESH_CREATION_COMPLETED = MESSAGE_INDEX.newMessage();
const MESH_STABILIZED = MESSAGE_INDEX.newMessage();
//const MESH_DESTABILIZED = MESSAGE_INDEX.newMessage();
const SESSION_DESCRIPTION_CREATED = MESSAGE_INDEX.newMessage({
    peerID: arg_1.default.UINT2,
    type: arg_1.default.choice("offer", "answer"),
    sdp: arg_1.default.STRING2
});
const ICE_CANDIDATE_CREATED = MESSAGE_INDEX.newMessage({
    peerID: arg_1.default.UINT2,
    media: arg_1.default.STRING1,
    index: arg_1.default.UINT2,
    name: arg_1.default.STRING2
});
/*MESSAGE_INDEX.addCondition(// Mesh stability update has room
    [MESH_STABILIZED, MESH_DESTABILIZED],
    (packet: Packet): boolean => {
        
        let room = packet.socket.getRoom() as Match;
        
        if (room == null || room.state.is(ConnectionState.NEW)) {
            console.error("Invalid mesh stability update");
            return false;
        }
        
        return true;
        
    }
);*/
MESSAGE_INDEX.addCondition(// Connection status update //
MESH_CONNECTION_STATUS_UPDATE, (packet) => {
    let room = packet.socket.getRoom();
    if (room == null || room.state.is(ConnectionState.NEW)) {
        console.error("Invalid mesh connection status update");
        return false;
    }
    return true;
});
MESSAGE_INDEX.addCondition(// SDP/ICE forward has room and valid target //
[SESSION_DESCRIPTION_CREATED, ICE_CANDIDATE_CREATED], (packet) => {
    let room = packet.socket.getRoom();
    if (room == null || room.state.is(ConnectionState.NEW) || !room.hasSocket(packet.data.peerID)) {
        console.error("Invalid session description/ICE transport request");
        return false;
    }
    return true;
});
var ConnectionState;
(function (ConnectionState) {
    ConnectionState[ConnectionState["NEW"] = 0] = "NEW";
    ConnectionState[ConnectionState["CONNECTING"] = 1] = "CONNECTING";
    ConnectionState[ConnectionState["CONNECTED"] = 2] = "CONNECTED";
    ConnectionState[ConnectionState["DISCONNECTED"] = 3] = "DISCONNECTED";
})(ConnectionState || (ConnectionState = {}));
class MeshNode {
    constructor(socket) {
        this.stable = false;
        this.connectionIndex = new Map();
        this.socket = socket;
    }
    getStability() {
        for (const connectionState of this.connectionIndex.values()) {
            if (connectionState != ConnectionState.CONNECTED)
                return false;
        }
        return true;
    }
    setStability(newStable) {
        if (this.stable != newStable) {
            this.stable = newStable;
        }
    }
    checkStability() {
        this.setStability(this.getStability());
    }
    isStable() {
        return this.stable;
    }
    getSocket() {
        return this.socket;
    }
    getRoomID() {
        return this.socket.getRoomID();
    }
    setConnectionState(node, state) {
        if (node == this)
            return;
        this.connectionIndex.set(node, state);
        //console.log(this.getRoomID(), " -> ", node.getRoomID(), ": ", state);
        this.checkStability();
    }
    clearConnectionState(node) {
        this.connectionIndex.delete(node);
        this.checkStability();
    }
    hasConnectionState(node) {
        return this.connectionIndex.has(node);
    }
    getConnectionState(node) {
        let state = this.connectionIndex.get(node);
        return state != null ? state : ConnectionState.CONNECTING;
    }
}
class Match extends wss_1.Room {
    constructor(server) {
        super();
        //public started = new Signal<void>();
        this.stabilized = new signal_1.default();
        this.destabilized = new signal_1.default();
        this.state = new state_1.default(ConnectionState.NEW);
        this.nodeIndex = new Map();
        this.stable = false;
        this.startThreshold = 2;
        this.server = server;
        this.capacity = 4;
        this.socketsAdded.connect((sockets) => {
            for (const socket of sockets) {
                this.createSocketNode(socket);
                this.createSocketConnections(socket);
                console.log("Socket joined: ", socket.getRoomID());
            }
            this.attemptInitialize();
            this.checkStability();
        });
        this.socketsLeaving.connect((sockets) => {
            for (const socket of sockets) {
                this.removeSocketNode(socket);
                this.destroySocketConnections(socket);
                console.log("Socket left: ", socket.getRoomID());
            }
        });
        this.socketsRemoved.connect((sockets) => {
            this.checkStability();
            if (this.isEmpty() && !this.state.is(ConnectionState.DISCONNECTED))
                this.terminate();
        });
        this.stabilized.connect(() => {
            this.sendAll(MESH_STABILIZED);
            console.log("Stabilized!");
        });
        this.destabilized.connect(() => {
            console.log("Destabilized!");
        });
    }
    sendAll(message, data) {
        this.server.send(this.getSockets(), message, data);
    }
    sendAllExcept(excluded, message, data) {
        let excludedSockets = Array.isArray(excluded) ? excluded : [excluded];
        this.server.send(this.getSockets().filter((socket) => {
            return !excludedSockets.includes(socket);
        }), message, data);
    }
    getStability() {
        if (!this.state.any(ConnectionState.CONNECTING, ConnectionState.CONNECTED))
            return false;
        if (this.isEmpty())
            return false;
        for (const node of this.getNodes()) {
            if (!node.isStable())
                return false;
        }
        return true;
    }
    setStability(newStable) {
        if (this.stable != newStable) {
            this.stable = newStable;
            if (newStable) {
                if (this.state.is(ConnectionState.CONNECTING))
                    this.state.set(ConnectionState.CONNECTED);
                this.stabilized.emit();
            }
            else {
                this.destabilized.emit();
            }
        }
    }
    checkStability() {
        this.setStability(this.getStability());
    }
    createSocketNode(socket) {
        let newNode = new MeshNode(socket);
        for (const node of this.getNodes()) {
            node.setConnectionState(newNode, ConnectionState.CONNECTING);
            newNode.setConnectionState(node, ConnectionState.CONNECTING);
        }
        this.nodeIndex.set(socket.getRoomID(), newNode);
    }
    removeSocketNode(socket) {
        let id = socket.getRoomID();
        let removedNode = this.getNode(id);
        if (!removedNode) {
            console.error("Error: Attempting to remove invalid node | ", id);
        }
        else {
            for (const node of this.getNodes()) {
                node.clearConnectionState(removedNode);
            }
            this.nodeIndex.delete(id);
        }
    }
    createSocketConnections(newSocket) {
        if (!this.state.any(ConnectionState.CONNECTING, ConnectionState.CONNECTED))
            return; // if new or disconnected, don't make connections
        this.server.send(newSocket, MESH_INITIALIZE, {
            localID: newSocket.getRoomID(),
            peerIDs: this.getSocketIDs()
        });
        this.sendAllExcept(newSocket, MESH_CONNECT_PEERS, {
            peerIDs: [newSocket.getRoomID()]
        });
    }
    destroySocketConnections(exitingSocket) {
        this.server.send(exitingSocket, MESH_TERMINATE);
        if (!this.state.is(ConnectionState.DISCONNECTED)) {
            // if disconnected everything is terminating already
            this.sendAllExcept(exitingSocket, MESH_DISCONNECT_PEERS, {
                peerIDs: [exitingSocket.getRoomID()]
            });
        }
    }
    isAcceptingSockets() {
        return !this.isFull();
    }
    getSocketNode(socket) {
        if (!this.has(socket)) {
            console.error("Attempting to get Node of invalid Socket.");
            return undefined;
        }
        return this.nodeIndex.get(socket.getRoomID());
    }
    getNode(id) {
        return this.nodeIndex.get(id);
    }
    getNodes() {
        return Array.from(this.nodeIndex.values());
    }
    canInitialize() {
        return this.state.is(ConnectionState.NEW) && this.getSocketCount() >= this.startThreshold;
    }
    initialize() {
        this.state.set(ConnectionState.CONNECTING);
        let ids = this.getSocketIDs();
        for (const socket of this.getSockets()) {
            this.server.send(socket, MESH_INITIALIZE, {
                localID: socket.getRoomID(),
                peerIDs: ids
            });
        }
        console.log("Match initialized!");
    }
    attemptInitialize() {
        if (this.canInitialize())
            this.initialize();
    }
    terminate() {
        if (this.state.is(ConnectionState.DISCONNECTED)) {
            console.error("Match terminated while already disconnected.");
            return;
        }
        else {
            this.state.set(ConnectionState.DISCONNECTED);
            //this.remove(...this.getSockets());
            this.kill();
            console.log("Match terminated.");
        }
    }
    add(...sockets) {
        if (this.state.is(ConnectionState.DISCONNECTED)) {
            console.error("Match attempted to add sockets while disconnected.");
            return new Array();
        }
        return super.add(...sockets);
    }
    remove(...sockets) {
        return super.remove(...sockets);
    }
    handleConnectionStatusUpdate(socket, connectedIDs) {
        console.log(socket.getRoomID(), " <-> ", connectedIDs);
        let localNode = this.getSocketNode(socket);
        if (!localNode) {
            return;
        }
        for (const remoteNode of this.getNodes()) {
            if (remoteNode != localNode) {
                let state;
                if (connectedIDs.includes(remoteNode.getRoomID()))
                    state = ConnectionState.CONNECTED;
                else
                    state = ConnectionState.DISCONNECTED;
                localNode.setConnectionState(remoteNode, state);
                let otherState = remoteNode.getConnectionState(localNode);
                if (otherState != ConnectionState.CONNECTING && otherState != state) {
                    // something strange happened...
                    // TODO handle this
                }
            }
        }
        this.checkStability();
        // maybe verify that the match has all the provided IDs
    }
}
class MatchmakingServer extends wss_1.SocketServer {
    constructor(wss_args = wss_1.SocketServer.WSS_ARGS) {
        super(MESSAGE_INDEX, wss_args);
        this.matches = new Array();
        this.socketConnected.connect((socket) => {
            this.findMatch(socket).add(socket);
        });
        this.onMessage(MESH_CONNECTION_STATUS_UPDATE, (packet) => {
            let match = packet.socket.getRoom();
            match.handleConnectionStatusUpdate(packet.socket, packet.data.connectedIDs);
        });
        this.onMessage(SESSION_DESCRIPTION_CREATED, (packet) => {
            // peerID, type, sdp
            let room = packet.socket.getRoom();
            let target = room.getSocket(packet.data.peerID);
            //console.log(packet);
            this.send(target, SESSION_DESCRIPTION_CREATED, {
                peerID: packet.socket.getRoomID(),
                type: packet.data.type,
                sdp: packet.data.sdp
            });
        });
        this.onMessage(ICE_CANDIDATE_CREATED, (packet) => {
            // peerID, media, index, name
            let room = packet.socket.getRoom();
            let target = room.getSocket(packet.data.peerID);
            this.send(target, ICE_CANDIDATE_CREATED, {
                peerID: packet.socket.getRoomID(),
                media: packet.data.media,
                index: packet.data.index,
                name: packet.data.name
            });
        });
    }
    createMatch() {
        let match = new Match(this);
        this.matches.push(match);
        match.killed.connect(() => {
            let index = this.matches.indexOf(match);
            if (index >= 0) {
                this.matches.splice(index, 1);
                console.log("Ending match");
            }
        });
        return match;
    }
    findMatch(socket) {
        for (const match of this.matches) {
            if (match.isAcceptingSockets()) {
                return match;
            }
        }
        return this.createMatch();
    }
}
exports.default = MatchmakingServer;
