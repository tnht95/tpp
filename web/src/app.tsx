import { Route, Router } from '@solidjs/router';

import { GameDetails, Games, Header } from './components';

export const App = () => (
  <>
    <Header />
    <Router>
      <Route path="/games" component={Games} />
      <Route path="/games/id" component={GameDetails} />
    </Router>
  </>
);
