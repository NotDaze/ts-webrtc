"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var State;
(function (State) {
    State[State["PENDING"] = 0] = "PENDING";
    State[State["RESOLVED"] = 1] = "RESOLVED";
    State[State["REJECTED"] = 2] = "REJECTED";
})(State || (State = {}));
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
class Deferrable {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.res = resolve;
            this.rej = reject;
        });
    }
    /*public then<ResolveType, RejectType = never>(
        resolve?: (value: Type) => ResolveType | PromiseLike<ResolveType>,
        reject?: (reason: any) => RejectType
    ): Promise<ResolveType|RejectType> {
        return this.promise.then(resolve, reject);
    }*/
    then(onresolved) {
        return this.promise.then(onresolved);
    }
    catch(onrejected) {
        return this.promise.catch(onrejected);
    }
    // make these protected..?
    resolve(value) {
        if (this.res != null)
            this.res(value);
    }
    reject(reason) {
        if (this.rej != null)
            this.rej(reason);
    }
}
exports.default = Deferrable;
