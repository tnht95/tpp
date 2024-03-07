import { useSearchParams } from '@solidjs/router';
import {
  batch,
  createContext,
  createEffect,
  createResource,
  createSignal,
  ErrorBoundary,
  ParentProps,
  useContext
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import { searchAction, SearchQueryInput } from '@/apis';
import { PAGINATION } from '@/constant';
import {
  BlogSummary,
  GameSummary,
  PostDetails,
  RespErr,
  SearchResult,
  UserSummary
} from '@/models';
import { NotFound } from '@/pages';

import { useToastCtx } from './toast';

type Ctx = {
  searchResult: SearchResult;
  dispatch: { fetchMore: (category: keyof SearchResult) => void };
  utils: {
    keyword: () => string;
    category: () => string | undefined;
    loading: () => boolean;
    showMore: (category: keyof SearchResult) => void;
  };
};

type FetchMoreOpts = {
  games: { offset: number; showMore: boolean };
  users: { offset: number; showMore: boolean };
  posts: { offset: number; showMore: boolean };
  blogs: { offset: number; showMore: boolean };
};

const ctx = createContext<Ctx>();
export const SearchProvider = (props: ParentProps) => {
  const { showToast } = useToastCtx();
  const [searchParams] = useSearchParams();

  const [fetchMoreOpts, setFetchMoreOpts] = createSignal<FetchMoreOpts>({
    games: { offset: 0, showMore: true },
    users: { offset: 0, showMore: true },
    posts: { offset: 0, showMore: true },
    blogs: { offset: 0, showMore: true }
  });

  const [query, setQuery] = createSignal<SearchQueryInput>();
  const [resource] = createResource(query, searchAction);
  const [searchResult, setSearchResult] = createStore<SearchResult>({
    games: [],
    users: [],
    posts: [],
    blogs: []
  });

  createEffect(() => {
    setQuery({
      keyword: encodeURIComponent(searchParams['keyword'] as string),
      category: searchParams['category'],
      offset: 0,
      limit: PAGINATION
    });
  });

  createEffect(() => {
    if (resource.state === 'ready') {
      batch(() => {
        setSearchResult(resource());
        setFetchMoreOpts(opts => ({
          games: {
            ...opts.games,
            showMore: resource().games.length === PAGINATION
          },
          users: {
            ...opts.users,
            showMore: resource().users.length === PAGINATION
          },
          posts: {
            ...opts.posts,
            showMore: resource().posts.length === PAGINATION
          },
          blogs: {
            ...opts.blogs,
            showMore: resource().blogs.length === PAGINATION
          }
        }));
      });
    }
    if (resource.error) {
      showToast({
        msg: (resource.error as Error).message,
        type: 'err'
      });
    }
  });

  const fetchMore = (category: keyof SearchResult) => {
    searchAction({
      keyword: encodeURIComponent(searchParams['keyword'] as string),
      category,
      offset: fetchMoreOpts()[category].offset + PAGINATION,
      limit: PAGINATION
    })
      .then(result =>
        batch(() => {
          setFetchMoreOpts(opts => ({
            ...opts,
            [category]: {
              offset: opts[category].offset + PAGINATION,
              showMore: result[category].length === PAGINATION
            }
          }));
          setSearchResult(
            produce(data =>
              data[category].push(
                ...(result[category] as GameSummary[] &
                  BlogSummary[] &
                  PostDetails[] &
                  UserSummary[])
              )
            )
          );
        })
      )
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'err' }));
  };

  const showMore = (category: keyof FetchMoreOpts) =>
    fetchMoreOpts()[category].showMore;

  const state: Ctx = {
    searchResult,
    dispatch: {
      fetchMore
    },
    utils: {
      keyword: () => searchParams['keyword'] as string,
      category: () => searchParams['category'],
      loading: () => resource.loading,
      showMore
    }
  };

  return (
    <ctx.Provider value={state}>
      <ErrorBoundary fallback={<NotFound />}>{props.children}</ErrorBoundary>
    </ctx.Provider>
  );
};

export const useSearchCtx = () => useContext(ctx) as Ctx;
