import {
  createContext,
  createResource,
  ParentProps,
  Resource,
  useContext
} from 'solid-js';

type AuthContext = {
  user: Resource<unknown>;
  dispatch: {
    logout: () => void;
  };
};

const fetchUser = (): Promise<unknown> =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/me`, { credentials: 'include' })
    .then(r => r.json())
    .catch(() => {});

const [user, { mutate }] = createResource(fetchUser);

const handleLogout = () =>
  fetch(`${import.meta.env.VITE_SERVER_URL}/logout`, {
    credentials: 'include',
    method: 'post'
  });

const authContext = createContext<AuthContext>({
  user,
  dispatch: {
    logout: () => {
      handleLogout().then(() => mutate());
    }
  }
});

export const AuthenticationProvider = (props: ParentProps) => (
  <authContext.Provider value={authContext.defaultValue}>
    {props.children}
  </authContext.Provider>
);

export const useAuth = () => useContext(authContext);
