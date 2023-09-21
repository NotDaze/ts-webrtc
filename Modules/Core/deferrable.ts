
enum State {
	PENDING,
	RESOLVED,
	REJECTED,
}

/*export default class Deferrable<Type> implements PromiseLike<Type> {
	
	
	private state = State.PENDING;
	private resolvedCallbacks = new Array<(value: Type) => any>();
	
	private bound = new Set<Deferrable<any>>();
	
	
	public resolve() {
		
		if (this.state == State.PENDING) {
			this.state = State.RESOLVED;
			
		}
		
	}
	
}*/


export default class Deferrable<Type> {
	
	private res?: (value: Type | PromiseLike<Type>) => void;
	private rej?: (reason?: any) => void;
	
	private promise: Promise<Type>;
	
	constructor() {
		
		this.promise = new Promise<Type>(
			(resolve: (value: Type | PromiseLike<Type>) => void, reject: (reason?: any) => void): void => {
				
				this.res = resolve;
				this.rej = reject;
				
			}
		);
		
	}
	
	/*public then<ResolveType, RejectType = never>(
		resolve?: (value: Type) => ResolveType | PromiseLike<ResolveType>,
		reject?: (reason: any) => RejectType
	): Promise<ResolveType|RejectType> {
		return this.promise.then(resolve, reject);
	}*/
	public then<ResolveType = never>(
		onresolved: (value: Type) => ResolveType | PromiseLike<ResolveType>
	): Promise<ResolveType> {
		return this.promise.then(onresolved);
	}
	public catch<RejectType = never>(
		onrejected: (reason: any) => RejectType | PromiseLike<RejectType>
	): Promise<Type|RejectType> {
		return this.promise.catch(onrejected);
	}
	
	// make these protected..?
	public resolve(value: Type | PromiseLike<Type>): void {
		if (this.res != null)
			this.res(value);
	}
	public reject(reason?: any): void {
		if (this.rej != null)
			this.rej(reason);
	}
	
}


