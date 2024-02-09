import { Markdown } from '@/components';
import { useGameDetailsCtx } from '@/context';

export const GameInfo = () => {
  const { game } = useGameDetailsCtx();
  return (
    <div class="rounded-lg border px-8 py-6">
      <Markdown content={game()?.info as string} />
    </div>
  );
};
