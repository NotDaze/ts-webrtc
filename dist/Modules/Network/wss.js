"use strict";
//const WebSocket = require("ws");
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketServer = exports.Socket = void 0;
//import { Message, Packet, MessageIndex, MessageHandler } from "./network_message"
const ws_1 = require("ws");
//const Index = require("../core/index");
//const ByteStream = require("../core/bytestream");
const network_1 = require("./network");
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
class Socket extends network_1.RemotePeer {
    constructor(ws) {
        super();
        this.ws = ws;
        this.rawReceived.bindEvent(this.ws, "message");
        this.ws.on("close", (code, reason) => {
            this.close();
        });
        this.closed.connect(() => {
            this.ws.close();
        });
        this.state.set(network_1.ConnectionState.CONNECTED);
    }
    sendRaw(raw) {
        this.ws.send(raw);
    }
}
exports.Socket = Socket;
class SocketServer extends network_1.LocalMultiPeer {
    //private buffer = new ByteOStream();
    //protected socketCreation = new Signal<WebSocket>();
    constructor(socketClass, wssArgs = SocketServer.WSS_ARGS, messageIndex = new network_1.MessageIndex()) {
        super(messageIndex);
        //this.messageIndex = messageIndex;
        this.wss = new ws_1.WebSocketServer(wssArgs);
        this.connected.bindEvent(this.wss, "listening");
        //this.socketCreation.bindEvent(this.wss, "connection");
        this.wss.on("connection", (ws) => {
            this.addPeer(new socketClass(ws));
        });
        this.peerDisconnected.connect((peer) => {
            this.dropPeer(peer);
        });
    }
}
exports.SocketServer = SocketServer;
SocketServer.WSS_ARGS = {
    port: 5050,
    clientTracking: false
};
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
