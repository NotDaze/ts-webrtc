"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteMeshClient = void 0;
const signal_1 = __importDefault(require("../Core/signal"));
const network_1 = require("./network");
//import Arg from "../Network/arg"
const websocket_client_1 = __importDefault(require("./websocket_client"));
const signaling_1 = __importStar(require("./MessageIndices/signaling"));
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
exports.default = LocalMeshClient;
