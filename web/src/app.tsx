import { Route, Router } from '@solidjs/router';
import { ParentProps } from 'solid-js';

import { GameActivity, GameDiscussion, GameInfo, Header } from '@/parts';

import {
  DiscussionDetailsProvider,
  DiscussionProvider,
  GameDetailsProvider
} from './context';
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

const Root = (props: ParentProps) => (
  <>
    <Header />
    {props.children}
  </>
);

export const App = () => (
  <>
    <Router root={Root}>
      <Route path={'/'}>
        <Route component={Dashboard} />
      </Route>

      <Route path={'/games'} component={Games} />

      <Route path={'/games/:id'} component={GameDetailsProvider}>
        <Route component={GameDetails}>
          <Route path={'/info'} component={GameInfo} />

          <Route path={'/discussion'} component={DiscussionProvider}>
            <Route component={GameDiscussion} />
          </Route>

          <Route
            path={'/discussion/:discussionId'}
            component={DiscussionDetailsProvider}
          >
            <Route component={DiscussionDetails} />
          </Route>
          <Route path={'/activity'} component={GameActivity} />
        </Route>
      </Route>

      <Route path={'/users/:id'} component={UserDetails} />
      <Route path={'/blogs'} component={Blogs} />
      <Route path={'/blogs/:id'} component={BlogDetails} />
      <Route path={'/search'} component={Search} />
      <Route path={'*404'} component={NotFound} />
    </Router>
  </>
);
