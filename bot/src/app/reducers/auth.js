export default function auth(state = {
  token: null,
  isAuthenticated: false,
  authenticationType: null,
}, action) {
  switch (action.type) {
    case 'TEST':
      return Object.assign({}, state, {
        token: action.token,
        isAuthenticated: action.token !== null,
        authenticationType: action.authenticationType || state.authenticationType,
      });
    default:
      return state;
  }
}
