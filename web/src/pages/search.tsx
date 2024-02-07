import { useSearchParams } from '@solidjs/router';
import {
  Accessor,
  batch,
  createEffect,
  createResource,
  createSignal,
  For,
  Show
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import { searchAction, SearchQueryInput } from '@/apis';
import {
  BlogCard,
  GameCard,
  LoadingSpinner,
  PostCard,
  ShowMoreButton,
  UserCard
} from '@/components';
import { useToastCtx } from '@/context';
import {
  BlogSummary,
  GameSummary,
  PostDetails,
  SearchResult,
  UserSummary
} from '@/models';

const PAGINATION = 5;

const nothingToShow = () => (
  <div class="flex flex-col gap-7">
    <p class="text-center text-lg text-gray-400">-- Nothing to show --</p>
  </div>
);

type FetchMoreOpts = {
  games: { offset: number; showMore: boolean };
  users: { offset: number; showMore: boolean };
  posts: { offset: number; showMore: boolean };
  blogs: { offset: number; showMore: boolean };
};

export const Search = () => {
  const { dispatch } = useToastCtx();
  const [searchParams] = useSearchParams();

  const [queryInput, setQueryInput] = createSignal<SearchQueryInput>();
  const [initSearchData] = createResource(queryInput, searchAction);

  const [fetchMoreOpts, setFetchMoreOpts] = createSignal<FetchMoreOpts>({
    games: { offset: 0, showMore: true },
    users: { offset: 0, showMore: true },
    posts: { offset: 0, showMore: true },
    blogs: { offset: 0, showMore: true }
  });
  const [searchData, setSearchData] = createStore<SearchResult>({
    games: [],
    users: [],
    posts: [],
    blogs: []
  });

  createEffect(() => {
    setQueryInput({
      keyword: searchParams['keyword'] as string,
      category: searchParams['category'],
      offset: 0,
      limit: PAGINATION
    });
  });

  createEffect(() => {
    if (initSearchData.state === 'ready') {
      batch(() => {
        setSearchData(initSearchData());
        setFetchMoreOpts(opts => ({
          games: {
            ...opts.games,
            showMore: initSearchData().games.length === PAGINATION
          },
          users: {
            ...opts.users,
            showMore: initSearchData().users.length === PAGINATION
          },
          posts: {
            ...opts.posts,
            showMore: initSearchData().posts.length === PAGINATION
          },
          blogs: {
            ...opts.blogs,
            showMore: initSearchData().blogs.length === PAGINATION
          }
        }));
      });
    }
    if (initSearchData.error) {
      dispatch.showToast({
        msg: (initSearchData.error as Error).message,
        type: 'Err'
      });
    }
  });

  const handleShowMore = (category: keyof SearchResult) => {
    searchAction({
      keyword: searchParams['keyword'] as string,
      category,
      offset: fetchMoreOpts()[category].offset + PAGINATION,
      limit: PAGINATION
    }).then(result => {
      setFetchMoreOpts(opts => ({
        ...opts,
        [category]: {
          offset: opts[category].offset + PAGINATION,
          showMore: result[category].length === PAGINATION
        }
      }));
      return setSearchData(
        produce(data =>
          data[category].push(
            ...(result[category] as GameSummary[] &
              BlogSummary[] &
              PostDetails[] &
              UserSummary[])
          )
        )
      );
    }) as unknown;
  };

  return (
    <div class="flex">
      <div class="flex flex-1 flex-col">
        <div class="flex h-full">
          <nav class="flex h-full w-2/6 border-r border-dashed" />
          <main class="mt-10 flex size-full flex-col gap-7 bg-white px-32">
            <p class="text-2xl font-bold text-indigo-900">
              Result for "{searchParams['keyword']}":
            </p>
            <GameResult
              loading={initSearchData.loading}
              searchResult={searchData}
              fetchMoreOpts={fetchMoreOpts}
              handleShowMore={handleShowMore}
            />
            <UserResult
              loading={initSearchData.loading}
              searchResult={searchData}
              fetchMoreOpts={fetchMoreOpts}
              handleShowMore={handleShowMore}
            />
            <PostResult
              loading={initSearchData.loading}
              searchResult={searchData}
              fetchMoreOpts={fetchMoreOpts}
              handleShowMore={handleShowMore}
            />
            <BlogResult
              loading={initSearchData.loading}
              searchResult={searchData}
              fetchMoreOpts={fetchMoreOpts}
              handleShowMore={handleShowMore}
            />
          </main>
          <nav class="relative -z-10 flex h-full w-1/2 border-l border-dashed" />
        </div>
      </div>
    </div>
  );
};

type SearchResultProps = {
  loading: boolean;
  searchResult: SearchResult;
  fetchMoreOpts: Accessor<FetchMoreOpts>;
  handleShowMore: (category: keyof SearchResult) => void;
};

const GameResult = (props: SearchResultProps) => (
  <>
    <p class="mb-5 text-xl font-bold text-indigo-900">
      <i class="fa-solid fa-gamepad mr-2" />
      Games:
    </p>
    <Show when={!props.loading} fallback={<LoadingSpinner />}>
      <Show
        when={props.searchResult.games.length > 0}
        fallback={nothingToShow()}
      >
        <div class="flex flex-wrap gap-5">
          <For each={props.searchResult.games}>
            {game => <GameCard game={game} />}
          </For>
          <Show when={props.fetchMoreOpts().games.showMore}>
            <ShowMoreButton onClick={() => props.handleShowMore('games')} />
          </Show>
        </div>
      </Show>
    </Show>
    <hr class="my-8 h-px border-0 bg-gray-200" />
  </>
);

const UserResult = (props: SearchResultProps) => (
  <>
    <p class="mb-5 text-xl font-bold text-indigo-900">
      <i class="fa-solid fa-users mr-2" />
      Users:
    </p>
    <Show when={!props.loading} fallback={<LoadingSpinner />}>
      <Show
        when={props.searchResult.users.length > 0}
        fallback={nothingToShow()}
      >
        <div class="flex flex-wrap gap-5">
          <For each={props.searchResult.users}>
            {user => <UserCard user={user} />}
          </For>
          <Show when={props.fetchMoreOpts().users.showMore}>
            <ShowMoreButton onClick={() => props.handleShowMore('users')} />
          </Show>
        </div>
      </Show>
    </Show>
    <hr class="my-8 h-px border-0 bg-gray-200" />
  </>
);

const PostResult = (props: SearchResultProps) => (
  <>
    <p class="mb-5 text-xl font-bold text-indigo-900">
      <i class="fa-solid fa-highlighter mr-2" />
      Posts:
    </p>
    <Show when={!props.loading} fallback={<LoadingSpinner />}>
      <Show
        when={props.searchResult.posts.length > 0}
        fallback={nothingToShow()}
      >
        <div class="flex flex-col gap-5">
          <For each={props.searchResult.posts}>
            {post => (
              <PostCard post={post} onEdit={() => {}} onDelete={() => {}} />
            )}
          </For>
          <Show when={props.fetchMoreOpts().posts.showMore}>
            <ShowMoreButton
              vertical
              onClick={() => props.handleShowMore('posts')}
            />
          </Show>
        </div>
      </Show>
    </Show>
    <hr class="my-8 h-px border-0 bg-gray-200" />
  </>
);

const BlogResult = (props: SearchResultProps) => (
  <>
    <p class="mb-5 text-xl font-bold text-indigo-900">
      <i class="fa-solid fa-cube mr-2" />
      Blogs:
    </p>
    <Show when={!props.loading} fallback={<LoadingSpinner />}>
      <Show
        when={props.searchResult.blogs.length > 0}
        fallback={nothingToShow()}
      >
        <div class="flex flex-col gap-5">
          <For each={props.searchResult.blogs}>
            {blog => <BlogCard blog={blog} />}
          </For>
          <Show when={props.fetchMoreOpts().blogs.showMore}>
            <ShowMoreButton
              vertical
              onClick={() => props.handleShowMore('blogs')}
            />
          </Show>
        </div>
      </Show>
    </Show>
  </>
);
