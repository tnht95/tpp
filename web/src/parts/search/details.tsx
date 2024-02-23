import { For, Show } from 'solid-js';

import {
  BlogCard,
  GameCard,
  LoadingSpinner,
  PostCard,
  ShowMoreButton,
  UserCard
} from '@/components';
import { useSearchCtx } from '@/context';
import { SearchResult } from '@/models';

export const SearchDetails = () => {
  const {
    searchResult,
    dispatch: { fetchMore },
    utils: { keyword, category, loading, showMore }
  } = useSearchCtx();
  return (
    <div class="flex">
      <nav class="flex-2" />
      <main class="flex flex-3 flex-col gap-7 border-x border-dashed px-32 py-10">
        <p class="text-2xl font-bold text-indigo-900">
          Results for "{keyword()}":
        </p>
        <GameResult
          loading={loading()}
          category={category()}
          searchResult={searchResult}
          showMore={showMore}
          handleShowMore={fetchMore}
        />
        <UserResult
          loading={loading()}
          category={category()}
          searchResult={searchResult}
          showMore={showMore}
          handleShowMore={fetchMore}
        />
        <PostResult
          loading={loading()}
          category={category()}
          searchResult={searchResult}
          showMore={showMore}
          handleShowMore={fetchMore}
        />
        <BlogResult
          loading={loading()}
          category={category()}
          searchResult={searchResult}
          showMore={showMore}
          handleShowMore={fetchMore}
        />
      </main>
      <nav class="flex-2" />
    </div>
  );
};

type Props = {
  loading: boolean;
  category: string | undefined;
  searchResult: SearchResult;
  showMore: (category: keyof SearchResult) => void;
  handleShowMore: (category: keyof SearchResult) => void;
};

const nothingToShow = () => (
  <p class="text-center text-lg text-gray-400">-- Nothing to show --</p>
);

const GameResult = (props: Props) => (
  <Show when={(props.category || 'games') === 'games'}>
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
            <Show when={props.showMore('games')}>
              <ShowMoreButton onClick={() => props.handleShowMore('games')} />
            </Show>
          </div>
        </Show>
      </Show>
      <Show when={props.category !== 'games'}>
        <hr class="my-10 h-px border-0 bg-gray-200" />
      </Show>
    </div>
  </Show>
);

const UserResult = (props: Props) => (
  <Show when={(props.category || 'users') === 'users'}>
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
            <Show when={props.showMore('users')}>
              <ShowMoreButton onClick={() => props.handleShowMore('users')} />
            </Show>
          </div>
        </Show>
      </Show>
      <Show when={props.category !== 'users'}>
        <hr class="my-10 h-px border-0 bg-gray-200" />
      </Show>
    </div>
  </Show>
);

const PostResult = (props: Props) => (
  <Show when={(props.category || 'posts') === 'posts'}>
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
            <Show when={props.showMore('posts')}>
              <ShowMoreButton
                vertical
                onClick={() => props.handleShowMore('posts')}
              />
            </Show>
          </div>
        </Show>
      </Show>
      <Show when={props.category !== 'posts'}>
        <hr class="my-10 h-px border-0 bg-gray-200" />
      </Show>
    </div>
  </Show>
);

const BlogResult = (props: Props) => (
  <Show when={(props.category || 'blogs') === 'blogs'}>
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
            <Show when={props.showMore('blogs')}>
              <ShowMoreButton
                vertical
                onClick={() => props.handleShowMore('blogs')}
              />
            </Show>
          </div>
        </Show>
      </Show>
    </div>
  </Show>
);
