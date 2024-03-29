import { createResource, createRoot, Resource } from 'solid-js';

import { fetchMeAction, logoutAction } from '@/apis';
import { Auth, User } from '@/models';

type Store = {
  auth: Resource<Auth | undefined>;
  user: () => User | undefined;
  utils: {
    isAuth: () => boolean;
    isAdmin: () => boolean;
    isSameUser: (id: number) => boolean;
    getWsTicket: () => string | undefined;
  };
  dispatch: {
    logout: () => void;
  };
};

export const authenticationStore = createRoot<Store>(() => {
  const [auth, { mutate }] = createResource(fetchMeAction);

  const store = {
    auth,
    user: () => auth()?.user,
    utils: {
      isAuth: () => !!auth(),
      isAdmin: () => !!auth()?.isAdmin,
      isSameUser: (id: number) => auth()?.user.id === id,
      getWsTicket: () => auth()?.wsTicket
    },
    dispatch: {
      logout: () => {
        logoutAction()
          .then(() => mutate())
          .catch(() => mutate());
      }
    }
  };

  setInterval(
    () => {
      if (store.utils.isAuth()) return;
      store.dispatch.logout();
    },
    10 * 60 * 1000 // 10 minutes
  );

  return store;
});
