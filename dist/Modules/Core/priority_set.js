"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PrioritySet {
    constructor() {
        this.map = new Map();
        this.priorities = new Array();
    }
    *[Symbol.iterator]() {
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
    addPriority(priority) {
        for (let i = 0; i < this.priorities.length; i++) {
            if (priority < this.priorities[i]) {
                this.priorities.splice(i, 0, priority);
                return;
            }
        }
        this.priorities.push(priority);
    }
    deletePriority(priority) {
        // should probably binary search
        let index = this.priorities.indexOf(priority);
        if (index >= 0)
            this.priorities.splice(index, 1);
    }
    has(value) {
        for (const set of this.map.values()) {
            if (set.has(value))
                return true;
        }
        return false;
    }
    add(priority, ...values) {
        if (values.length === 0)
            return;
        let set = this.map.get(priority);
        if (set) {
            for (const value of values) {
                set.add(value);
            }
        }
        else {
            this.addPriority(priority);
            this.map.set(priority, new Set(values));
        }
    }
    delete(...values) {
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
    clear() {
        this.map.clear();
        this.priorities = new Array();
    }
}
exports.default = PrioritySet;
