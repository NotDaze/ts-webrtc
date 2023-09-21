

import Arg from "../arg"
import { MessageIndex, ConnectionState } from '../network';

const MESSAGE_INDEX = new MessageIndex();


/*export type StatusUpdate = {
	[ConnectionState.CONNECTING]: Array<number>,
	[ConnectionState.CONNECTED]: Array<number>,
	[ConnectionState.DISCONNECTED]: Array<number>,
};*/

//const STUN = MESSAGE_INDEX.newMessage(Message.RAW);
export const MESH_INITIALIZE = MESSAGE_INDEX.newMessage({
	localID: Arg.UINT2,
	peerIDs: Arg.array(Arg.UINT2)
});
export const MESH_TERMINATE = MESSAGE_INDEX.newMessage();
export const MESH_CONNECT_PEERS = MESSAGE_INDEX.newMessage({
	peerIDs: Arg.array(Arg.UINT2)
});
export const MESH_DISCONNECT_PEERS = MESSAGE_INDEX.newMessage({
	peerIDs: Arg.array(Arg.UINT2)
});
//const MESH_CREATION_COMPLETED = MESSAGE_INDEX.newMessage();
export const MESH_STABILIZED = MESSAGE_INDEX.newMessage();
//const MESH_DESTABILIZED = MESSAGE_INDEX.newMessage();

export const MESH_SESSION_DESCRIPTION_CREATED = MESSAGE_INDEX.newMessage({
	peerID: Arg.UINT2,
	type: Arg.choice("offer", "answer"),
	sdp: Arg.STRING2
});
export const MESH_ICE_CANDIDATE_CREATED = MESSAGE_INDEX.newMessage({
	peerID: Arg.UINT2,
	//media: Arg.STRING1,
	//index: Arg.UINT2,
	//name: Arg.STRING2
	candidate: Arg.STRING2,
	sdpMid: Arg.STRING2,
	sdpMLineIndex: Arg.UINT2,
	usernameFragment: Arg.STRING2
});



export const MESH_STATUS_UPDATE = MESSAGE_INDEX.newMessage([]);
/*export const MESH_CLIENT_STATUS_UPDATE = MESSAGE_INDEX.newMessage([{
	pendingIDs: Arg.array(Arg.UINT2),
	connectedIDs: Arg.array(Arg.UINT2),
	disconnectedIDs: Arg.array(Arg.UINT2),
}]);*/
export const MESH_CLIENT_STATUS_UPDATE = MESSAGE_INDEX.newMessage([
	Arg.array(Arg.UINT2),
	Arg.array(Arg.UINT2),
	Arg.array(Arg.UINT2)
]);



export default MESSAGE_INDEX;
