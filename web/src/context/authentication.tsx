import {
  createContext,
  createResource,
  ParentProps,
  Resource,
  useContext
} from 'solid-js';

import { fetchUserAction, logoutAction } from '@/apis';
import { User } from '@/models';

// ============================================================================
// Interfaces
// ============================================================================
type AuthContext = {
  user: Resource<User | undefined>;
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
      logout: () => logoutAction().then(() => mutate())
    }
  };
  return <authCtx.Provider value={state}>{props.children}</authCtx.Provider>;
};

// ============================================================================
// Component Apis
// ============================================================================
export const useAuthCtx = () => useContext(authCtx) as AuthContext;
