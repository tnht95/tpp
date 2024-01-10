import { Route, Router } from '@solidjs/router';

import { Games, Header } from './components';

export const App = () => (
  <>
    <Header />
    <Router>
      <Route path="/games" component={Games} />
    </Router>
  </>
);
