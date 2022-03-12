import { configureStore, MiddlewareArray } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector as useRawSelector } from 'react-redux';
import thunk from 'redux-thunk';

import rootReducer from '../slices';

const store = configureStore({
    reducer: rootReducer,
    devTools: true,
    middleware: new MiddlewareArray().concat(thunk),
});

if (typeof module.hot !== 'undefined') {
    // eslint-disable-next-line global-require
    module.hot.accept('../slices', () => store.replaceReducer(require('../slices').rootReducer));
}

export type Store = ReturnType<typeof rootReducer>;
export type Dispatch = typeof store.dispatch;
export const useSelector: TypedUseSelectorHook<Store> = useRawSelector;
export default store;
