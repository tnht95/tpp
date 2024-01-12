import { Route, Router } from '@solidjs/router';

import { GameActivities, GameDiscussion, GameInfo } from '@/parts';

import { Header } from './components';
import { DiscussionDetails, GameDetails, Games } from './pages';

export const App = () => (
  <>
    <Header />
    <Router>
      <Route path="/games" component={Games} />
      <Route path="/games/:id" component={GameDetails}>
        <Route path="/info" component={GameInfo} />
        <Route path="/discussion" component={GameDiscussion} />
        <Route path="/activities" component={GameActivities} />
      </Route>
      <Route path="games/:id/discussion/:id" component={DiscussionDetails} />
    </Router>
  </>
);
