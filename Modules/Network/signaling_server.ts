


import State from "../Core/state"
import Signal from "../Core/signal"

import { WebSocket } from "ws"
import Arg from "./arg"
import {
	
	ConnectionState,
	
	Message,
	MessageIndex,
	MessageHandler,
	Packet,
	
	RemotePeerIndex,
	//LocalMultiPeer,
	//RemotePeer,
	
	Group,
	MultiPeerConnectionStatus,
	
} from "./network"
import {
	Socket,
	SocketServer,
} from "./websocket_server"

import SignalingMessages, {
	
	MESH_INITIALIZE,
	MESH_TERMINATE,
	MESH_CONNECT_PEERS,
	MESH_DISCONNECT_PEERS,
	MESH_STABILIZED,
	MESH_ICE_CANDIDATE_CREATED,
	MESH_SESSION_DESCRIPTION_CREATED,
	MESH_STATUS_UPDATE,
	MESH_CLIENT_STATUS_UPDATE
	
} from "./MessageIndices/signaling"

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

class Mesh<SocketType extends SignalingSocket> extends Group<SocketType> {
	
	//public started = new Signal<void>();
	
	stabilized = new Signal<void>();
	destabilized = new Signal<void>();
	
	disconnected = new Signal<void>();
	
	public state = new State(ConnectionState.NEW);
	
	protected peerIndex = new RemotePeerIndex<SocketType>();
	
	//private nodeIndex = new Map<number, SignalingSocket>();
	private stable = false;
	
	private startThreshold = 2;
	
	protected get ids() {
		return this.peerIndex.ids;
	}
	/*protected get peers() {
		return this.peerIndex.peers;
	}*/
	
	constructor(localPeer: SignalingServer<SocketType>, stratum: Set<Mesh<SocketType>>) {
		
		super(localPeer, stratum);
		
		this.capacity = 4;
		
		this.peersAdded.connect((peers: Array<SocketType>): void => {
			
			for (const peer of peers) {
				
				let id = this.peerIndex.getNextID();
				this.peerIndex.add(peer, id);
				peer.setMeshID(id);
				
			}
			
			for (const socket of peers) {
				
				this.createSocketConnections(socket);
				
				console.log("Socket joined: ", socket.getID());
				
			}
			
			this.attemptInitialize();
			this.checkStability();
			
		});
		this.peersLeaving.connect((peers: Array<SocketType>): void => {
			
			for (const socket of peers) {
				
				this.destroySocketConnections(socket);
				
				console.log("Socket left: ", socket.getID());
				
			}
			
		});
		this.peersRemoved.connect((peers: Array<SocketType>): void => {
			
			this.checkStability();
			
			if (this.isEmpty() && !this.state.is(ConnectionState.DISCONNECTED))
				this.terminate();
			
		});
		
		this.stabilized.connect((): void => {
			
			this.sendAll(MESH_STABILIZED);
			console.log("Stabilized!");
			
		});
		this.destabilized.connect((): void => {
			
			console.log("Destabilized!");
			
		});
		
	}
	
	public hasPeer(meshID: number): boolean {
		return this.peerIndex.hasPeer(meshID);
	}
	public getPeer(meshID: number): SocketType | undefined {
		return this.peerIndex.getPeer(meshID);
	}
	
	private calculateStability(): boolean {
		
		if (!this.state.any(ConnectionState.CONNECTING, ConnectionState.CONNECTED))
			return false;
		
		if (this.isEmpty())
			return false;
		
		for (const socket of this.getPeers()) {
			
			if (!socket.isStable())
				return false;
			
		}
		
		return true;
		
	}
	private setStability(newStable: boolean): void {
		
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
	private checkStability(): void {
		this.setStability(this.calculateStability());
	}
	
	private createSocketConnections(newSocket: SocketType): void {
		
		if (!this.state.any(ConnectionState.CONNECTING, ConnectionState.CONNECTED))
			return; // if new or disconnected, don't make connections
		
		this.send(newSocket, MESH_INITIALIZE, {
			localID: newSocket.getMeshID(),
			peerIDs: this.ids
		});
		
		this.sendAllExcept(newSocket, MESH_CONNECT_PEERS, {
			peerIDs: [newSocket.getMeshID()]
		});
		
	}
	private destroySocketConnections(exitingSocket: SocketType): void {
		
		this.send(exitingSocket, MESH_TERMINATE);
		
		if (!this.state.is(ConnectionState.DISCONNECTED)) {
			// if disconnected everything is terminating already
			
			this.sendAllExcept(exitingSocket, MESH_DISCONNECT_PEERS, {
				peerIDs: [exitingSocket.getMeshID()]
			});
		}
		
	}
	
	public isAcceptingSockets(): boolean {
		return !this.isFull();
	}
	
	
	public canInitialize(): boolean {
		return this.state.is(ConnectionState.NEW) && this.getPeerCount() >= this.startThreshold;
	}
	public initialize(): void {
		
		this.state.set(ConnectionState.CONNECTING);
		
		for (const socket of this.getPeers()) {
			
			this.send(socket, MESH_INITIALIZE, {
				localID: socket.getMeshID(),
				peerIDs: this.ids
			});
			
		}
		
		console.log("Mesh initialized!");
		
	}
	public attemptInitialize(): void {
		if (this.canInitialize())
			this.initialize();
	}
	
	public terminate(): void {
		
		if (this.state.is(ConnectionState.DISCONNECTED)) {
			console.error("Mesh terminated while already disconnected.");
			return;
		}
		else {
			
			this.state.set(ConnectionState.DISCONNECTED);
			//this.remove(...this.getSockets());
			this.kill();
			
			console.log("Mesh terminated.");
			
		}
		
	}
	
	public add(...sockets: Array<SocketType>): Array<SocketType> {
		
		if (this.state.is(ConnectionState.DISCONNECTED)) {
			console.error("Mesh attempted to add sockets while disconnected.");
			return new Array<SocketType>();
		}
		
		return super.add(...sockets);
		
	}
	public remove(...sockets: Array<SocketType>): Array<SocketType> {
		return super.remove(...sockets);
	}
	
	private setPairConnectionState(localSocket: SocketType, remoteSocket: SocketType, state: ConnectionState): void {
		
	}
	private setPairConnectionStates(localSocket: SocketType, remoteIDs: Iterable<number>, state: ConnectionState): void {
		
		for (const id of remoteIDs) {
			
			let peer = this.getPeer(id);
			
			if (peer != undefined && peer !== localSocket)
				localSocket.setPeerConnectionState(peer, state);
			
		}
		
		localSocket.checkStability();
		
	}
	public handleConnectionStatusUpdate(localSocket: SocketType, [pendingIDs, connectedIDs, disconnectedIDs]: MultiPeerConnectionStatus<number>): void {
		
		//console.log(localSocket.getMeshID(), " <-> ", connectedIDs);
		
		
		this.setPairConnectionStates(localSocket, pendingIDs, ConnectionState.CONNECTING);
		this.setPairConnectionStates(localSocket, connectedIDs, ConnectionState.CONNECTED);
		this.setPairConnectionStates(localSocket, disconnectedIDs, ConnectionState.DISCONNECTED);
		
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


export class SignalingSocket extends Socket {
	
	private meshID = -1;
	private stable = false;
	
	private connectionStates = new Map<SignalingSocket, ConnectionState>();
	
	constructor(ws: WebSocket) {
		super(ws);
	}
	
	public hasMeshID(): boolean {
		return this.meshID >= 0;
	}
	public getMeshID(): number {
		return this.meshID;
	}
	
	public setMeshID(newID: number): void {
		this.meshID = newID;
	}
	public clearMeshID(): void {
		this.setMeshID(-1);
	}
	
	private calculateStability(): boolean {
		
		for (const connectionState of this.connectionStates.values()) {
			
			if (connectionState != ConnectionState.CONNECTED)
				return false;
			
		}
		
		return true;
		
	}
	private setStability(newStable: boolean): void {
		if (this.stable != newStable) {
			this.stable = newStable;
		}
	}
	public checkStability() {
		this.setStability(this.calculateStability());
	}
	public isStable(): boolean {
		return this.stable;
	}
	
	public setPeerConnectionState(node: SignalingSocket, state: ConnectionState): void {
		
		if (node == this)
			return;
		
		this.connectionStates.set(node, state);
		//console.log(this.getRoomID(), " -> ", node.getRoomID(), ": ", state);
		//this.checkStability();
		
	}
	public clearConnectionState(node: SignalingSocket): void {
		this.connectionStates.delete(node);
		//this.checkStability();
	}
	
	public hasConnectionState(node: SignalingSocket): boolean {
		return this.connectionStates.has(node);
	}
	public getConnectionState(node: SignalingSocket): ConnectionState {
		
		let state = this.connectionStates.get(node);
		return state != null ? state : ConnectionState.CONNECTING;
		
	}
	
	
}

export default class SignalingServer<SocketType extends SignalingSocket = SignalingSocket> extends SocketServer<SocketType> {
	
	//static MESSAGE_INDEX = new MessageIndex();
	
	//private matches = new Array<Mesh>();
	private meshes = new Set<Mesh<SocketType>>();
	
	
	constructor(socketClass: { new(ws: WebSocket): SocketType }, wssArgs = SocketServer.WSS_ARGS) {
		
		//let b = SignalingSocket;
		//let a = new b();
		
		super(socketClass, wssArgs, SignalingMessages);
		
		this.peerConnected.connect((peer: SocketType) => {
			this.findMesh(peer).add(peer);
		});
		
		
		this.addCondition( // Has active mesh
			[
				MESH_CLIENT_STATUS_UPDATE,
				MESH_SESSION_DESCRIPTION_CREATED,
				MESH_ICE_CANDIDATE_CREATED
			],
			(packet: Packet<SocketType>) => {
				
				let mesh = this.getMesh(packet.peer);
				
				if (!mesh || !mesh.has(packet.peer) || !mesh.state.any(ConnectionState.CONNECTING, ConnectionState.CONNECTED))
					return "No active mesh.";
				
			}
		);
		this.addCondition( // Valid transport request
			[
				MESH_SESSION_DESCRIPTION_CREATED,
				MESH_ICE_CANDIDATE_CREATED
			],
			(packet: Packet<SocketType>) => {
				
				let mesh = this.getMesh(packet.peer);
				let target = mesh?.getPeer(packet.data.peerID) as SocketType;
				
				if (!target || !mesh?.has(target))
					return "Invalid SDP/ICE transport request."
				// verify that they aren't already connected, maybe
				
			}
		)
		
		this.onMessage(MESH_CLIENT_STATUS_UPDATE, (packet: Packet<SocketType>) => {
			
			let mesh = this.getMesh(packet.peer);
			mesh?.handleConnectionStatusUpdate(
				packet.peer,
				packet.data
				/*[
					packet.data.pendingIDs,
					packet.data.connectedIDs,
					packet.data.disconnectedIDs
				]*/
			);
			
		});
		this.onMessage(MESH_SESSION_DESCRIPTION_CREATED, (packet: Packet<SocketType>) => {
			// peerID, type, sdp
			let mesh = this.getMesh(packet.peer);
			let target = mesh?.getPeer(packet.data.peerID) as SocketType;
			
			console.log(packet.data);
			console.log("SDP: ", packet.peer.getMeshID(), " -> ", packet.data.peerID);
			
			this.send(target, MESH_SESSION_DESCRIPTION_CREATED, {
				peerID: packet.peer.getID(),
				type: packet.data.type,
				sdp: packet.data.sdp
			});
			
		});
		this.onMessage(MESH_ICE_CANDIDATE_CREATED, (packet: Packet<SocketType>) => {
			// peerID, media, index, name
			let mesh = this.getMesh(packet.peer);
			let target = mesh?.getPeer(packet.data.peerID) as SocketType;
			
			console.log("ICE: ", packet.peer.getMeshID(), " -> ", packet.data.peerID);
			
			this.send(target, MESH_ICE_CANDIDATE_CREATED, {
				peerID: packet.peer.getID(),
				candidate: packet.data.candidate,
				sdpMid: packet.data.sdpMid,
				sdpMLineIndex: packet.data.sdpMLineIndex,
				usernameFragment: packet.data.usernameFragment
			});
			
		});
		
	}
	
	protected createSocket(ws: WebSocket): SignalingSocket {
		return new SignalingSocket(ws);
	}
	
	public createMesh(): Mesh<SocketType> {
		
		let mesh = new Mesh<SocketType>(this, this.meshes);
		this.meshes.add(mesh);
		
		mesh.disconnected.connect(() => {
			
			this.meshes.delete(mesh);
			console.log("Closing match");
			
		});
		
		return mesh;
		
	}
	public findMesh(socket: SignalingSocket): Mesh<SocketType> {
		
		for (const mesh of this.meshes) {
			if (mesh.isAcceptingSockets()) {
				return mesh;
			}
		}
		
		return this.createMesh();
		
	}
	public getMesh(socket: SignalingSocket): Mesh<SocketType> | undefined {
		return socket.getStratumGroup(this.meshes) as Mesh<SocketType>;
	}
	
}
