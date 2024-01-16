import { Route, Router } from '@solidjs/router';

import { GameActivity, GameDiscussion, GameInfo } from '@/parts';

import { Header } from './components';
import {
  BlogDetails,
  Blogs,
  Dashboard,
  DiscussionDetails,
  GameDetails,
  Games, Search,
  UserDetails
} from './pages';

export const App = () => (
  <>
    <Header isAuthenticated={true} />
    <Router>
      <Route path="/" component={Dashboard} />
      <Route path="/games" component={Games} />
      <Route path="/games/:id" component={GameDetails}>
        <Route path="/info" component={GameInfo} />
        <Route path="/discussion" component={GameDiscussion} />
        <Route path="/activity" component={GameActivity} />
      </Route>
      <Route path="games/:id/discussion/:id" component={DiscussionDetails} />
      <Route path={'users/:id'} component={UserDetails} />
      <Route path={'blogs'} component={Blogs} />
      <Route path={'blogs/:id'} component={BlogDetails} />
      <Route path={'search'} component={Search} />
    </Router>
  </>
);
