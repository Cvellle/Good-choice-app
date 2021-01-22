import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { store } from './app/store';
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';

import './index.css';

let persistor = persistStore(store);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
