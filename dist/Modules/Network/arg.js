"use strict";
//const ByteStream = require("../Core/bytestream");
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const byteistream_1 = __importDefault(require("../Core/byteistream"));
const byteostream_1 = __importDefault(require("../Core/byteostream"));
const LOG256 = Math.log(256);
const TEXT_ENCODER = new TextEncoder();
const TEXT_DECODER = new TextDecoder();
;
//import { joinByteArrays, ByteOStream, ByteIStream } from "../Core/byteistream"
class HeaderFootprint {
    constructor(iterations, bytes) {
        this.iterations = iterations;
        this.bytes = bytes;
    }
}
class Arg {
    static setSafe(newSafe) {
        this.safe = newSafe;
    }
    static calculateByteCount(choiceCount) {
        return Math.max(1, Math.ceil(Math.log(choiceCount) / LOG256));
    }
    static calculateChoiceCount(byteCount) {
        return 1 << 8 * byteCount;
    }
    static joinByteArrays(...byteArrays) {
        return byteostream_1.default.join(...byteArrays);
    }
    static encodeInt(value, byteCount) {
        byteCount = (byteCount != null ? byteCount : Arg.calculateByteCount(value));
        let out = new Uint8Array(byteCount);
        for (let i = 0; i < byteCount; i++) {
            out[i] = (value & 255);
            value = value >> 8;
        }
        if (value > 0) {
        }
        return out;
    }
    static decodeInt(bytes) {
        let out = 0;
        for (let i = 0; i < bytes.length; i++) {
            out += (bytes[i] << i * 8);
        }
        return out;
    }
    static encodeFloat(value, min, precision, byteCount) {
        return this.encodeInt(Math.round((value - min) / precision), byteCount);
    }
    static decodeFloat(bytes, min, precision) {
        return min + this.decodeInt(bytes) * precision;
    }
    static encodeStr(str) {
        return TEXT_ENCODER.encode(str);
    }
    static decodeStr(bytes) {
        return TEXT_DECODER.decode(bytes);
    }
    static createHeader(footprint, byteCount) {
        if (footprint.iterations <= 0)
            return new Uint8Array();
        let segments = new Array;
        for (let i = 0; i < footprint.iterations; i++) {
            let lengthToEncode = (i == 0 ? byteCount : segments[0].length);
            let newSegmentLength = Arg.calculateByteCount(lengthToEncode);
            if (i == footprint.iterations - 1) { // last iteration
                if (footprint.bytes < newSegmentLength)
                    throw "Length header too small to encode value";
                newSegmentLength = footprint.bytes;
            }
            segments.unshift(this.encodeInt(lengthToEncode, newSegmentLength));
        }
        return Arg.joinByteArrays(...segments);
    }
    static withHeader(footprint, bytes) {
        return Arg.joinByteArrays(this.createHeader(footprint, bytes.length), bytes);
    }
    static resolveHeader(stream, footprint) {
        let byteCount = footprint.bytes;
        for (let i = 0; i < footprint.iterations; i++) {
            byteCount = this.decodeInt(stream.next(byteCount));
        }
        return byteCount;
    }
    static matches(arg, value) {
        if (arg == null) {
            return value == null;
        }
        else if (arg instanceof Arg) {
            return arg.matches(value);
        }
        else if (Array.isArray(arg)) {
            if (!Array.isArray(value) || arg.length !== value.length)
                return false;
            for (let i = 0; i < arg.length; i++) {
                if (!this.matches(arg[i], value[i]))
                    return false;
            }
            return true;
        }
        else {
            for (const key in arg) {
                if (!this.matches(arg[key], (key in value) ? value[key] : null))
                    return false;
            }
            return true;
        }
    }
    static matchesAll(arg, values) {
        for (const value of values) {
            if (!Arg.matches(arg, value))
                return false;
        }
        return true;
    }
    static streamEncodeAll(arg, values, stream) {
        for (const value of values) {
            Arg.streamEncode(arg, value, stream);
        }
    }
    static streamDecodeAll(arg, count, stream) {
        let out = new Array();
        for (let i = 0; i < count; i++) {
            out.push(Arg.streamDecode(arg, stream));
        }
        return out;
    }
    static encode(arg, value) {
        if (!this.matches(arg, value))
            console.error("Arg/Value Mismatch | ", value, " | ", arg);
        let stream = new byteostream_1.default();
        this.streamEncode(arg, value, stream);
        return stream.bytes;
    }
    static streamEncode(arg, value, stream) {
        if (arg == null) {
            if (value != null)
                console.error("Invalid null arg footprint.");
        }
        else if (arg instanceof Arg) {
            arg.streamEncode(value, stream);
        }
        else if (Array.isArray(arg)) {
            for (let i = 0; i < arg.length; i++)
                this.streamEncode(arg[i], value[i], stream);
        }
        else {
            for (const key in arg) {
                this.streamEncode(arg[key], value[key], stream);
            }
        } // TODO: improve error handling
    }
    static decode(arg, bytes) {
        return this.streamDecode(arg, new byteistream_1.default(bytes));
    }
    static streamDecodeSafe(arg, stream) {
        let decoded = this.streamDecode(arg, stream);
        stream.verifyExactComplete();
        return decoded;
    }
    static streamDecode(arg, stream) {
        if (arg == null) {
            return null;
        }
        else if (arg instanceof Arg) {
            return arg.streamDecode(stream);
        }
        else if (arg instanceof Array) {
            let decoded = new Array();
            for (const subarg of arg)
                decoded.push(this.streamDecode(subarg, stream));
            return decoded;
        }
        else {
            let decoded = {};
            for (const key in arg) {
                decoded[key] = this.streamDecode(arg[key], stream);
            }
            return decoded;
        }
    }
    static test(arg, value) {
        let encoded = Arg.encode(arg, value);
        let decoded = Arg.decode(arg, encoded);
        //console.log("Arg test failed!");
        console.log(value);
        console.log(decoded);
        console.log(encoded);
    }
    static int(byteCount, min) {
        return new IntArg(byteCount, min);
    }
    static float(min, max, precision = 0.01) {
        return new FloatArg(min, max, precision);
    }
    static str(iterCount = 1, byteCount = 2) {
        return new StrArg(iterCount, byteCount);
    }
    static choice(...choices) {
        return new ChoiceArg(...choices);
    }
    static array(arg, byteCount = 2) {
        return new ArrayArg(arg, byteCount);
    }
    static branch(...paths) {
        return new BranchArg(paths);
    }
    static const(value) {
        return new ConstArg(value, true);
    }
    static auto(value) {
        return new ConstArg(value, false);
    }
    static default(arg, fallback) {
        return new BranchArg([new ConstArg(fallback, false), arg]);
    }
    static optional(arg) {
        return Arg.default(arg, null);
    }
    constructor(headerFootprint) {
        this.headerFootprint = headerFootprint;
    }
    matches(value) {
        console.error("Override Arg.matches");
        return false;
    }
    encode(value) {
        console.error("Override Arg.encode");
        return new Uint8Array();
    }
    streamEncode(value, stream) {
        stream.write(this.encode(value));
    }
    decode(bytes) {
        console.error("Override Arg.decode");
    }
    streamDecode(stream) {
        let byteCount = Arg.resolveHeader(stream, this.headerFootprint);
        let bytes = stream.next(byteCount);
        return this.decode(bytes);
    }
}
Arg.safe = true;
exports.default = Arg;
class ChoiceArg extends Arg {
    constructor(...choices) {
        super(new HeaderFootprint(0, Arg.calculateByteCount(choices.length)));
        this.choices = choices;
    }
    matches(value) {
        return this.choices.includes(value);
    }
    encode(value) {
        let index = this.choices.indexOf(value);
        if (index < 0)
            console.error("Invalid ChoiceArg choice: ", value, " | ", this.choices);
        return Arg.encodeInt(index, this.headerFootprint.bytes);
    }
    decode(bytes) {
        return this.choices[Arg.decodeInt(bytes)];
    }
}
class IntArg extends Arg {
    constructor(byteCount, min = 0) {
        super(new HeaderFootprint(0, byteCount));
        this.min = min;
        this.max = min + Arg.calculateChoiceCount(byteCount);
    }
    matches(value) {
        if (typeof value != "number")
            return false;
        return Number.isInteger(value) && value >= this.min && value < this.max;
    }
    encode(value) {
        return Arg.encodeInt(value - this.min, this.headerFootprint.bytes);
    }
    decode(bytes) {
        return Arg.decodeInt(bytes) + this.min;
    }
}
class FloatArg extends Arg {
    constructor(min, max, precision) {
        if (precision === undefined)
            precision = 0.01;
        super(new HeaderFootprint(0, Arg.calculateByteCount((max - min) / precision)));
        this.min = (min === undefined ? 0 : min);
        this.max = this.min + precision * Arg.calculateChoiceCount(this.headerFootprint.bytes);
        this.precision = precision;
    }
    matches(value) {
        if (typeof value != "number")
            return false;
        return value >= this.min && value < this.max;
    }
    encode(value) {
        return Arg.encodeFloat(value, this.min, this.precision, this.headerFootprint.bytes);
    }
    decode(bytes) {
        return Arg.decodeFloat(bytes, this.min, this.precision);
    }
}
class StrArg extends Arg {
    constructor(iterations, bytes) {
        super(new HeaderFootprint(iterations, bytes));
    }
    matches(value) {
        if (typeof value != "string")
            return false;
        return true; // TODO: should probably length check
    }
    encode(value) {
        return Arg.withHeader(this.headerFootprint, Arg.encodeStr(value));
    }
    decode(bytes) {
        return Arg.decodeStr(bytes);
    }
}
class ArrayArg extends Arg {
    constructor(arg, byteCount = 2) {
        // special length header that tells how many copies of the sublist you get
        // also, this is certified black magic
        super(new HeaderFootprint(1, byteCount));
        this.arg = arg;
    }
    matches(values) {
        if (!Array.isArray(values) && !(values instanceof Set))
            return false;
        return Arg.matchesAll(this.arg, values);
    }
    /*public encode(values: Array<any>): Uint8Array {
        
        return Arg.joinByteArrays(
            Arg.createHeader(this.headerFootprint, values.length), // header
            ...(values.map(value => { return Arg.encode(this.arg, value) })) // encoded values
        );
        
        //return Arg.joinByteArrays([ header, encoded ]);
        
    }*/
    streamEncode(values, stream) {
        stream.write(Arg.createHeader(this.headerFootprint, Array.isArray(values) ? values.length : values.size));
        //for (const value of values)
        //	Arg.streamEncode(this.arg, value, stream);
        Arg.streamEncodeAll(this.arg, values, stream);
    }
    streamDecode(stream) {
        return Arg.streamDecodeAll(this.arg, Arg.resolveHeader(stream, this.headerFootprint), stream);
        /*let decoded = new Array<any>();
        
        for (let i = 0; i < valueCount; i++) {
            decoded.push(Arg.streamDecode(this.arg, stream));
        }
        
        
        return decoded;*/
    }
}
class DictArg extends Arg {
    constructor(keyArg, valueArg, byteCount = 2) {
        super(new HeaderFootprint(1, byteCount));
        this.keyArg = keyArg;
        this.valueArg = valueArg;
    }
    matches(obj) {
        if (obj instanceof Map)
            return Arg.matchesAll(this.keyArg, obj.keys()) && Arg.matchesAll(this.valueArg, obj.values());
        else if (typeof obj == "object" && Object.getPrototypeOf(obj) === Object.prototype)
            return Arg.matchesAll(this.keyArg, Object.keys(obj)) && Arg.matchesAll(this.valueArg, Object.values(obj));
        else
            return false;
    }
    streamEncode(obj, stream) {
        if (obj instanceof Map) {
            stream.write(Arg.createHeader(this.headerFootprint, obj.size));
            for (const [key, value] of obj) {
                Arg.streamEncode(this.keyArg, key, stream);
                Arg.streamEncode(this.valueArg, value, stream);
            }
        }
        else { // Generic object, probably a literal
            let keys = Object.keys(obj);
            stream.write(Arg.createHeader(this.headerFootprint, keys.length));
            for (const key of keys) {
                Arg.streamEncode(this.keyArg, key, stream);
                Arg.streamEncode(this.valueArg, obj[key], stream);
            }
        }
    }
    streamDecode(stream) {
        let valueCount = Arg.resolveHeader(stream, this.headerFootprint);
        let decoded = {};
        for (let i = 0; i < valueCount; i++) {
            let key = Arg.streamDecode(this.keyArg, stream);
            let value = Arg.streamDecode(this.valueArg, stream);
            decoded[key] = value;
        }
        return decoded;
    }
}
class BranchArg extends Arg {
    constructor(paths, byteCount = 1) {
        super(new HeaderFootprint(1, byteCount));
        this.paths = Array.from(paths);
    }
    matches(value) {
        for (const path of this.paths) {
            if (Arg.matches(path, value))
                return true;
        }
        return false;
    }
    streamEncode(value, stream) {
        for (let i = 0; i < this.paths.length; i++) {
            //console.log(i)
            if (Arg.matches(this.paths[i], value)) { // Use first matching path
                stream.write(Arg.encodeInt(i, this.headerFootprint.bytes));
                Arg.streamEncode(this.paths[i], value, stream);
                return;
            }
        }
        console.error("No match found for BranchArg.");
    }
    streamDecode(stream) {
        let path = Arg.resolveHeader(stream, this.headerFootprint);
        return Arg.streamDecode(// Header tells us which path to use
        this.paths[path], stream);
    }
}
class ConstArg extends Arg {
    constructor(value, mandatory = true) {
        super(new HeaderFootprint(0, 0));
        this.value = value;
        this.mandatory = mandatory;
    }
    matches(value) {
        if (value === this.value)
            return true;
        else if (value == null)
            return !this.mandatory;
        else
            return false;
    }
    streamEncode(value, stream) {
        if (value == null) {
            if (this.mandatory) {
                console.error("Invalid value for mandatory constArg");
            }
        }
        else if (value != this.value) {
            console.error("Invalid value for ConstArg");
        }
    }
    streamDecode(stream) {
        return this.value;
    }
}
Arg.UINT1 = Arg.int(1, 0);
Arg.UINT2 = Arg.int(2, 0);
Arg.UINT4 = Arg.int(4, 0);
Arg.UINT6 = Arg.int(6, 0);
Arg.INT1 = Arg.int(1, -128);
Arg.INT2 = Arg.int(2, -32768);
Arg.INT4 = Arg.int(4, -2147483648);
Arg.INT6 = Arg.int(6, -281474976710656);
Arg.CHAR = Arg.str(0, 1);
Arg.STRING1 = Arg.str(1, 1);
Arg.STRING2 = Arg.str(1, 2);
Arg.BOOL = Arg.choice(false, true);
/*let arg = {
    peerID: Arg.UINT2,
    //media: Arg.STRING1,
    //index: Arg.UINT2,
    //name: Arg.STRING2
    candidate: Arg.STRING2,
    sdpMLineIndex: Arg.INT2,
    sdpMid: Arg.STRING2,
    usernameFragment: Arg.STRING2
};*/
/*let encoded = Arg.encode(arg, {
    peerID: 2,
    candidate: "candidate",
    sdpMLineIndex: 12,
    sdpMid: "yeah",
    usernameFragment: "yeah"
})*/
//let encoded = Arg.encode(arg, { peerID: 0, candidate: "candidate:0 1 UDP 2122252543 ebde5967-d563-4beb-bada-3bc12fa08c35.local 62385 typ host", sdpMid: "0", sdpMLineIndex: 0, usernameFragment: "65db9032" });
/*let arg = Arg.STRING2;

let encoded = new Uint8Array([ 7, 0, 0, 0, 0, 0, 1, 0, 48, 0, 128, 8, 0, 99, 51, 52, 51, 50, 55, 98, 52 ]);


console.log(Arg.decode({
    peerID: Arg.UINT2,
    //media: Arg.STRING1,
    //index: Arg.UINT2,
    //name: Arg.STRING2
    candidate: Arg.STRING2,
    sdpMid: Arg.STRING2,
    sdpMLineIndex: Arg.UINT2,
    usernameFragment: Arg.STRING2
}, encoded))

Arg.test({
    peerID: Arg.UINT2,
    //media: Arg.STRING1,
    //index: Arg.UINT2,
    //name: Arg.STRING2
    candidate: Arg.STRING2,
    sdpMid: Arg.STRING2,
    sdpMLineIndex: Arg.UINT2,
    usernameFragment: Arg.STRING2
}, { peerID: 0, candidate: "candidate:0 1 UDP 2122252543 ebde5967-d563-4beb-bada-3bc12fa08c35.local 62385 typ host", sdpMid: "0", sdpMLineIndex: 0, usernameFragment: "65db9032" });
//console.log(encoded, Arg.decode(arg, encoded))*/
//console.log(Arg.decode(Arg.INT1, Arg.encode(Arg.INT1, 120)));
//console.log(Arg.encode(arg, 1));
/*let arg = Arg.UINT1;
let argList = [ arg, Arg.array([ arg, arg ]), { a: [ arg, arg ], b: arg } ];


let encoded = Arg.encode(argList, [0, [[1, 2], [3, 4], [5, 7]], { a: [ 55, 77 ], b: 66 }]);

console.log(encoded);

let decoded = Arg.decode(argList, encoded);

console.log(decoded);*/
/*let arg = Arg.branch(
    Arg.array(Arg.UINT1),
    Arg.array(Arg.STRING2),
    Arg.array(Arg.array(Arg.CHAR)),
    { x: Arg.UINT1, y: Arg.UINT1 },
    [ Arg.UINT2, Arg.UINT2 ],
    null
);

//console.log(Arg.encode(arg, [ 1, 2 ]));

let encoded = Arg.encode(arg, { x: 2, y: 10 });
//let encoded = Arg.encode(arg, null);
//let encoded = Arg.encode(arg, [ 1, 2, 255, 33, 85 ]);
//let encoded = Arg.encode(arg, [ ["a", "b"], ["c"] ]);
//let encoded = Arg.encode(arg, [ "w", "heeee" ]);

console.log(encoded);
console.log(Arg.decode(arg, encoded));*/
//console.log(Arg.encodeInt(0));
