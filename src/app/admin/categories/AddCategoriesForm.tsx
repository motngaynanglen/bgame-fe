'use client'

import { useEffect, useState } from 'react'
import { Input, Button, Checkbox, Tag, message } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import categoryApiRequest from '@/src/apiRequests/category'
import { useAppContext } from '../../app-provider'
import { Axios, AxiosError } from 'axios'

interface TempItem {
  name: string
  selected: boolean
  error?: boolean
}
type AddCategoriesFormProps = {
  onChangeItem?: (item: string[]) => void
}
export default function AddCategoriesForm({ onChangeItem }: AddCategoriesFormProps) {
  const { user } = useAppContext();
  const [inputValue, setInputValue] = useState('')
  const [items, setItems] = useState<TempItem[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const addItem = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    if (items.find((i) => i.name.toLowerCase() === trimmed.toLowerCase())) {
      message.warning('Tên bị trùng!')
      return
    }
    setItems([...items, { name: trimmed, selected: true }])
    setInputValue('')
  }
  useEffect(() => {
    if (onChangeItem) {
      onChangeItem(items.map((i) => i.name).filter((name) => name.trim() !== ''));
    }
  }, [items]);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    setItems(items.map((i) => ({ ...i, selected: checked })))

  }

  const handleSelectItem = (index: number, checked: boolean) => {
    const newItems = [...items]
    newItems[index].selected = checked
    setItems(newItems)
    setSelectAll(newItems.every((i) => i.selected))
  }

  const handleDeleteItem = (index: number) => {
    const newItems = [...items]
    newItems.splice(index, 1)
    setItems(newItems)
  }

  const handleCreate = async () => {
    if (user === null) {
      message.error('Bạn cần đăng nhập để thực hiện thao tác này.')
      return
    }
    const queue = [...items]
    setLoading(true)

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i]
      if (!item.selected) continue

      try {
        const res = await categoryApiRequest.createCategory({ name: item.name }, user?.token)
        if (res.status === 200) {
          queue.splice(i, 1)
          i-- // adjust index after removal
        } else {
          queue[i].error = true
          break
        }
      } catch (error) {
        queue[i].error = true;
        if (error instanceof AxiosError) {
          message.error(`Lỗi: ${error.response?.data.message || error.message}`);
        }
        break
      }
    }

    setItems(queue)
    setLoading(false)
  }

  const filteredItems = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Tạo danh mục</h2>
      <Input.Search
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onSearch={addItem}
        placeholder="Nhập tên danh mục và Enter"
        enterButton={<PlusOutlined />}
      />

      <div className="mt-4">
        <Checkbox
          checked={selectAll}
          onChange={(e) => handleSelectAll(e.target.checked)}
        >
          Chọn tất cả ({items.length} mục)
        </Checkbox>

        <Input
          className="mt-2"
          placeholder="Tìm kiếm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mt-2 max-h-64 overflow-y-auto border rounded p-2">
        {filteredItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-1 rounded ${item.error ? 'border border-red-500 bg-red-50 text-red-600' : ''
              }`}
          >
            <Checkbox
              checked={item.selected}
              onChange={(e) => handleSelectItem(index, e.target.checked)}
            >
              {item.name}
            </Checkbox>
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              onClick={() => handleDeleteItem(index)}
            />
          </div>
        ))}
      </div>

      <Button
        type="primary"
        className="mt-4 w-full"
        onClick={handleCreate}
        loading={loading}
        disabled={items.every((i) => !i.selected)}
      >
        Tạo danh mục
      </Button>
    </div>
  )
}
