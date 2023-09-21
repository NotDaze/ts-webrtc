
export default class ByteIStream {

	private bytes: Uint8Array;
	private index = 0;

	
	constructor(bytes: Uint8Array) {
		this.bytes = bytes;
		//this.index = 0;
	}

	get complete(): boolean {
		return this.index >= this.bytes.length;
	}

	get exactComplete(): boolean {
		return this.index === this.bytes.length;
	}
	
	public next(count: number): Uint8Array {
		//console.log(this.bytes.slice(this.index, this.index + count));
		return this.bytes.slice(this.index, this.index += count);
	}
	
	public verifyExactComplete() {
		if (!this.exactComplete) {
			console.error("ByteIStream Error");
			console.error(this.bytes);
			console.error(this.index);
		}
	}
	
}
