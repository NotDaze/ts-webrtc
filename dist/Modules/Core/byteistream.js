"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ByteIStream {
    constructor(bytes) {
        this.index = 0;
        this.bytes = bytes;
        //this.index = 0;
    }
    get complete() {
        return this.index >= this.bytes.length;
    }
    get exactComplete() {
        return this.index === this.bytes.length;
    }
    next(count) {
        //console.log(this.bytes.slice(this.index, this.index + count));
        return this.bytes.slice(this.index, this.index += count);
    }
    verifyExactComplete() {
        if (!this.exactComplete) {
            console.error("ByteIStream Error");
            console.error(this.bytes);
            console.error(this.index);
        }
    }
}
exports.default = ByteIStream;
