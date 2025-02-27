'use client';


import Link from 'next/link';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { BsSearch } from 'react-icons/bs';
import { useDebouncedCallback } from 'use-debounce';

export default function HeaderSearch({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`/products?${params.toString()}`);
    }, 300);
    return (
        <form className="basis-full sm:basis-1/3 h-auto mt-2 sm:mt-0">
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <BsSearch className="fill-green-700" />
                </div>
                <input
                    type="search"
                    id="default-search"
                    className=" w-full p-3 ps-10 text-sm text-gray-900  border-gray-300 rounded-md bg-gray-50  "
                    placeholder={placeholder}
                    defaultValue={searchParams.get('query')?.toString()}
                    onChange={(e) => {
                        handleSearch(e.target.value);
                    }}
                />
                <button
                    type='submit'
                    className="text-white absolute end-2.5 bottom-2 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1  dark:focus:ring-blue-800"
                >
                    Tìm Kiếm
                </button>

            </div>
        </form>
    );
}
