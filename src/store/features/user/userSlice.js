import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    loading: false,
    error: false,
    loggedIn: false,
  };
  
  export const userSlice = createSlice