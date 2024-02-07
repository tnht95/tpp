import { useSearchParams } from '@solidjs/router';
import {
  createEffect,
  createResource,
  createSignal,
  ErrorBoundary,
  For,
  InitializedResource,
  Show
} from 'solid-js';

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
import { SearchResult } from '@/models';

const nothingToShow = () => (
  <div class="flex flex-col gap-7">
    <p class="text-center text-lg text-gray-400">-- Nothing to show --</p>
  </div>
);

export const Search = () => {
  const { dispatch } = useToastCtx();
  const [searchParams] = useSearchParams();
  const [queryInput, setQueryInput] = createSignal<SearchQueryInput>();
  const [searchResult] = createResource(queryInput, searchAction, {
    initialValue: { games: [], users: [], posts: [], blogs: [] }
  });

  createEffect(() => {
    setQueryInput({
      keyword: searchParams['keyword'] as string,
      category: searchParams['category'],
      offset: 0,
      limit: 5
    });
  });

  return (
    <div class="flex">
      <div class="flex flex-1 flex-col">
        <div class="flex h-full">
          <nav class="flex h-full w-2/6 border-r border-dashed" />
          <main class="mt-10 flex size-full flex-col gap-7 bg-white px-32">
            <p class="text-2xl font-bold text-indigo-900">
              Result for "{searchParams['keyword']}":
            </p>
            <ErrorBoundary
              fallback={(e: Error) => {
                dispatch.showToast({ type: 'Err', msg: e.message });
                return <></>;
              }}
            >
              {renderGames(searchResult)}
              {renderUsers(searchResult)}
              {renderPosts(searchResult)}
              {renderBlogs(searchResult)}
            </ErrorBoundary>
          </main>
          <nav class="relative -z-10 flex h-full w-1/2 border-l border-dashed" />
        </div>
      </div>
    </div>
  );
};

const renderGames = (searchResult: InitializedResource<SearchResult>) => (
  <>
    <p class="mb-5 text-xl font-bold text-indigo-900">
      <i class="fa-solid fa-gamepad mr-2" />
      Games:
    </p>
    <Show when={!searchResult.loading} fallback={<LoadingSpinner />}>
      <Show when={searchResult().games.length > 0} fallback={nothingToShow()}>
        <div class="flex flex-wrap gap-5">
          <For each={searchResult().games}>
            {game => <GameCard game={game} />}
          </For>
          <Show when={searchResult().games.length === 5}>
            <ShowMoreButton onClick={() => {}} />
          </Show>
        </div>
      </Show>
    </Show>
    <hr class="my-8 h-px border-0 bg-gray-200" />
  </>
);

const renderUsers = (searchResult: InitializedResource<SearchResult>) => (
  <>
    <p class="mb-5 text-xl font-bold text-indigo-900">
      <i class="fa-solid fa-users mr-2" />
      Users:
    </p>
    <Show when={!searchResult.loading} fallback={<LoadingSpinner />}>
      <Show when={searchResult().users.length > 0} fallback={nothingToShow()}>
        <div class="flex flex-wrap gap-5">
          <For each={searchResult().users}>
            {user => <UserCard user={user} />}
          </For>
          <Show when={searchResult().users.length === 5}>
            <ShowMoreButton onClick={() => {}} />
          </Show>
        </div>
      </Show>
    </Show>
    <hr class="my-8 h-px border-0 bg-gray-200" />
  </>
);

const renderPosts = (searchResult: InitializedResource<SearchResult>) => (
  <>
    <p class="mb-5 text-xl font-bold text-indigo-900">
      <i class="fa-solid fa-highlighter mr-2" />
      Posts:
    </p>
    <Show when={!searchResult.loading} fallback={<LoadingSpinner />}>
      <Show when={searchResult().posts.length > 0} fallback={nothingToShow()}>
        <div class="flex flex-col gap-5">
          <For each={searchResult().posts}>
            {post => (
              <PostCard post={post} onEdit={() => {}} onDelete={() => {}} />
            )}
          </For>
          <Show when={searchResult().posts.length === 5}>
            <ShowMoreButton vertical onClick={() => {}} />
          </Show>
        </div>
      </Show>
    </Show>
    <hr class="my-8 h-px border-0 bg-gray-200" />
  </>
);

const renderBlogs = (searchResult: InitializedResource<SearchResult>) => (
  <>
    <p class="mb-5 text-xl font-bold text-indigo-900">
      <i class="fa-solid fa-cube mr-2" />
      Blogs:
    </p>
    <Show when={!searchResult.loading} fallback={<LoadingSpinner />}>
      <Show when={searchResult().blogs.length > 0} fallback={nothingToShow()}>
        <div class="flex flex-col gap-5">
          <For each={searchResult().blogs}>
            {blog => <BlogCard blog={blog} />}
          </For>
          <Show when={searchResult().blogs.length === 5}>
            <ShowMoreButton vertical onClick={() => {}} />
          </Show>
        </div>
      </Show>
    </Show>
  </>
);
