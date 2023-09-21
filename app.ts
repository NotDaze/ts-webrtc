

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


//import { SignalingSocket } from "./Modules/Network/ss"
import SignalingServer, { SignalingSocket } from "./Modules/Network/signaling_server"
import express from "express"
import http from "http"


const PORT: Number = 5050;

const app: express.Application = express();
const appServer: http.Server = http.createServer(app);

app.get("/", (req: express.Request, res: express.Response) => {
	app.use(express.static(__dirname + "/public"));
	res.sendFile(__dirname + "/Public/index.html");
});

appServer.listen(PORT, () => {
	console.log("Listening");
});


const server = new SignalingServer(SignalingSocket, { server: appServer, clientTracking: false });

server.connected.connect(() => {
	console.log("Listening!");
});
server.peerConnected.connect((peer: SignalingSocket) => {
	console.log("Client connected");
});
/*server.socketConnected.connect((socket: Socket) => {
	
	console.log("Socket connected");
	
});
server.socketDisconnected.connect((socket: Socket) => {
	console.log("Socket disconnected");
});*/
//server.connectionLost.connect((socket: Socket) => {});

