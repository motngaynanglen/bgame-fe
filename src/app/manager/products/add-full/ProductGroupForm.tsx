"use client";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Button, Select, Card, Form, Input, Space, message } from "antd";
import { useEffect, useState } from "react";
import axios from "@/src/apiRequests/axios";
import productGroupApiRequest from "@/src/apiRequests/productGroup";
import { m } from "framer-motion";
import { useAppContext } from "@/src/app/app-provider";
import { to } from "@react-spring/web";
const { Option } = Select;

type FormValues = {
    id: string | null | undefined,
    groupName: string
}
const defaultValue = {
    id: "",
    groupName: ""
};
type Mode = 'select' | 'create'
type ProductGroupFormProps = {
    onGroupCreated?: (groupId: string) => void;
};

export default function ProductGroupFrom({ onGroupCreated }: ProductGroupFormProps) {
    const user = useAppContext().user;
    const [mode, setMode] = useState<Mode>('select')
    const [groupList, setGroupList] = useState<FormValues[]>([])

    const numberAdd = useForm<FormValues>({
        defaultValues: defaultValue,
        // resolver: zodResolver(BoardGameBody)
    });
    const { control, setValue, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = numberAdd;
    const selectedId = watch('id');
    const groupName = watch('groupName');
    // Gọi API lấy danh sách group
    const fetchGroupList = async () => {
        try {
            const res = await productGroupApiRequest.getList({});
            if (res.status == 404) {
                message.error('Danh sách nhóm sản phẩm không tồn tại');
                setGroupList([]);
                return;
            }

            const data: FormValues[] = res.data?.map((item: any) => ({
                id: item.id,
                groupName: item.group_name
            })) || [];
            setGroupList(data);
        } catch (err) {
            message.error('Không lấy được danh sách nhóm sản phẩm');
        }
    };

    useEffect(() => {
        fetchGroupList();
    }, []);

    const title = () => {
        return (
            <Space className="w-full justify-between">
                Nhóm sản phẩm
                < Select value={mode} onChange={handleModeChange} style={{ width: 150 }
                }>
                    <Option value="select">Chọn sẵn</Option>
                    <Option value="create">Tạo mới</Option>
                </Select >
            </Space >
        );
    };
    const onSubmit = async (data: FormValues) => {
        if(isSubmitting) {
            message.warning('Đang gửi yêu cầu, vui lòng đợi phản hồi từ hệ thống.');
            return;
        }
        if (mode === 'select') {
            message.warning('Bạn đang ở chế độ chọn sẵn, không thể gửi form.')
            return
        }

        try {
            const res = await productGroupApiRequest.addProductGroup({
                groupName: data.groupName,
            }, user?.token || '');

            const createdId = res.data ?? "";
            onGroupCreated?.(createdId ?? "");
            if (res?.statusCode == "200") {
                message.success(res?.message || "Tạo nhóm thành công.");
                await fetchGroupList(); // cập nhật lại danh sách

                // tìm group vừa tạo nếu có id trả về
                const newGroup: FormValues = {
                    id: res.data ?? null,
                    groupName: data.groupName
                };

                // set lại state/form
                setValue("id", newGroup.id);
                setValue("groupName", newGroup.groupName);
                setMode("select");
                onGroupCreated?.(createdId);
            } else {
                message.error(res.data?.message || "Tạo nhóm thất bại.");
            };
        } catch (error) {
            message.error("Lỗi khi tạo mới nhóm.");
        };
    };

    const handleModeChange = (value: Mode) => {
        setMode(value);
        if (value === "create") {
            reset({ id: null, groupName: "" });
        } else {
            reset({ id: null, groupName: "" });
        }
    };

    const handleSelectGroup = (value: string) => {
        const selected = groupList.find((g) => g.id === value);
        if (selected) {
            setValue("id", selected.id);
            setValue("groupName", selected.groupName);
            onGroupCreated?.(selected.id ?? '');
        }
    };

    return (
        <>
            <Card title={title()} style={{ marginBottom: 16 }} styles={{ header: { backgroundColor: '#5c6cfa', color: '#ffffff' } }}>
                {mode === 'select' ? (
                    <Select
                        showSearch
                        placeholder="Chọn nhóm"
                        style={{ width: '100%', marginBottom: 12 }}
                        onChange={handleSelectGroup}
                        value={selectedId || undefined}
                        optionFilterProp="children"
                    >
                        {groupList.map((group) => (
                            <Option key={group.id} value={group.id}>
                                {group.groupName}
                            </Option>
                        ))}
                    </Select>
                ) : null}
                {/* <Input
                    {...register('id')}
                    type={mode === 'select' ? 'text' : 'hidden'}
                    placeholder="ID nhóm sản phẩm"
                    value={selectedId || ''}
                    readOnly={true}
                    disabled={true}
                    style={{ marginBottom: 12 }}
                /> */}
                {/* <Input
                    {...register('groupName')}
                    type={mode !== 'select' ? 'text' : 'hidden'}
                    // value={groupName}
                    placeholder="Nhóm sản phẩm"
                    readOnly={mode === 'select' ? true : false}
                    disabled={mode === 'select' ? true : false}
                    style={{ marginBottom: 12 }}
                /> */}
                <Form>
                    <Form.Item name="groupName" hidden={mode !== 'select' ? false : true}>
                        <Controller
                            name="groupName"
                            control={control}
                            render={({ field }) => (
                                <Input {...field}
                                    placeholder="Nhóm sản phẩm"
                                    readOnly={mode === 'select' ? true : false}
                                    disabled={mode === 'select' ? true : false}
                                />
                            )}
                        />
                        {/* <Input
                            {...register('groupName')}
                            type={mode !== 'select' ? 'text' : 'hidden'}
                            placeholder="Nhóm sản phẩm"
                            readOnly={mode === 'select' ? true : false}
                            disabled={mode === 'select' ? true : false}
                        /> */}
                    </Form.Item>

                    <div className="flex justify-between items-center">
                        <p className="text-gray-500 ps-3">
                            {selectedId !== null ? <>Mã đã chọn: {selectedId}</> : <></>}
                        </p>
                        <Button
                            className="float-right"
                            type="primary"
                            onClick={handleSubmit(onSubmit)}
                            disabled={mode === 'select'}
                        >
                            Submit nhóm
                        </Button>
                    </div>
                </Form>
            </Card>
        </>
    );
}