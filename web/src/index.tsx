/* @refresh reload */
import { MountableElement, render } from 'solid-js/web';

import './index.css';
import 'flowbite';

import { App } from './app';
import { ToastProvider } from './context';

const root = document.querySelector('#root') as MountableElement;

render(
  () => (
    <ToastProvider>
      <App />
    </ToastProvider>
  ),
  root
);
