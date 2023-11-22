import { action, persist, createStore } from 'easy-peasy';

export const store = createStore({


  currentUser: persist({
    loggedIn: false,
    email: '',
    password: ''
  }, {
    storage: 'localStorage'
  }),
  setUserInfo: action((state, payload) => {
    state.currentUser = payload;
  }),
  removeState: action((state) => {
    state.currentUser = {
      loggedIn: false,
      email: '',
      password: ''
    };
  })
});