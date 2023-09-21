
import Signal from "./signal"


export default class State<Type> {
	
	public changed = new Signal<[Type, Type]>(); // old, new
	
	public value: Type;
	
	constructor(value: Type) {
		this.value = value;
	}
	
	public is(value: Type): boolean {
		return this.value == value;
	}
	public any(...values: Array<Type>): boolean {
		return values.includes(this.value);
	}
	
	public set(newValue: Type) {
		
		if (this.value !== newValue) {
			
			let oldValue = this.value;
			this.value = newValue;
			
			this.changed.emit([oldValue, newValue]);
			
		}
		
	}
	
	
}


