import { useGameCtx } from '@/context';

export const GameInfo = () => {
  const { game } = useGameCtx();

  return (
    <div class="border-b py-6 md:rounded-lg md:border md:px-8">
      {game()?.info}
    </div>
  );
};
