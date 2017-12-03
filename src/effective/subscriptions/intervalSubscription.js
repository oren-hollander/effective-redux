export const interval = (millis, action) => dispatch => 
  window.setInterval(() => dispatch(action), millis)