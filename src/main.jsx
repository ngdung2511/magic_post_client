import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { StoreProvider } from 'easy-peasy'
import { store } from './store/store.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <StoreProvider store={store} >
        <App />
  </StoreProvider>
)
