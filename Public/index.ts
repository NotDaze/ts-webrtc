

/*
sdp: 'v=0\r\n' +
'o=- 8311241009587343762 2 IN IP4 127.0.0.1\r\n' +
's=-\r\n' +
't=0 0\r\n' +
'a=group:BUNDLE 0\r\n' +
'a=extmap-allow-mixed\r\n' +
'a=msid-semantic: WMS\r\n' +
'm=application 9 UDP/DTLS/SCTP webrtc-datachannel\r\n' +
'c=IN IP4 0.0.0.0\r\n' +
'a=ice-ufrag:akAp\r\n' +
'a=ice-pwd:w+R4CtwP58PIO5tL7RYAK0sp\r\n' +
'a=ice-options:trickle\r\n' +
'a=fingerprint:sha-256 7C:CD:66:A5:BC:E9:CB:35:BC:2E:0C:5B:EA:F2:B3:33:B5:4E:F8:D8:24:55:1E:17:BF:C7:CE:5B:8C:85:FE:3A\r\n' +
'a=setup:active\r\n' +
'a=mid:0\r\n' +
'a=sctp-port:5000\r\n' +
'a=max-message-size:262144\r\n'

*/
/*
=sdp: 'v=0\r\n' +
'o=mozilla...THIS_IS_SDPARTA-99.0 8440494408006261249 0 IN IP4 0.0.0.0\r\n' +
='s=-\r\n' +
='t=0 0\r\n' +
='a=fingerprint:sha-256 DD:1F:DC:13:D8:CD:5E:DE:27:71:83:C9:AE:D2:22:20:5D:29:94:4D:36:85:7C:D0:C8:A7:D0:0E:A2:C2:E8:1E\r\n' +
='a=group:BUNDLE 0\r\n' +
='a=ice-options:trickle\r\n' +
='a=msid-semantic:WMS *\r\n' +
='m=application 9 UDP/DTLS/SCTP webrtc-datachannel\r\n' +
='c=IN IP4 0.0.0.0\r\n' +
'a=sendrecv\r\n' +
='a=ice-pwd:2dbdc4b99dd2b7021f1c4eeccc0f7023\r\n' +
='a=ice-ufrag:355a7d6f\r\n' +
='a=mid:0\r\n' +
='a=setup:active\r\n' +
='a=sctp-port:5000\r\n'
='a=max-message-size:1073741823\r\n'

*/




//import Socket from "../Modules/ws"
import Signal from "../Modules/Core/signal"
import Socket from "../Modules/Network/websocket_client"
import GameClient from "../Modules/game_client"


//const socket = new Socket("ws://localhost:5050", ["soap"]);

const client = new GameClient("ws://localhost:5050");

client.connected.connect(() => {
	console.log("connected!");
	
	//client.sendAll(new Uint8Array([ 1, 2, 3, 4, 5 ]));
	
});

window.onbeforeunload = () => {
	client.close();
};



