import { Route, Router } from '@solidjs/router';

import { Header } from '@/components';
import { GameActivity, GameDiscussion, GameInfo } from '@/parts';

import {
  BlogDetails,
  Blogs,
  Dashboard,
  DiscussionDetails,
  GameDetails,
  Games,
  NotFound,
  Search,
  UserDetails
} from './pages';

export const App = () => (
  <>
    <Header />
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
      <Route path="*404" component={NotFound} />
    </Router>
  </>
);
