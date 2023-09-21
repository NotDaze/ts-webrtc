
import EventEmitter from "events";
import PrioritySet from "./priority_set";
//const PrioritySet = require("./priority_set");


export class SignalListener {
		
	private connections = new Map<Signal<any>, Set<(arg: any) => void>>();

	private register<ArgType>(signal: Signal<ArgType>, callback: (arg: ArgType) => void) {
		
		if (!this.connections.has(signal))
			this.connections.set(signal, new Set());
		
		this.connections.get(signal)?.add(callback);
		
	}
	
	public pconnect<ArgType>(signal: Signal<ArgType>, priority: number, callback: (arg: ArgType) => void): (arg: ArgType) => void {
		this.register(signal, callback);
		return signal.pconnect(priority, callback);
	}
	public connect<ArgType>(signal: Signal<ArgType>, callback: (arg: ArgType) => void): (arg: ArgType) => void {
		this.register(signal, callback);
		return signal.connect(callback);
	}
	public disconnect<ArgType>(signal: Signal<ArgType>, callback: (arg: ArgType) => void): void {
		
		if (this.connections.has(signal))
			this.connections.get(signal)?.delete(callback);
		
		return signal.disconnect(callback);
		
	}
	public disconnectAll(): void {
		
		for (const [signal, callbacks] of this.connections) {
			
			for (const callback of callbacks)
				signal.disconnect(callback);
			
		}
		
		this.connections.clear();
		
	}
	
}

export default class Signal<ArgType> {
	
	//static DISCONNECT: symbol = Symbol();
	
	private callbacks = new PrioritySet<Function>();
	
	static fromEvent<ArgType>(emitter: EventEmitter, event: string): Signal<ArgType> {
		let signal = new Signal<ArgType>();
		signal.bindEvent(emitter, event);
		return signal;
	}
	static fromSignal<ArgType>(signal: Signal<ArgType>) {
		let newSignal = new Signal<ArgType>();
		newSignal.bindSignal(signal);
		return newSignal;
	}
	
	
	
	public bindEvent(emitter: EventEmitter, event: string) {
		emitter.on(event, this.emit.bind(this)); // fuck javascript
	}
	public bindSignal(signal: Signal<ArgType>): void {
		signal.connect(this.emit.bind(this));
	}
	
	public pconnect(priority: number, callback: (arg: ArgType) => any): (arg: ArgType) => void {
		this.callbacks.add(priority, callback);
		return callback;
	}
	public connect(callback: (arg: ArgType) => void): (arg: ArgType) => void {
		return this.pconnect(0, callback);
	}
	public disconnect(callback: (arg: ArgType) => void): void {
		this.callbacks.delete(callback);
	}
	public disconnectAll(): void {
		this.callbacks.clear();
	}
	
	public emit(arg: ArgType): void {
		
		for (const callback of this.callbacks) {
			
			//let out = callback(args);
			callback(arg);
			
			//if (out === Signal.DISCONNECT)
			//	this.disconnect(callback);
			
		}
		
	}
	
}
