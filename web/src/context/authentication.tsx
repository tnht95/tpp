import {
  createContext,
  createResource,
  ParentProps,
  Resource,
  useContext
} from 'solid-js';

import { fetchUserAction, logoutAction } from '@/apis';
import { Auth, User } from '@/models';

// ============================================================================
// Interfaces
// ============================================================================
type AuthContext = {
  auth: Resource<Auth | undefined>;
  utils: {
    isAuth: () => boolean;
    isAdmin: () => boolean;
    user: () => User | undefined;
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
  const [auth, { mutate }] = createResource(fetchUserAction);
  const state = {
    auth,
    utils: {
      isAuth: () => !!auth(),
      isAdmin: () => !!auth()?.isAdmin,
      user: () => auth()?.user
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
