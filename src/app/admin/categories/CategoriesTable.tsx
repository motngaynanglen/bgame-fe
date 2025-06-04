
'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { Table, Tag, Button, message, Space, Input } from 'antd'
import categoryApiRequest from '@/src/apiRequests/category'
import { useAppContext } from '../../app-provider'
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'

interface Category {
    id: string
    name: string
    status: 'ACTIVE' | 'DEACTIVE'
}

export default function CategoriesTable() {
    const { user } = useAppContext();
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const fetchCategories = async () => {
        setLoading(true)
        // Giả lập dữ liệu gọi từ API
        try {
            const res = await categoryApiRequest.getCategoryByAdmin({}, user?.token);
            const data: Category[] = res.data || [] // Giả sử API trả về danh sách categories
            setCategories(data);
        } catch (error) {
            if (error instanceof Error) {
                message.error(`Lỗi: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchCategories();
    }, [searchText]);

    const handleToggleStatus = (id: string) => {
        const updated = categories.map((cat) =>
            cat.id == id
                ? { ...cat, status: cat.status === 'ACTIVE' ? 'DEACTIVE' : 'ACTIVE' }
                : cat
        )
        // setCategories(updated);
        message.success('Cập nhật trạng thái thành công')
    }
    const filteredCategories = useMemo(() => {
        return categories.filter((cat) =>
            cat.name.toLowerCase().includes(searchText.toLowerCase())
        )
    }, [categories, searchText])

    const columns = [
        // {
        //     title: 'ID',
        //     dataIndex: 'id',
        //     key: 'id',

        // },
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: 'ACTIVE' | 'DEACTIVE') => (
                <Tag color={status === 'ACTIVE' ? 'green' : 'volcano'}>
                    {status === 'ACTIVE' ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: Category) => (
                <Button
                    type="link"
                    danger={record.status === 'ACTIVE'}
                    // onClick={() => handleToggleStatus(record.id)}
                >
                    {record.status === 'ACTIVE' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                </Button>
            ),
        },
    ]

    return (
        <div className="p-4">
            <h1 className="text-xl font-semibold mb-4">Quản lý danh mục</h1>
            <Space>
                <Suspense>
                    <Input
                        placeholder="Tìm kiếm danh mục"
                        prefix={<SearchOutlined />}
                        allowClear
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </Suspense>
                <Button
                    icon={<ReloadOutlined />}
                    onClick={fetchCategories}
                    loading={loading}
                >
                    Tải lại
                </Button>
            </Space>
            <Table
                columns={columns}
                dataSource={filteredCategories}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: filteredCategories.length,
                    onChange: (page, size) => {
                        setCurrentPage(page)
                        setPageSize(size ?? 10)
                    },
                    showSizeChanger: true,
                }}
            />
        </div>
    )
}
