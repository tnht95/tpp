import { Markdown } from '@/components';
import { useGameCtx } from '@/context';

export const GameInfo = () => {
  const {
    gameDetails: { data }
  } = useGameCtx();
  return (
    <div class="border-b py-6 rounded-lg border px-8">
      <Markdown content={data()?.info as string} />
    </div>
  );
};
