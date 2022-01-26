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

// 기존에 만들어둔 reducer와 persist에 대한 설정을 담은 persistConfig를 적용한 리듀서를 만든다.
export const persistedReducer = persistReducer(persistConfig, reducer)

// server-side 스토어와 client-side store를 합쳐준다.
const makeConfiguredStore = (reducer) => createStore(
  reducer, undefined, applyMiddleware(logger
));

export const makeStore = () => {
  const isServer = typeof window === 'undefined';

  if (isServer) {
    return makeConfiguredStore(reducer);
  } else {
    // CSR일때만 필요함
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