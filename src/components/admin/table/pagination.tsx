'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { generatePagination } from '@/src/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Pagination } from 'antd';
//config pagesize fo


export default function AntdCustomPagination({ totalPages, pageSize = 10 }: { totalPages: number; pageSize?: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handlePaginationChange = (page: number) => {
    console.log(pageSize)
    router.push(createPageURL(page));
  }
  // const allPages = generatePagination(currentPage, totalPages);

  return (
    <>
      <Pagination
        hideOnSinglePage
        align='center'
        showQuickJumper={true}
        showSizeChanger={false}
        defaultCurrent={1}
        current={currentPage}
        pageSize={pageSize} total={totalPages * pageSize}
        onChange={(page) => handlePaginationChange(page)} />
    </>
  );
}

