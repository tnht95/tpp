import { Route, Router } from '@solidjs/router';
import { ParentProps } from 'solid-js';

import {
  GameDetailsActivity,
  GameDetailsDiscussion,
  GameDetailsDiscussionDetails,
  GameDetailsInfo,
  Header
} from '@/parts';

import {
  BlogDetails,
  Blogs,
  Dashboard,
  GameDetails,
  Games,
  NotFound,
  Search,
  UserDetails
} from './pages';

const Root = (props: ParentProps) => (
  <>
    <Header />
    {props.children}
  </>
);

export const App = () => (
  <Router root={Root}>
    <Route path={'/'} component={Dashboard} />
    <Route path={'/games'} component={Games} />
    <Route path={'/games/:id'} component={GameDetails}>
      <Route path={'/info'} component={GameDetailsInfo} />
      <Route path={'/discussion'} component={GameDetailsDiscussion} />
      <Route
        path={'/discussion/:discussionId'}
        component={GameDetailsDiscussionDetails}
      />
      <Route path={'/activity'} component={GameDetailsActivity} />
    </Route>
    <Route path={'/users/:id'} component={UserDetails} />
    <Route path={'/blogs'} component={Blogs} />
    <Route path={'/blogs/:id'} component={BlogDetails} />
    <Route path={'/search'} component={Search} />
    <Route path={'*404'} component={NotFound} />
  </Router>
);
