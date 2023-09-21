"use strict";
/*import Signal from "./Modules/Core/signal"
import Arg from "./Modules/Network/arg"
import {
    Message,
    MessageIndex,
    MessageHandler,
    Packet,
    Socket,
    SocketServer,
    Room
} from "./Modules/Network/wss"*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import { SignalingSocket } from "./Modules/Network/ss"
const signaling_server_1 = __importStar(require("./Modules/Network/signaling_server"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const PORT = 5050;
const app = (0, express_1.default)();
const appServer = http_1.default.createServer(app);
app.get("/", (req, res) => {
    app.use(express_1.default.static(__dirname + "/public"));
    res.sendFile(__dirname + "/Public/index.html");
});
appServer.listen(PORT, () => {
    console.log("Listening");
});
const server = new signaling_server_1.default(signaling_server_1.SignalingSocket, { server: appServer, clientTracking: false });
server.connected.connect(() => {
    console.log("Listening!");
});
server.peerConnected.connect((peer) => {
    console.log("Client connected");
});
/*server.socketConnected.connect((socket: Socket) => {
    
    console.log("Socket connected");
    
});
server.socketDisconnected.connect((socket: Socket) => {
    console.log("Socket disconnected");
});*/
//server.connectionLost.connect((socket: Socket) => {});
