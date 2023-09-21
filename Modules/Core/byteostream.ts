

export default class ByteOStream {
	
	static join(...byteArrays: Array<Uint8Array>): Uint8Array {
		
		if (byteArrays.length === 0)
			return new Uint8Array();
		if (byteArrays.length === 1)
			return byteArrays[0].slice();
		
		let totalLength = 0;
		
		for (const byteArray of byteArrays) {
			totalLength += byteArray.length;
		}
		
		let out = new Uint8Array(totalLength);
		let nextIndex = 0;
		
		for (const byteArray of byteArrays) {
			out.set(byteArray, nextIndex);
			nextIndex += byteArray.length;
		}
		
		return out;
		
	}
	
	private segments: Array<Uint8Array>;
	
	constructor(...segments: Array<Uint8Array>) {
		
		this.segments = segments.slice();
		
	}
	
	public write(bytes : Uint8Array) {
		this.segments.push(bytes);
	}
	public clear() {
		this.segments = new Array<Uint8Array>();
	}
	
	get bytes(): Uint8Array {
		this.segments = [ ByteOStream.join(...this.segments) ];
		return this.segments[0];
	}
	
	
}

