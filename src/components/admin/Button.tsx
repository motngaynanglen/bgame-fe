import { Edit3, Trash2, Eye } from 'react-feather';
import Link from 'next/link';
import { Button } from 'antd';
import { AiOutlinePlus } from 'react-icons/ai';
// NEXT TO FIX CLASSSSSSSSSSSSSS
export function CreateButton({ link, title = '' }: { link: string; title: string }) {
    return (
        <>
            <Link className='flex h-10 justify-center items-center rounded-lg px-4 text-sm font-medium text-white bg-blue-600 transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600' href={link ? link : "#"}>
                {/* <Button type="dashed"> */}
                    <span className="md:block flex items-center">{title}</span>{' '}
                    <AiOutlinePlus />
                {/* </Button> */}
            </Link>
        </>

    );
}

export function UpdateButton({ id = "", link }: { link: string; id: string }) {
    const url = link + id;
    return (
        <Link
            href={url ? url : "#"}
            className=" border p-1 me-1 table-button-action"
        >
            <Edit3 className="w-5" />
        </Link>
    );
}
export function DetailButton({ id, link }: { link: string; id: string }) {
    const url = link + id;
    return (
        <Link
            href={url ? url : "#"}
            className=" border p-1 me-1 table-button-action"
        >
            <Eye className="w-5" />
        </Link>
    );
}
export function DeleteButton({ id, link }: { link: string; id: string }) {
    return (
        <>
            <button className=" border p-1 table-button-action">
                <span className="sr-only">Delete</span>
                <Trash2 className="w-5" />
            </button>
        </>
    );
}