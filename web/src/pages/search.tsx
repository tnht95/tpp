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
import { PAGINATION } from '@/constant';
import { useToastCtx } from '@/context';
import {
  BlogSummary,
  GameSummary,
  PostDetails,
  SearchResult,
  UserSummary
} from '@/models';

const nothingToShow = () => (
  <p class="text-center text-lg text-gray-400">-- Nothing to show --</p>
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
      <nav class="flex-2" />
      <main class="flex flex-3 flex-col gap-7 border-x border-dashed px-32 py-10">
        <p class="text-2xl font-bold text-indigo-900">
          Results for "{searchParams['keyword']}":
        </p>
        <Show when={(searchParams['category'] || 'games') === 'games'}>
          <GameResult
            loading={initSearchData.loading}
            searchResult={searchData}
            fetchMoreOpts={fetchMoreOpts}
            handleShowMore={handleShowMore}
          />
        </Show>
        <Show when={(searchParams['category'] || 'users') === 'users'}>
          <UserResult
            loading={initSearchData.loading}
            searchResult={searchData}
            fetchMoreOpts={fetchMoreOpts}
            handleShowMore={handleShowMore}
          />
        </Show>
        <Show when={(searchParams['category'] || 'posts') === 'posts'}>
          <PostResult
            loading={initSearchData.loading}
            searchResult={searchData}
            fetchMoreOpts={fetchMoreOpts}
            handleShowMore={handleShowMore}
          />
        </Show>
        <Show when={(searchParams['category'] || 'blogs') === 'blogs'}>
          <BlogResult
            loading={initSearchData.loading}
            searchResult={searchData}
            fetchMoreOpts={fetchMoreOpts}
            handleShowMore={handleShowMore}
          />
        </Show>
      </main>
      <nav class="flex-2" />
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
  <div class="flex flex-col gap-7">
    <p class="text-xl font-bold text-indigo-900">
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
    <hr class="my-10 h-px border-0 bg-gray-200" />
  </div>
);

const UserResult = (props: SearchResultProps) => (
  <div class="flex flex-col gap-7">
    <p class="text-xl font-bold text-indigo-900">
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
    <hr class="my-10 h-px border-0 bg-gray-200" />
  </div>
);

const PostResult = (props: SearchResultProps) => (
  <div class="flex flex-col gap-7">
    <p class="text-xl font-bold text-indigo-900">
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
    <hr class="my-10 h-px border-0 bg-gray-200" />
  </div>
);

const BlogResult = (props: SearchResultProps) => (
  <div class="flex flex-col gap-7">
    <p class="text-xl font-bold text-indigo-900">
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
    <hr class="my-10 h-px border-0 bg-gray-200" />
  </div>
);
