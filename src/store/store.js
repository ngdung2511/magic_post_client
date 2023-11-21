import { action, persist, createStore } from 'easy-peasy';

export const store = createStore({
    todos: ['Create store', 'Wrap application', 'Use store'],
    addTodo: action((state, payload) => {
        state.todos.push(payload);
      }),
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