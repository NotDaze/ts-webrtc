

export class ArrayMap<KeyType, ValueType> {
	
	private map = new Map<KeyType, ValueType[]>();
	
	*[Symbol.iterator] () {
		for (const value of this.map) yield value;
	}
	
	keys(): IterableIterator<KeyType> {
		return this.map.keys();
	}
	/*values() {
		return this.map.values();
	}*/
	
	
	has(key: KeyType) {
		return this.map.has(key);
	}
	
	get(key: KeyType) {
		return this.map.get(key);
	}
	
	set(key: KeyType, ...values: ValueType[]) {
		
		if (values.length === 0)
			this.map.delete(key);
		else
			this.map.set(key, values);
		
	}
	delete(key: KeyType) {
		this.map.delete(key);
	}
	
	
	add(key: KeyType, ...values: ValueType[]) {
		
		let keyValues = this.get(key);
		
		if (keyValues === undefined)
			this.set(key, ...values);
		else
			keyValues.concat(values);
		
	}
	
	
	
	remove(key: KeyType, ...values: ValueType[]) {
		
		let keyValues = this.get(key);
		
		if (keyValues === undefined) return;
		
		for (let i = keyValues.length - 1; i >= 0; i--) {
			
			if (values.includes(keyValues[i]))
				keyValues.splice(i, 1);
			
		}
		
		if (keyValues.length === 0)
			this.delete(key);
		
	}
	
	
	
}
