import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import '@assets/icons.css';
import Routes from '@pages/routes';
import * as serviceWorker from './serviceWorker';
import { AlertProvider } from './contexts/useAlert';

ReactDOM.render(
    <React.StrictMode>
        <AlertProvider>
            <Routes />
        </AlertProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);

serviceWorker.register();
