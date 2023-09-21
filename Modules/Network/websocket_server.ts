


//const WebSocket = require("ws");

import ByteIStream from "../Core/byteistream"
import ByteOStream from "../Core/byteostream"
import Deferrable from "../Core/deferrable"
import Signal from "../Core/signal"

import Arg from "./arg"

//import { Message, Packet, MessageIndex, MessageHandler } from "./network_message"
import { WebSocket, WebSocketServer, ServerOptions as WebSocketServerOptions } from "ws"

//const Index = require("../core/index");

//const ByteStream = require("../core/bytestream");


import {
	ConnectionState,
	
	Packet,
	Message,
	MessageHandler,
	MessageIndex,
	
	Group,
	LocalMultiPeer,
	RemotePeer,
	
} from "./network"



/*export class Room {
	
	public killed = new Signal<void>();
	
	//public emptied = new Signal<void>();
	//public filled = new Signal<void>();
	
	public socketsAdded = new Signal<Array<Socket>>();
	public socketsRemoved = new Signal<Array<Socket>>();
	protected socketsLeaving = new Signal<Array<Socket>>();
	
	protected socketIndex = new Map<number, Socket>();
	protected nextID = 0; // probably convert to an array of freed IDs
	
	protected capacity?: number;
	//private tags = new Set<Symbol>();
	
	public hasSocket(id: number): boolean {
		return this.socketIndex.has(id);
	}
	public getSocket(id: number): Socket | undefined {
		return this.socketIndex.get(id);
	}
	
	public getSocketCount(): number {
		return this.socketIndex.size;
	}
	public getSockets(): Array<Socket> {
		return Array.from(this.socketIndex.values());
	}
	public getSocketIDs(): Array<number> {
		return Array.from(this.socketIndex.keys());
	}
	
	public hasCapacity(): boolean {
		return this.capacity != null;
	}
	public getCapacity(): number {
		return this.capacity == null ? -1 : this.capacity;
	}
	public getRemainingCapacity(): number {
		return this.capacity == null ? -1 : (this.capacity - this.getSocketCount());
	}
	
	public isEmpty(): boolean {
		return this.socketIndex.size == 0;
	}
	public isFull(): boolean {
		return this.capacity != null && this.socketIndex.size >= this.capacity;
	}
	
	public has(socket: Socket): boolean {
		return socket.getRoom() === this && this.socketIndex.get(socket.getRoomID()) === socket;
	}
	public add(...sockets: Array<Socket>): Array<Socket> {
		
		let added = new Array<Socket>();
		
		for (const socket of sockets) {
			
			if (!this.has(socket)) {
				
				let id = this.nextID++;
				
				socket.handleRoomEntry(this, id);
				this.socketIndex.set(id, socket);
				
				added.push(socket);
				
			}
			
			if (this.isFull()) {
				//this.filled.emit();
				break;
			}
			
		}
		
		this.socketsAdded.emit(added);
		
		return added;
		
	};
	public remove(...sockets: Array<Socket>): Array<Socket> {
		
		let removed = sockets.filter(this.has.bind(this));
		
		for (const socket of sockets) {
			if (this.has(socket)) {
				removed.push(socket);
			}
		}
		
		this.socketsLeaving.emit(removed);
		
		for (const socket of removed) {
			this.socketIndex.delete(socket.getRoomID());
			socket.handleRoomExit(this);
		}
		
		this.socketsRemoved.emit(removed);
		
		return removed;
		
	};
	
	public kill() {
		
		this.remove(...this.getSockets());
		this.killed.emit();
		
	}
	
	//public getID(socket: Socket) {
	//	return socket.roomID;
	//}
	
}
*/
export class Socket extends RemotePeer {
	
	//public rawReceived = Signal.fromEvent(this, "message");
	//public closed = Signal.fromEvent(this, "closed");
	
	private ws: WebSocket;
	
	constructor(ws: WebSocket) {
		
		super();
		this.ws = ws;
		
		this.rawReceived.bindEvent(this.ws, "message");
		
		this.ws.on("close", (code: number, reason: Buffer): void => {
			this.close();
		});
		
		this.closed.connect(() => {
			this.ws.close();
		});
		
		this.state.set(ConnectionState.CONNECTED);
		
	}
	
	sendRaw(raw: Uint8Array): void {
		this.ws.send(raw);
	}
	
}

export class SocketServer<SocketType extends Socket> extends LocalMultiPeer<SocketType> {
	
	static WSS_ARGS: WebSocketServerOptions = {
		port: 5050,
		clientTracking: false
	};
	
	//private webSocketConnected: Signal<WebSocket>;
	
	//public sockets = new Set<Socket>();
	
	private wss: WebSocketServer;
	
	//private buffer = new ByteOStream();
	
	//protected socketCreation = new Signal<WebSocket>();
	
	
	constructor(socketClass: { new(ws: WebSocket): SocketType }, wssArgs = SocketServer.WSS_ARGS, messageIndex = new MessageIndex()) {
		
		super(messageIndex);
		
		//this.messageIndex = messageIndex;
		this.wss = new WebSocketServer(wssArgs);
		
		this.connected.bindEvent(this.wss, "listening");
		//this.socketCreation.bindEvent(this.wss, "connection");
		
		this.wss.on("connection", (ws: WebSocket) => {
			this.addPeer(new socketClass(ws));
		});
		
		this.peerDisconnected.connect((peer: SocketType) => {
			this.dropPeer(peer);
		});
		
	}
	
/*	public bStart(): void {
		this.buffer.clear();
	}
	public bAddRaw(raw: Uint8Array): void {
		this.buffer.write(raw);
	}
	public bAdd(message: Message, data? : any): void {
		this.bAddRaw(this.createRaw(message, data));
	}
	public bSend(target: Socket | Array<Socket>): void {
		this.sendRaw(target, this.buffer.bytes);
	}*/
	
	
	//public createAcknowledgement(message: Message, sockets: Socket | Iterable<Socket>): Acknowledgement {
		//console.log(this, this.onMessage, this.addCallback);
		//return new Acknowledgement(this, message, sockets);
		
		/*return new Promise<Array<Packet>>((
			resolve: ((value: Array<Packet> | PromiseLike<Array<Packet>>) => void),
			reject: ((reason: any) => void)
		): void => {
			
			if (this.condition == null || (this.sockets.has(packet.socket) && this.condition(packet))) {
				
				this.sockets.delete(packet.socket);
				
				if (this.sockets.size == 0)
					this.complete();
				
			}
			
		});*/
		
	//}
	
}

//const wss = new WebSocket.Server({ port: 5050, WebSocket: WebSocketClient });


/*class Server {
	
	constructor(port) {
		
		this.wss = new WebSocket.Server({ port });
		
	}
	
}*/




/*wss.on("listening", () => {
	
});*/


/*wss.on("connection", (socket) => {
	
	console.log("Connection Established!");
	socket.client = new Client(socket, messageIndex);
	
	//socket.send("whee");
	
	socket.on("message", (data) => {
		
		
		console.log(data instanceof Uint8Array);
		socket.send(data);
		
		
	});
	
	socket.on("request", () => {
		
	});
	
	socket.on("close", () => {
		
	});
	
});*/
