import {
  createContext,
  createResource,
  ParentProps,
  Resource,
  useContext
} from 'solid-js';

// ============================================================================
// Interfaces
// ============================================================================
type AuthContext = {
  user: Resource<unknown>;
  dispatch: {
    logout: () => void;
  };
};

// ============================================================================
// APIs
// ============================================================================
// TODO: handle error
const fetchUserAction = (): Promise<unknown> =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/me`, { credentials: 'include' })
    .then(r => r.json())
    .catch(() => {});

const logoutAction = () =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/logout`, { method: 'post' });

// ============================================================================
// Contexts
// ============================================================================
const authContext = createContext<AuthContext>();
export const AuthenticationProvider = (props: ParentProps) => {
  const [user, { mutate }] = createResource(fetchUserAction);
  const state = {
    user,
    dispatch: {
      // TODO: handle error
      logout: () => {
        logoutAction()
          .then(() => mutate())
          .catch(() => {});
      }
    }
  };
  return (
    <authContext.Provider value={state}>{props.children}</authContext.Provider>
  );
};

// ============================================================================
// Component Apis
// ============================================================================
export const useAuth = () => useContext(authContext) as AuthContext;
