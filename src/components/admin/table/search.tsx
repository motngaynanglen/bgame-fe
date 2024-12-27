'use client';

import { Input } from 'antd';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { IoSearchSharp } from 'react-icons/io5';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  // function handleSearch(term: string) { 
  //     //code này mỗi lần nhận 1 kí tự sẽ tự động query 1 lần -> tốn tài nguyên
  //     console.log(term);
  //     const params = new URLSearchParams(searchParams);
  //     if (term) {
  //       params.set('query', term);
  //     } else {
  //       params.delete('query');
  //     }
  //     replace(`${pathname}?${params.toString()}`);   
  // }
  const handleSearch = useDebouncedCallback((term) => {
    //Code này cho delay 300ms khi nhập và có thư viện debounced hỗ trọ... nên dùng!
    console.log(term);
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <Input
        className=" rounded-md border border-gray-200 outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        size='large'
        defaultValue={searchParams.get('query')?.toString()}
        prefix={<IoSearchSharp />}
      />
    </div>
  );
}
