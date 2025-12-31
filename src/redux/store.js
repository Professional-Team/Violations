import { configureStore } from '@reduxjs/toolkit';
import uploadsReducer from './uploadsSlice';

export const store = configureStore({
  reducer: {
    uploads: uploadsReducer,
  },
});

export default store;
