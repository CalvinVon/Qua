import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app';

ReactDOM.render(<App />, document.getElementById('root'));


// const { ipcRenderer } = window.require('electron');
// if (ipcRenderer.sendSync('isDev')) {
//     window.require('electron-react-devtools').install();
// }
