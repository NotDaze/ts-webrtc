



export default class PrioritySet<Type> {
	
	private map = new Map<number, Set<Type>>();
	private priorities = new Array<number>();
	
	
	*[Symbol.iterator] () {
		
		for (const priority of this.priorities) {
			
			let values = this.map.get(priority);
			
			if (values) {
				
				for (const value of values) {
					yield value;
				}
				
			}
			
			/*let values = this.map.get(this.priorities[i]);
			
			for(let j = values.length - 1; j >= 0; j--) {
				yield values[j];
			}*/
		}
		
	}
	
	*backwards() {
		
		for (const priority of this.priorities) {
			
			let values = this.map.get(priority);
			
			if (values) {
				for (const value of values) {
					yield value;
				}
			}
			
		}
		
	}
	
	/*get priorities() {
		return this.priorities;
	}
	get values() {
		return this.map;
	}*/


	private addPriority(priority: number): void {
		
		for (let i = 0; i < this.priorities.length; i++) {
			
			if (priority < this.priorities[i]) {
				this.priorities.splice(i, 0, priority);
				return;
			}
			
		}
		
		this.priorities.push(priority);
		
	}
	private deletePriority(priority: number): void {
		
		// should probably binary search
		let index = this.priorities.indexOf(priority);
		
		if (index >= 0) this.priorities.splice(index, 1);
		
	}
	
	public has(value: Type): boolean {
		
		for (const set of this.map.values()) {
			if (set.has(value)) return true;
		}
		
		return false;
		
	}
	public add(priority: number, ...values: Type[]): void {
		
		if (values.length === 0) return;

		let set = this.map.get(priority);

		if (set) {

			for (const value of values) {
				set.add(value);
			}
			
		}
		else {

			this.addPriority(priority);
			this.map.set(priority, new Set<Type>(values));
			
		}
		
		
	}
	public delete(...values: Type[]) {
			
		for (const priority of this.priorities) {

			let set = this.map.get(priority);

			if (set) {
				for (const value of values)
					set.delete(value);
			}

			/*let arr = this.map.get(priority);

			if (arr) {

				let index = arr.indexOf(value);

				if (index >= 0) {
					arr.splice(index, 1);

					if (arr.length === 0) {
						this.#deletePriority(priority);
						this.map.delete(priority);
					}

					break;
				}
			}*/
		}

	}
	
	public clear() {
		
		this.map.clear();
		this.priorities = new Array<number>();
		
	}
	
	
	
}

