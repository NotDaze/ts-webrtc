(()=>{"use strict";var t={806:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0});class i{constructor(){this.map=new Map,this.priorities=new Array}*[Symbol.iterator](){for(const t of this.priorities){let e=this.map.get(t);if(e)for(const t of e)yield t}}*backwards(){for(const t of this.priorities){let e=this.map.get(t);if(e)for(const t of e)yield t}}addPriority(t){for(let e=0;e<this.priorities.length;e++)if(this.priorities[e]>t)return void this.priorities.splice(e,0,t);this.priorities.push(t)}deletePriority(t){let e=this.priorities.indexOf(t);e>=0&&this.priorities.splice(e,1)}has(t){for(const e of this.map.values())if(e.has(t))return!0;return!1}add(t,...e){if(0===e.length)return;let i=this.map.get(t);if(i)for(const t of e)i.add(t);else this.addPriority(t),this.map.set(t,new Set(e))}delete(...t){for(const e of this.priorities){let i=this.map.get(e);if(i)for(const e of t)i.delete(e)}}clear(){this.map.clear(),this.priorities=new Array}}e.default=i},221:function(t,e,i){var s=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});const r=s(i(806));class o{constructor(){this.callbacks=new r.default}static fromEvent(t,e){let i=new o;return i.bindEvent(t,e),i}static fromSignal(t){let e=new o;return e.bindSignal(t),e}bindEvent(t,e){t.on(e,this.emit.bind(this))}bindSignal(t){t.connect(this.emit.bind(this))}pconnect(t,e){this.callbacks.add(t,e)}connect(t){this.pconnect(0,t)}disconnect(t){this.callbacks.delete(t)}disconnectAll(){this.callbacks.clear()}emit(t){for(const e of this.callbacks)e(t)}}e.default=o},319:function(t,e,i){var s=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});const r=s(i(221));console.log(r.default),new WebSocket("ws://127.0.0.1:3000",["soap"]),console.log("yeah baby this is woo")}},e={};!function i(s){var r=e[s];if(void 0!==r)return r.exports;var o=e[s]={exports:{}};return t[s].call(o.exports,o,o.exports,i),o.exports}(319)})();