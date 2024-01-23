import {
  createContext,
  createResource,
  ParentProps,
  Resource,
  useContext
} from 'solid-js';

import { fetchUserAction, logoutAction } from '@/apis';

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
