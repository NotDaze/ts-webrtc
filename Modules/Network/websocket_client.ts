

import Signal from "../Core/signal"
import {
	
	ConnectionState,
	
	Packet,
	Message,
	MessageHandler,
	MessageIndex,
	
	LocalMonoPeer,
	
} from "./network"



export default class Socket extends LocalMonoPeer {
	
	
	public closed = new Signal<void>();
	//public error = new Signal<void>();
	
	
	private ws: WebSocket;
	
	constructor(url: string, protocols?: Array<string>, messageIndex = new MessageIndex(), messageHandler = new MessageHandler<void>()) {
		
		super(messageIndex, messageHandler);
		
		this.ws = new WebSocket(url, protocols);
		
		this.ws.binaryType = "arraybuffer";
		
		this.ws.onopen = (e: Event) => { this.state.set(ConnectionState.CONNECTED) };
		this.ws.onclose = (e: CloseEvent) => { this.close() };
		this.ws.onerror = (e: Event) => { this.close() };
		this.ws.onmessage = (e: MessageEvent<ArrayBuffer>) => { this.handleRaw(undefined, new Uint8Array(e.data)) };
		
	}
	
	
	send(message: Message, data?: any): void {
		this.ws.send(this.messageIndex.createRaw(message, data));
	}
	
	
}

