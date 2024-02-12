import { SearchProvider } from '@/context';
import { SearchDetails } from '@/parts';

export const Search = () => (
  <SearchProvider>
    <SearchDetails />
  </SearchProvider>
);
