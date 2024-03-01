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
  Emulator,
  GameDetails,
  Games,
  NotFound,
  PostDetailsPage,
  Search,
  TagSearch,
  UserDetails,
  UserRedirect
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
      <Route path={'/discussions'} component={GameDetailsDiscussion} />
      <Route
        path={'/discussions/:discussionId'}
        component={GameDetailsDiscussionDetails}
      />
      <Route path={'/activities'} component={GameDetailsActivity} />
    </Route>
    <Route path={'/users/:id'} component={UserDetails} />
    <Route path={'/users/name/:name'} component={UserRedirect} />
    <Route path={'/blogs'} component={Blogs} />
    <Route path={'/blogs/:id'} component={BlogDetails} />
    <Route path={'/search'} component={Search} />
    <Route path={'/emulator/'} component={Emulator} />
    <Route path={'/emulator/:id?'} component={Emulator} />
    <Route path={'/posts/:id'} component={PostDetailsPage} />
    <Route path={'/tags/:name'} component={TagSearch} />
    <Route path={'*404'} component={NotFound} />
  </Router>
);
