/* @refresh reload */
import { MountableElement, render } from 'solid-js/web';

import './index.css';
import { App } from './app';

const root = document.querySelector('#root');

render(() => <App />, root as MountableElement);
