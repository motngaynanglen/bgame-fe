// src/components/CustomerSelector/CustomerSelector.tsx
import { useState } from "react";
import { AutoComplete, Button, Modal, Form, Input, Card } from "antd";
import { UserAddOutlined } from "@ant-design/icons";

// Mock data cho khách hàng hiện có
const mockCustomers: Customer[] = [
    { name: "Nguyễn Văn A", id: "cust1", phone: "0909123456" },
    { name: "Trần Thị B", id: "cust2", phone: "0987654321" },
];
interface Customer {
    id: string;
    name: string;
    phone: string;
    value?: string;
    label?: string;
}
interface CustomerSelectorProps {
    selectedCustomer: Customer | null;
    onClearCustomer: () => void;
    onSelectCustomer: (customer: Customer) => void;
}

const CustomerSelector = ({ selectedCustomer, onSelectCustomer, onClearCustomer }: CustomerSelectorProps) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [options, setOptions] = useState<{ value: string; label: string; customer: Customer }[]>([]);
    const [form] = Form.useForm();

    const handleSearch = (searchText: string) => {
        if (!searchText) {
            setOptions([]);
            return;
        }
        //gọi api
        const antdOptions = mockCustomers.map((c: Customer) => ({
            value: `${c.name} - ${c.phone}`,
            label: `${c.name} - ${c.phone}`,
            customer: c,
        })) as any;
        setOptions(antdOptions);
    };

    const handleAddNewCustomer = () => {
        form.validateFields().then((values) => {
            console.log("New customer:", values);
            // Gọi API để tạo khách hàng mới
            // Sau khi thành công, có thể tự động chọn khách hàng này
            setIsModalVisible(false);
            form.resetFields();
        });
    };
    if (selectedCustomer) {
        return (
            <Card size="small" className="mb-4">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold">{selectedCustomer.name}</p>
                        <p className="text-sm text-gray-500">{selectedCustomer.phone}</p>
                    </div>
                    <Button type="link" danger onClick={onClearCustomer}>
                        Thay đổi
                    </Button>
                </div>
            </Card>
        );
    }
    return (
        <div className="customer-selector mb-4">
            <h3 className="font-semibold mb-2">Thông tin khách hàng</h3>
            <div className="flex items-center gap-2">
                <AutoComplete
                    options={options}
                    onSearch={handleSearch}
                    onSelect={(value, option) => onSelectCustomer(option.customer as Customer)}
                    placeholder="Tìm kiếm theo SĐT hoặc Tên"
                    className="flex-grow"
                />
                <Button icon={<UserAddOutlined />} onClick={() => setIsModalVisible(true)}>
                    Thêm mới
                </Button>
            </div>

            <Modal
                title="Thêm khách hàng mới"
                open={isModalVisible}
                onOk={handleAddNewCustomer}
                onCancel={() => setIsModalVisible(false)}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Tên khách hàng"
                        rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[{ required: true, message: "Vui lòng nhập SĐT!" }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CustomerSelector;