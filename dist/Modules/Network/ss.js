"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignalingSocket = void 0;
const state_1 = __importDefault(require("../Core/state"));
const signal_1 = __importDefault(require("../Core/signal"));
const network_1 = require("./network");
const wss_1 = require("./wss");
const signaling_1 = __importStar(require("./MessageIndices/signaling"));
/*const MESSAGE_INDEX = new MessageIndex();

//const STUN = MESSAGE_INDEX.newMessage(Message.RAW);
const MESH_INITIALIZE = MESSAGE_INDEX.newMessage({
    localID: Arg.UINT2,
    peerIDs: Arg.array(Arg.UINT2)
});
const MESH_TERMINATE = MESSAGE_INDEX.newMessage();
const MESH_CONNECT_PEERS = MESSAGE_INDEX.newMessage({
    peerIDs: Arg.array(Arg.UINT2)
});
const MESH_DISCONNECT_PEERS = MESSAGE_INDEX.newMessage({
    peerIDs: Arg.array(Arg.UINT2)
});
const MESH_CONNECTION_STATUS_UPDATE = MESSAGE_INDEX.newMessage({
    connectedIDs: Arg.array(Arg.UINT2),
    //disconnectedIDs: Arg.array(Arg.UINT2)
    //failedIDs: Arg.array(Arg.UINT2),
});
//const MESH_CREATION_COMPLETED = MESSAGE_INDEX.newMessage();
const MESH_STABILIZED = MESSAGE_INDEX.newMessage();
//const MESH_DESTABILIZED = MESSAGE_INDEX.newMessage();

const MESH_SESSION_DESCRIPTION_CREATED = MESSAGE_INDEX.newMessage({
    peerID: Arg.UINT2,
    type: Arg.choice("offer", "answer"),
    sdp: Arg.STRING2
});
const MESH_ICE_CANDIDATE_CREATED = MESSAGE_INDEX.newMessage({
    peerID: Arg.UINT2,
    media: Arg.STRING1,
    index: Arg.UINT2,
    name: Arg.STRING2
});*/
/*MESSAGE_INDEX.addCondition(// Mesh stability update has room
    [MESH_STABILIZED, MESH_DESTABILIZED],
    (packet: Packet): boolean => {

        let room = packet.peer.getRoom() as Mesh;

        if (room == null || room.state.is(ConnectionState.NEW)) {
            console.error("Invalid mesh stability update");
            return false;
        }

        return true;

    }
);*/
/*MESSAGE_INDEX.addCondition( // Connection status update //
    MESH_CONNECTION_STATUS_UPDATE,
    (packet: Packet): boolean => {
        
        let room = packet.peer.getRoom() as Mesh;
        
        
        if (room == null || room.state.is(ConnectionState.NEW)) {
            console.error("Invalid mesh connection status update");
            return false;
        }
        
        return true;
        
    }
);
MESSAGE_INDEX.addCondition( // SDP/ICE forward has room and valid target //
    [MESH_SESSION_DESCRIPTION_CREATED, MESH_ICE_CANDIDATE_CREATED],
    (packet: Packet): boolean => {
        
        let room = packet.peer.getRoom() as Mesh;
        
        if (room == null || room.state.is(ConnectionState.NEW) || !room.hasSocket(packet.data.peerID)) {
            console.error("Invalid session description/ICE transport request");
            return false;
        }
        
        return true;
        
    }
);*/
/*type StatusUpdate {
    
    [key: ConnectionState]: Array<number>,
    
}*/
class Mesh extends network_1.Group {
    constructor(localPeer, stratum) {
        super(localPeer, stratum);
        //public started = new Signal<void>();
        this.stabilized = new signal_1.default();
        this.destabilized = new signal_1.default();
        this.disconnected = new signal_1.default();
        this.state = new state_1.default(network_1.ConnectionState.NEW);
        this.sockets = new network_1.RemotePeerIndex();
        //private nodeIndex = new Map<number, SignalingSocket>();
        this.stable = false;
        this.startThreshold = 2;
        this.capacity = 4;
        this.peersAdded.connect((peers) => {
            for (const peer of peers) {
                let id = this.sockets.getNextID();
                this.sockets.add(peer, id);
                peer.setMeshID(id);
            }
            for (const socket of peers) {
                this.createSocketConnections(socket);
                console.log("Socket joined: ", socket.getID());
            }
            this.attemptInitialize();
            this.checkStability();
        });
        this.peersLeaving.connect((peers) => {
            for (const socket of peers) {
                this.destroySocketConnections(socket);
                console.log("Socket left: ", socket.getID());
            }
        });
        this.peersRemoved.connect((peers) => {
            this.checkStability();
            if (this.isEmpty() && !this.state.is(network_1.ConnectionState.DISCONNECTED))
                this.terminate();
        });
        this.stabilized.connect(() => {
            this.sendAll(signaling_1.MESH_STABILIZED);
            console.log("Stabilized!");
        });
        this.destabilized.connect(() => {
            console.log("Destabilized!");
        });
    }
    getIDs() {
        return this.sockets.ids;
    }
    hasPeer(meshID) {
        return this.sockets.hasID(meshID);
    }
    getPeer(meshID) {
        return this.sockets.get(meshID);
    }
    calculateStability() {
        if (!this.state.any(network_1.ConnectionState.CONNECTING, network_1.ConnectionState.CONNECTED))
            return false;
        if (this.isEmpty())
            return false;
        for (const socket of this.getPeers()) {
            if (!socket.isStable())
                return false;
        }
        return true;
    }
    setStability(newStable) {
        if (this.stable != newStable) {
            this.stable = newStable;
            if (newStable) {
                if (this.state.is(network_1.ConnectionState.CONNECTING))
                    this.state.set(network_1.ConnectionState.CONNECTED);
                this.stabilized.emit();
            }
            else {
                this.destabilized.emit();
            }
        }
    }
    checkStability() {
        this.setStability(this.calculateStability());
    }
    createSocketConnections(newSocket) {
        if (!this.state.any(network_1.ConnectionState.CONNECTING, network_1.ConnectionState.CONNECTED))
            return; // if new or disconnected, don't make connections
        this.send(newSocket, signaling_1.MESH_INITIALIZE, {
            localID: newSocket.getMeshID(),
            peerIDs: this.getIDs()
        });
        this.sendAllExcept(newSocket, signaling_1.MESH_CONNECT_PEERS, {
            peerIDs: [newSocket.getMeshID()]
        });
    }
    destroySocketConnections(exitingSocket) {
        this.send(exitingSocket, signaling_1.MESH_TERMINATE);
        if (!this.state.is(network_1.ConnectionState.DISCONNECTED)) {
            // if disconnected everything is terminating already
            this.sendAllExcept(exitingSocket, signaling_1.MESH_DISCONNECT_PEERS, {
                peerIDs: [exitingSocket.getMeshID()]
            });
        }
    }
    isAcceptingSockets() {
        return !this.isFull();
    }
    canInitialize() {
        return this.state.is(network_1.ConnectionState.NEW) && this.getPeerCount() >= this.startThreshold;
    }
    initialize() {
        this.state.set(network_1.ConnectionState.CONNECTING);
        let ids = this.getIDs();
        for (const socket of this.getPeers()) {
            this.send(socket, signaling_1.MESH_INITIALIZE, {
                localID: socket.getMeshID(),
                peerIDs: ids
            });
        }
        console.log("Mesh initialized!");
    }
    attemptInitialize() {
        if (this.canInitialize())
            this.initialize();
    }
    terminate() {
        if (this.state.is(network_1.ConnectionState.DISCONNECTED)) {
            console.error("Mesh terminated while already disconnected.");
            return;
        }
        else {
            this.state.set(network_1.ConnectionState.DISCONNECTED);
            //this.remove(...this.getSockets());
            this.kill();
            console.log("Mesh terminated.");
        }
    }
    add(...sockets) {
        if (this.state.is(network_1.ConnectionState.DISCONNECTED)) {
            console.error("Mesh attempted to add sockets while disconnected.");
            return new Array();
        }
        return super.add(...sockets);
    }
    remove(...sockets) {
        return super.remove(...sockets);
    }
    setPairConnectionState(localSocket, remoteSocket, state) {
    }
    setPairConnectionStates(localSocket, remoteIDs, state) {
        for (const id of remoteIDs) {
            let peer = this.getPeer(id);
            if (peer != undefined && peer !== localSocket) {
                localSocket.setPeerConnectionState(peer, state);
            }
        }
    }
    handleConnectionStatusUpdate(localSocket, pendingIDs, connectedIDs, disconnectedIDs) {
        //console.log(localSocket.getMeshID(), " <-> ", connectedIDs);
        this.setPairConnectionStates(localSocket, pendingIDs, network_1.ConnectionState.CONNECTING);
        this.setPairConnectionStates(localSocket, connectedIDs, network_1.ConnectionState.CONNECTED);
        this.setPairConnectionStates(localSocket, disconnectedIDs, network_1.ConnectionState.DISCONNECTED);
        localSocket.checkStability();
        /*for (const remoteSocket of this.getPeers()) {
            
            if (remoteSocket === localSocket)
                continue;
            
            let state: ConnectionState;
            
            if (connectedIDs.includes(remoteSocket.getMeshID()))
                state = ConnectionState.CONNECTED;
            else
                state = ConnectionState.DISCONNECTED;
            
            localSocket.setConnectionState(remoteSocket, state);
            
            
            let otherState = remoteSocket.getConnectionState(localSocket);
            
            if (otherState != ConnectionState.CONNECTING && otherState != state) {
                // something strange happened...
                // TODO handle this
            }
            
        }
        
        this.checkStability();*/
        this.checkStability();
        // maybe verify that the match has all the provided IDs
    }
}
class SignalingSocket extends wss_1.Socket {
    constructor(ws) {
        super(ws);
        this.meshID = -1;
        this.stable = false;
        this.connectionStates = new Map();
    }
    hasMeshID() {
        return this.meshID >= 0;
    }
    getMeshID() {
        return this.meshID;
    }
    setMeshID(newID) {
        this.meshID = newID;
    }
    clearMeshID() {
        this.setMeshID(-1);
    }
    calculateStability() {
        for (const connectionState of this.connectionStates.values()) {
            if (connectionState != network_1.ConnectionState.CONNECTED)
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
        this.setStability(this.calculateStability());
    }
    isStable() {
        return this.stable;
    }
    setPeerConnectionState(node, state) {
        if (node == this)
            return;
        this.connectionStates.set(node, state);
        //console.log(this.getRoomID(), " -> ", node.getRoomID(), ": ", state);
        //this.checkStability();
    }
    clearConnectionState(node) {
        this.connectionStates.delete(node);
        //this.checkStability();
    }
    hasConnectionState(node) {
        return this.connectionStates.has(node);
    }
    getConnectionState(node) {
        let state = this.connectionStates.get(node);
        return state != null ? state : network_1.ConnectionState.CONNECTING;
    }
}
exports.SignalingSocket = SignalingSocket;
class SignalingServer extends wss_1.SocketServer {
    constructor(socketClass, wssArgs = wss_1.SocketServer.WSS_ARGS) {
        //let b = SignalingSocket;
        //let a = new b();
        super(socketClass, wssArgs, signaling_1.default);
        //static MESSAGE_INDEX = new MessageIndex();
        //private matches = new Array<Mesh>();
        this.meshes = new Set();
        this.peerConnected.connect((peer) => {
            this.findMesh(peer).add(peer);
        });
        this.addCondition(// Has active mesh
        [
            signaling_1.MESH_CLIENT_STATUS_UPDATE,
            signaling_1.MESH_SESSION_DESCRIPTION_CREATED,
            signaling_1.MESH_ICE_CANDIDATE_CREATED
        ], (packet) => {
            let mesh = this.getMesh(packet.peer);
            if (!mesh || !mesh.has(packet.peer) || !mesh.state.any(network_1.ConnectionState.CONNECTING, network_1.ConnectionState.CONNECTED))
                return "No active mesh.";
        });
        this.addCondition(// Valid transport request
        [
            signaling_1.MESH_SESSION_DESCRIPTION_CREATED,
            signaling_1.MESH_ICE_CANDIDATE_CREATED
        ], (packet) => {
            let mesh = this.getMesh(packet.peer);
            let target = mesh === null || mesh === void 0 ? void 0 : mesh.getPeer(packet.data.peerID);
            if (!target || !(mesh === null || mesh === void 0 ? void 0 : mesh.has(target)))
                return "Invalid SDP/ICE transport request.";
            // verify that they aren't already connected, maybe
        });
        this.onMessage(signaling_1.MESH_CLIENT_STATUS_UPDATE, (packet) => {
            let mesh = this.getMesh(packet.peer);
            mesh === null || mesh === void 0 ? void 0 : mesh.handleConnectionStatusUpdate(packet.peer, packet.data.pendingIDs, packet.data.connectedIDs, packet.data.disconnectedIDs);
        });
        this.onMessage(signaling_1.MESH_SESSION_DESCRIPTION_CREATED, (packet) => {
            // peerID, type, sdp
            let mesh = this.getMesh(packet.peer);
            let target = mesh === null || mesh === void 0 ? void 0 : mesh.getPeer(packet.data.peerID);
            console.log(packet.data);
            console.log("SDP: ", packet.peer.getMeshID(), " -> ", packet.data.peerID);
            this.send(target, signaling_1.MESH_SESSION_DESCRIPTION_CREATED, {
                peerID: packet.peer.getID(),
                type: packet.data.type,
                sdp: packet.data.sdp
            });
        });
        this.onMessage(signaling_1.MESH_ICE_CANDIDATE_CREATED, (packet) => {
            // peerID, media, index, name
            let mesh = this.getMesh(packet.peer);
            let target = mesh === null || mesh === void 0 ? void 0 : mesh.getPeer(packet.data.peerID);
            console.log("ICE: ", packet.peer.getMeshID(), " -> ", packet.data.peerID);
            this.send(target, signaling_1.MESH_ICE_CANDIDATE_CREATED, {
                peerID: packet.peer.getID(),
                candidate: packet.data.candidate,
                sdpMid: packet.data.sdpMid,
                sdpMLineIndex: packet.data.sdpMLineIndex,
                usernameFragment: packet.data.usernameFragment
            });
        });
    }
    createSocket(ws) {
        return new SignalingSocket(ws);
    }
    createMesh() {
        let mesh = new Mesh(this, this.meshes);
        this.meshes.add(mesh);
        mesh.disconnected.connect(() => {
            this.meshes.delete(mesh);
            console.log("Closing match");
        });
        return mesh;
    }
    findMesh(socket) {
        for (const mesh of this.meshes) {
            if (mesh.isAcceptingSockets()) {
                return mesh;
            }
        }
        return this.createMesh();
    }
    getMesh(socket) {
        return socket.getStratumGroup(this.meshes);
    }
}
exports.default = SignalingServer;
