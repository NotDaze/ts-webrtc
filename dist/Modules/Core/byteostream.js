"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ByteOStream {
    static join(...byteArrays) {
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
    constructor(...segments) {
        this.segments = segments.slice();
    }
    write(bytes) {
        this.segments.push(bytes);
    }
    clear() {
        this.segments = new Array();
    }
    get bytes() {
        this.segments = [ByteOStream.join(...this.segments)];
        return this.segments[0];
    }
}
exports.default = ByteOStream;
