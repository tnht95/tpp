import { useParams } from '@solidjs/router';
import {
  batch,
  createEffect,
  createMemo,
  createResource,
  createSignal,
  For,
  Show
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import { tagSearchAction, TagSearchQueryInput } from '@/apis';
import {
  BlogCard,
  GameCard,
  LoadingSpinner,
  ShowMoreButton
} from '@/components';
import { PAGINATION } from '@/constant';
import { useToastCtx } from '@/context';
import { BlogSummary, GameSummary, RespErr, TagSearchResult } from '@/models';

type FetchMoreOpts = {
  games: { offset: number; showMore: boolean };
  blogs: { offset: number; showMore: boolean };
};

export const TagSearch = () => {
  const { showToast } = useToastCtx();
  const param = useParams();
  const [tag, setTag] = createSignal<string>(param['name'] as string);
  const [query, setQuery] = createSignal<[string, TagSearchQueryInput]>();
  const [searchResource] = createResource(query, tagSearchAction);
  const [searchResult, setSearchResult] = createStore<TagSearchResult>({
    games: [],
    blogs: []
  });
  const [fetchMoreOpts, setFetchMoreOpts] = createSignal<FetchMoreOpts>({
    games: { offset: 0, showMore: true },
    blogs: { offset: 0, showMore: true }
  });

  createEffect(() => {
    setTag(param['name'] as string);
    setQuery([
      tag(),
      {
        limit: PAGINATION,
        category: undefined,
        offset: 0
      }
    ]);
  });

  createEffect(() => {
    if (searchResource.state === 'ready') {
      batch(() => {
        setSearchResult(searchResource());
        setFetchMoreOpts(opts => ({
          games: {
            ...opts.games,
            showMore: searchResource().games.length === PAGINATION
          },
          blogs: {
            ...opts.blogs,
            showMore: searchResource().blogs.length === PAGINATION
          }
        }));
      });
    }

    if (searchResource.error) {
      showToast({
        msg: (searchResource.error as Error).message,
        type: 'err'
      });
    }
  });

  const fetchMore = (category: keyof TagSearchResult) => {
    tagSearchAction([
      tag(),
      {
        category,
        offset: fetchMoreOpts()[category].offset + PAGINATION,
        limit: PAGINATION
      }
    ])
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
                ...(result[category] as GameSummary[] & BlogSummary[])
              )
            )
          );
        })
      )
      .catch((error: RespErr) => showToast({ msg: error.msg, type: 'err' }));
  };

  const showMoreFn = (category: keyof FetchMoreOpts) =>
    fetchMoreOpts()[category].showMore;
  const showMore = createMemo(() => showMoreFn);

  return (
    <div class="flex min-h-[calc(100svh-4rem)]">
      <nav class="sticky right-0 top-0 flex-1 border border-dashed" />
      <main class="flex flex-2 flex-col gap-7 px-32 py-10">
        <p class="text-2xl font-bold text-indigo-900">
          Results for tag {`"${decodeURIComponent(tag())}"`}:
        </p>
        <GameResult
          loading={searchResource.loading}
          category={'games'}
          searchResult={searchResult}
          showMore={showMore()}
          handleShowMore={fetchMore}
        />
        <BlogResult
          loading={searchResource.loading}
          category={'blogs'}
          searchResult={searchResult}
          showMore={showMore()}
          handleShowMore={fetchMore}
        />
      </main>
      <nav class="sticky left-0 top-0 flex-1 border border-dashed" />
    </div>
  );
};

type Props = {
  loading: boolean;
  category: string | undefined;
  searchResult: TagSearchResult;
  showMore: (category: keyof TagSearchResult) => void;
  handleShowMore: (category: keyof TagSearchResult) => void;
};

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

const nothingToShow = () => (
  <p class="text-center text-lg text-gray-400">-- Nothing to show --</p>
);

const BlogResult = (props: Props) => (
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
);
