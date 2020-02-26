import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { ConfigProvider } from 'antd';
import DataBrowserContainer from './components/DataBrowserContainer/DataBrowserContainer';
import configureStore from './store';
import { PersistGate } from 'redux-persist/integration/react'

// shared components
import DefaultFlex from './components/Flex';
import DefaultFlashMessage from './components/ErrorFlashMessage/FlashMessage';
import DefaultConnectApp from './components/ConnectApp/ConnectApp';

// shared reducers
import * as appReducers from './reducers/app';
import * as mappingsReducers from './reducers/mappings';

// shared utils
import * as utils from './utils';

// shared constants
import * as constants from './constants';

// shared theme
import colors from './components/theme/colors';

import './antd.css';

// shared store
const { store, persistor } = configureStore();

function WithConfigProvider(props) {
	return (
		<ConfigProvider prefixCls="dejavu-browser">
			{/* eslint-disable-next-line react/prop-types */}
			{props.children}
		</ConfigProvider>
	);
}

const Flex = props => (
	<WithConfigProvider>
		<DefaultFlex {...props} />
	</WithConfigProvider>
);

const FlashMessage = props => (
	<WithConfigProvider>
		<DefaultFlashMessage {...props} />
	</WithConfigProvider>
);

const ConnectApp = props => (
	<WithConfigProvider>
		<DefaultConnectApp {...props} />
	</WithConfigProvider>
);

const DataBrowserWrapper = props => (
	<WithConfigProvider>
		<Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
			  <BrowserRouter>
				  <section>
					  <DefaultFlashMessage />
					  <DefaultConnectApp {...props} />
					  {/* eslint-disable-next-line react/prop-types */}
					  <DataBrowserContainer hasCloneApp={props.hasCloneApp} />
				  </section>
	      </BrowserRouter>
      </PersistGate>

		</Provider>
	</WithConfigProvider>
);

export {
	Flex,
	FlashMessage,
	ConnectApp,
	appReducers,
	mappingsReducers,
	utils,
	store,
	constants,
	colors,
};

// main data browser module
export default DataBrowserWrapper;
