import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';

import rootReducer from '../reducers';
import rootSaga from '../sagas';

const persistConfig = {
	timeout: 0,
	key: 'root',
	storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const configureStore = () => {
	const sagaMiddleware = createSagaMiddleware();
	const middlewares = applyMiddleware(...[sagaMiddleware, thunk]);
	const store = createStore(
		persistedReducer,
		window.__REDUX_DEVTOOLS_EXTENSION__
			? compose(middlewares, window.__REDUX_DEVTOOLS_EXTENSION__())
			: middlewares,
	);
	sagaMiddleware.run(rootSaga);

	let persistor = persistStore(store, null, () => {
		console.log('persist');
	});

	return { store, persistor };
};

export default configureStore;
