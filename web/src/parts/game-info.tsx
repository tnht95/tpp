import { Markdown } from '@/components';
import { useGameCtx } from '@/context';

export const GameInfo = () => {
  const {
    gameDetails: { data }
  } = useGameCtx();
  return (
    <div class="rounded-lg border px-8 py-6">
      <Markdown content={data()?.info as string} />
    </div>
  );
};
