'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formUrlQuery, removeKeysFromUrlQuery } from '@/lib/utils';
import { SearchIcon } from 'lucide-react';


const SearchInput = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get('topic') || '';
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const paramsObj = Object.fromEntries(searchParams.entries());

      if (searchQuery) {
        const newUrl = formUrlQuery({
          params: paramsObj,
          key: 'topic',
          value: searchQuery,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === '/companion') {
          const newUrl = removeKeysFromUrlQuery({
            params: paramsObj,
            keysToRemove: ['topic'],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, router, searchParams, pathname]);

  return (
    <div className="relative group sm:w-[350px] w-full">
      <div className="absolute left-6 top-1/2 -translate-y-1/2">
        <SearchIcon className="size-4 text-white/20 group-focus-within:text-magenta transition-colors" />
      </div>
      <input
        placeholder="SEARCH_COGNITIVE_NODES..."
        className="w-full bg-black/40 border border-white/10 h-14 pl-14 pr-6 text-[10px] uppercase tracking-[3px] font-black focus:outline-none focus:border-magenta/50 transition-all placeholder:text-white/10"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-magenta group-focus-within:w-full transition-all duration-700"></div>
    </div>
  );
};

export default SearchInput;
