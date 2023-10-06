const Events = Object.freeze({
  ERROR: 'error',
  MESSAGES_REQ: 'messages_req',
  MESSAGES_RES: 'messages_res',
  JOIN_ROOM_REQ: 'join_room_req',
  JOIN_ROOM_RES: 'join_room_res',
  SUBMIT_MESSAGE: 'submit_message',
  RECEIVED_MESSAGE: 'received_message',
  UPDATE_ROOM_REQ: 'update_room_req',
  UPDATE_ROOM_RES: 'update_room_res',
  PRIVATE_ROOM_STATUS_REQ: 'private_room_status_req',
  PRIVATE_ROOM_STATUS_RES: 'private_room_status_res',
  ADD_NEW_ROOM_REQ: 'add_new_room_req',
  ADD_NEW_ROOM_RES: 'add_new_room_res',

  WEBRTC_CALLING: 'webrtc_calling',
  WEBRTC_DECLINE_CALL: 'webrtc_decline_call',
  WEBRTC_CLOSE_CONNECTION: 'webrtc_close_connection',
  WEBRTC_SDP: 'webrtc_sdp',
  WEBRTC_CANDIDATE: 'webrtc_candidate',
  WEBRTC_ERROR: 'webrtc_error',
});

export default Events;
