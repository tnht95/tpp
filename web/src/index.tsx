/* @refresh reload */
import { MountableElement, render } from 'solid-js/web';

import './index.css';
import 'flowbite';

import { App } from './app';
import { AuthenticationProvider } from './context';

const root = document.querySelector('#root') as MountableElement;

render(
  () => (
    <AuthenticationProvider>
      <App />
    </AuthenticationProvider>
  ),
  root
);
