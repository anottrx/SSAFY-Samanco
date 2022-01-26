// import { configureStore } from '@reduxjs/toolkit'; 
import { applyMiddleware, createStore } from 'redux';
import { createWrapper } from "next-redux-wrapper"; 
import storage from "redux-persist/lib/storage";

import {
    persistStore,
    persistReducer,
  } from 'redux-persist'

import logger from 'redux-logger'; 
import reducer from './module'; 

const persistConfig = {
    key: 'root',
    storage
  }

export const persistedReducer = persistReducer(persistConfig, reducer)

const makeConfiguredStore = (reducer) => createStore(
  reducer, undefined, applyMiddleware(logger
));

export const makeStore = () => {
  const isServer = typeof window === 'undefined';

  if (isServer) {
    return makeConfiguredStore(reducer);
  } else {
    const store = makeConfiguredStore(persistedReducer);
    let persistor = persistStore(store);
    return {persistor, ...store};
  }

//   configureStore({ 
//     reducer: persistedReducer, 
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger), 
//     devTools: process.env.NODE_ENV !== 'production', 
// })
} 

export const wrapper = createWrapper(makeStore, { 
    debug: process.env.NODE_ENV !== 'production', 
});

// export const persistor = persistStore(makeStore);