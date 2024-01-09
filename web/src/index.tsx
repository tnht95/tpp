/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import { App } from './app';

const root = document.querySelector('#root');
if (!root) throw new Error('could not find #root element id');

render(() => <App />, root);
