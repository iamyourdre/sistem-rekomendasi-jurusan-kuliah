import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import axios from 'axios';
import './index.css';
import { ContextProvider } from "./contexts/ContextProvider";

axios.defaults.withCredentials = true;

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ContextProvider>
        <App/>
      </ContextProvider>
    </Provider>
  </React.StrictMode>
);

