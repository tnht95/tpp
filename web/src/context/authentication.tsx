import {
  createContext,
  createResource,
  ParentProps,
  Resource,
  useContext
} from 'solid-js';

import { User } from '@/models';

// ============================================================================
// Interfaces
// ============================================================================
type AuthContext = {
  user: Resource<unknown>;
  utils: {
    isAuth: () => boolean;
  };
  dispatch: {
    logout: () => void;
  };
};

// ============================================================================
// APIs
// ============================================================================
// TODO: handle error
const fetchUserAction = () =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/me`, { credentials: 'include' })
    .then(r => r.json())
    .catch(() => {}) as Promise<User>;

const logoutAction = () =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/logout`, {
    method: 'post',
    credentials: 'include'
  });

// ============================================================================
// Contexts
// ============================================================================
const authCtx = createContext<AuthContext>();
export const AuthenticationProvider = (props: ParentProps) => {
  const [user, { mutate }] = createResource(fetchUserAction);
  const state = {
    user,
    utils: {
      isAuth: () => !!user()
    },
    dispatch: {
      // TODO: handle error
      logout: () => {
        logoutAction()
          .then(() => mutate())
          .catch(() => {});
      }
    }
  };
  return <authCtx.Provider value={state}>{props.children}</authCtx.Provider>;
};

// ============================================================================
// Component Apis
// ============================================================================
export const useAuth = () => useContext(authCtx) as AuthContext;
