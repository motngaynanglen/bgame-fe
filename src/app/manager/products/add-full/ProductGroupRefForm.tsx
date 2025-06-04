"use client";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { Button, Card, Form, Input, Select, Space, message } from "antd";
import axios from "@/src/apiRequests/axios";
import productGroupRefApiRequest from "@/src/apiRequests/productGroupRef";
import { useAppContext } from "@/src/app/app-provider";
const { Option } = Select;

type Mode = "select" | "create";

type GroupRefItem = {
    id: string;
    group_id: string;
    prefix: string;
    group_ref_name: string;
    description: string | null;
};

type FormValues = {
    id: string | null;
    prefix: string;
    groupRefName: string;
    description: string;
};

const defaultValues: FormValues = {
    id: null,
    prefix: "",
    groupRefName: "",
    description: "",
};
type ProductGroupRefFormProps = {
    groupId: string;
    onGroupRefCreated?: (groupRefId: string) => void;
};
export default function ProductGroupRefForm({ groupId, onGroupRefCreated }: ProductGroupRefFormProps) {
    const user = useAppContext().user;
    const [mode, setMode] = useState<Mode>("select");
    const [readonly, setReadonly] = useState(false);
    const [refList, setRefList] = useState<GroupRefItem[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [selectedRef, setSelectedRef] = useState<GroupRefItem | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
        reset,
    } = useForm<FormValues>({ defaultValues });

    const selectedId = watch("id");

    const fetchRefList = async () => {
        setIsFetching(true);
        try {
            const res = await productGroupRefApiRequest.getListByGroupId(
                { groupId: groupId }
            );

            if (res.status === 404) {
                message.warning("Không có nhóm tham chiếu cho group này.");
                setRefList([]);
                return;
            }
            console.log(res.data);
            const data: GroupRefItem[] = res.data || [];
            setRefList(data);
        } catch {
            message.error("Không thể lấy danh sách nhóm tham chiếu.");
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        if (groupId) fetchRefList();
    }, [groupId]);

    const handleModeChange = (value: Mode) => {
        setMode(value);
        if (value === "create") {
            setReadonly(false);
            reset({ id: null, prefix: "", groupRefName: "", description: "" });
        } else {
            setReadonly(true);
            reset({ id: null, prefix: "", groupRefName: "", description: "" });
        }
    };

    const handleSelect = (id: string) => {
        const item = refList.find((i) => i.id === id);
        if (item) {
            setSelectedRef(item);

            onGroupRefCreated?.(item.id);
            setValue("id", item.id);
            setValue("prefix", item.prefix);
            setValue("groupRefName", item.group_ref_name);
            setValue("description", item.description || "");
            setReadonly(true);
        }
    };

    const onSubmit = async (data: FormValues) => {
        if (mode === "select") {
            message.warning("Bạn đang ở chế độ chọn sẵn.");
            return;
        }

        try {
            const res = await productGroupRefApiRequest.addProductGroupRef({
                groupId: groupId,
                prefix: data.prefix,
                groupRefName: data.groupRefName,
                description: data.description,
            }, user?.token || '');
            const createdId = res.data ?? "";
            onGroupRefCreated?.(createdId ?? "");
            if (res?.statusCode == "200") {
                message.success(res?.message || "Tạo nhóm thành công.");
                await fetchRefList(); // cập nhật lại danh sách

                // tìm group vừa tạo nếu có id trả về
                const newGroup: FormValues = {
                    id: res.data ?? null,
                    groupRefName: data.groupRefName,
                    prefix: data.prefix,
                    description: data.description || "",

                };

                // set lại state/form
                setValue("id", newGroup.id);
                setValue("groupRefName", newGroup.groupRefName);
                setValue("prefix", newGroup.prefix);
                setMode("select");
                setReadonly(true);
                onGroupRefCreated?.(createdId);
            } else {
                message.error(res.data?.message || "Tạo nhóm thất bại.");
            };
        } catch {
            message.error("Tạo mới thất bại.");
        }
    };

    const title = (
        <Space className="w-full justify-between">
            Nhóm tham chiếu
            <Select value={mode} onChange={handleModeChange} style={{ width: 150 }}>
                <Option value="select">Chọn sẵn</Option>
                <Option value="create">Tạo mới</Option>
            </Select>
        </Space>
    );

    return (
        <Card title={title} style={{ marginBottom: 16 }} styles={{ header: { backgroundColor: '#5c6cfa', color: '#ffffff' } }}>
            {mode === "select" && (
                <Select
                    showSearch
                    loading={isFetching}
                    value={selectedId || undefined}
                    placeholder="Chọn nhóm tham chiếu"
                    style={{ width: "100%", marginBottom: 12 }}
                    onChange={handleSelect}
                    filterOption={(input, option) =>
                        option?.children?.toString().toLowerCase().includes(input.toLowerCase()) ?? false
                    }
                >
                    {refList.map((ref) => (
                        <Option key={ref.id} value={ref.id}>
                            {ref.prefix} - {ref.group_ref_name}
                        </Option>
                    ))}
                </Select>
            )}

            {/* <Input
                {...register("prefix")}
                placeholder="Prefix"
                readOnly={readonly}
                disabled={mode === "select"}
                style={{ marginBottom: 8 }}
            />
            <Input
                {...register("groupRefName")}
                placeholder="Tên nhóm tham chiếu"
                readOnly={readonly}
                disabled={mode === "select"}
                style={{ marginBottom: 8 }}
            />
            <Input.TextArea
                {...register("description")}
                placeholder="Mô tả"
                readOnly={readonly}
                disabled={mode === "select"}
                style={{ marginBottom: 12 }}
            /> */}
            <Form
            // labelCol={{ span: 3 }}
            // wrapperCol={{ span: 21 }}
            >
                <Form.Item >
                    <Controller
                        name="prefix"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="Tên prefix" readOnly={mode === 'select'} />
                        )}
                    />
                </Form.Item>

                <Form.Item >
                    <Controller
                        name="groupRefName"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="Tên nhóm tham chiếu" readOnly={mode === 'select'} />
                        )}
                    />
                </Form.Item>

                <Form.Item >
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <Input.TextArea {...field} placeholder="Mô tả" readOnly={mode === 'select'} />
                        )}
                    />
                </Form.Item>
                <div className="flex justify-between items-center">

                    <p className="text-gray-500 ps-3">
                        {selectedId !== null ? <>Mã đã chọn: {selectedId}</> : <></>}
                    </p>
                    <Button
                        type="primary"
                        onClick={handleSubmit(onSubmit)}
                        disabled={mode === "select"}
                    >
                        Submit nhóm tham chiếu
                    </Button>
                </div>
            </Form>
        </Card>
    );
}
