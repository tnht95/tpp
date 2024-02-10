import { createResource, createRoot, Resource } from 'solid-js';

import { fetchUserAction, logoutAction } from '@/apis';
import { Auth, User } from '@/models';

type Ctx = {
  auth: Resource<Auth | undefined>;
  user: () => User | undefined;
  utils: {
    isAuth: () => boolean;
    isAdmin: () => boolean;
    isSameUser: (id: number) => boolean;
  };
  dispatch: {
    logout: () => void;
  };
};

export const authenticationStore = createRoot<Ctx>(() => {
  const [auth, { mutate }] = createResource(fetchUserAction);
  return {
    auth,
    user: () => auth()?.user,
    utils: {
      isAuth: () => !!auth(),
      isAdmin: () => !!auth()?.isAdmin,
      isSameUser: (id: number) => auth()?.user.id === id
    },
    dispatch: {
      logout: () => {
        logoutAction()
          .then(() => mutate())
          .catch(() => {});
      }
    }
  };
});
