import { Route, Router } from '@solidjs/router';

import { Header } from './components';
import { GameDetails, Games } from './pages';

export const App = () => (
  <>
    <Header />
    <Router>
      <Route path="/games" component={Games} />
      <Route path="/games/id" component={GameDetails} />
    </Router>
  </>
);
