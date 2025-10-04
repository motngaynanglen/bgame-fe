import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  message,
  Card,
  Tabs,
  Space,
  Upload,
  Row,
  Col,
  InputNumber,
  ConfigProvider,
  Image,
  Typography,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  InboxOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { TabsProps, UploadFile, UploadProps } from "antd";
import axios from "axios";
import {
  ProductResType,
  productTemplateBodyType,
  productTemplateSchema,
} from "@/src/schemaValidations/product.schema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppContext } from "@/src/app/app-provider";
import { useImageUploader } from "@/src/hooks/useImageUploader";
import { RcFile } from "antd/es/upload";
import productApiRequest from "@/src/apiRequests/product";
import TipTapEditor from "@/src/components/TipTapEditor/TipTapEditor";
import { FormItem } from "react-hook-form-antd";
import Dragger from "antd/es/upload/Dragger";
import { on } from "events";
import { formatVND } from "@/src/lib/utils";
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
type Mode = "select" | "create";
const defaultValues: productTemplateBodyType = {
  id: null,
  productGroupRefId: undefined,
  productName: "",
  images: [],
  price: 0,
  rentPrice: 0,
  rentPricePerHour: 0,
  hardRank: 0,
  age: 0,
  numberOfPlayerMin: 0,
  numberOfPlayerMax: 0,
  description: "",
  publisher: "",
  duration: 0,
  listCategories: null,
};
const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith("image/");
  const isLt20MB = file.size / 1024 / 1024 <= 20;
  if (!isImage) {
    message.error("Chỉ cho phép ảnh!");
    return Upload.LIST_IGNORE;
  }
  if (!isLt20MB) {
    message.error("Dung lượng ảnh phải ≤ 20MB!");
    return Upload.LIST_IGNORE;
  }
  return true;
};
const uploadProps: UploadProps = {
  accept: "image/*",
  beforeUpload: beforeUpload,
  multiple: true,
  maxCount: 10,
  listType: "picture",
  showUploadList: {
    showPreviewIcon: true,
    showRemoveIcon: true,
  },
};
type ProductTemplateFormProps = {
  productGroupRefId: string;
  onProductTemplateCreated?: (groupRefId: string) => void;
};

// Format giá tiền và xử lý trường null
const formatField = (value: any, enable: boolean) => {
  if ((value === null || value === undefined || value === "") && enable) {
    return (
      <Text type="warning">
        <ExclamationCircleOutlined /> Cần bổ sung
      </Text>
    );
  }
  // return typeof value === 'number'
  //   ? formatVND(value)
  //   : value;
};

// const statusMeta: Record<string, { color: string; label: string }> = {
//   CREATED: { color: "warning", label: "Chưa Thanh Toán" },
//   PAID: { color: "green", label: "Đang xử lý" },
//   PREPARED: { color: "blue", label: "Đã chuẩn bị" },
//   DELIVERING: { color: "processing", label: "Đang giao" },
//   RECEIVED: { color: "success", label: "Hoàn tất" },
//   CANCELLED: { color: "error", label: "Đã hủy" },
// };
 const statusMeta = [
  { value: "Chiến thuật", label: "Chiến thuật" },
  { value: "Gia đình", label: "Gia đình" },
  { value: "Vui nhộn", label: "Vui nhộn" },
  { value: "Nhập vai", label: "Nhập vai" },
  { value: "Trí tuệ", label: "Trí tuệ" },
  { value: "Đảng phái", label: "Đảng phái" },
  { value: "Đấu trí", label: "Đấu trí" },
  { value: "Sáng tạo", label: "Sáng tạo" },
  { value: "Hài hước", label: "Hài hước" },
  { value: "Kinh dị", label: "Kinh dị" },
  { value: "Phiêu lưu", label: "Phiêu lưu" },
  { value: "Kỳ ảo", label: "Kỳ ảo" },
  { value: "Lịch sử", label: "Lịch sử" },
  { value: "Khoa học viễn tưởng", label: "Khoa học viễn tưởng" },
  { value: "Chiến tranh", label: "Chiến tranh" },
  { value: "Đấu bài", label: "Đấu bài" },
  { value: "Xây dựng", label: "Xây dựng" },
  { value: "Đấu súng", label: "Đấu súng" },
  { value: "Đồng đội", label: "Đồng đội" },
  { value: "Độc lập", label: "Độc lập" },
  
 ]
export default function ProductForm({
  productGroupRefId,
  onProductTemplateCreated,
}: ProductTemplateFormProps) {
  const { user } = useAppContext();
  const [mode, setMode] = useState<Mode>("select");
  const [imageList, setImageList] = useState<string[] | string>([]);
  const { uploadImages, uploading } = useImageUploader();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [category, setCategory] = useState<string[]>([]);

  const [productList, setProductList] = useState<ProductResType[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [enableFieldChecker, setEnableFieldChecker] = useState<boolean>(false);

  const form = useForm<productTemplateBodyType>({
    resolver: zodResolver(productTemplateSchema),
    defaultValues: {
      ...defaultValues,
      productGroupRefId: productGroupRefId || undefined,
    },
  });
  const {
    control,
    watch,
    getValues,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = form;

  const fetchProductList = async () => {
    if (!productGroupRefId) return;
    try {
      const res = await productApiRequest.getListByGroupRefId({
        productGroupRefId: productGroupRefId,
      });
      console.log(res);
      setProductList(res.data || []);
    } catch (e) {
      message.error(
        e instanceof Error ? e.message : "Lỗi khi lấy danh sách sản phẩm"
      );
    }
  };

  useEffect(() => {
    if (mode === "select") {
      fetchProductList();
    }
  }, [mode, productGroupRefId]);

  const handleSelectProduct = (id: string) => {
    const selected = productList.find((p) => p.id === id);
    if (!selected) return;
    setEnableFieldChecker(true);
    setSelectedProductId(id);
    setFileList(
      selected.image
        ? selected.image.split("||").map((url) => ({
            uid: url,
            name: url.split("/").pop() || "image",
            status: "done",
            url: url,
          }))
        : []
    );
    onProductTemplateCreated?.(id);
    form.reset({
      ...defaultValues,
      productGroupRefId: productGroupRefId || undefined,
      id: selected.id,
      productName: selected.product_name ?? "",
      images: selected.image?.split("||") || [],
      price: selected.price || 0,
      rentPrice: selected.rent_price || 0,
      rentPricePerHour: selected.rent_price_per_hour || 0,
      hardRank: selected.difficulty || 0,
      age: selected.age || 0,
      numberOfPlayerMin: selected.number_of_player_min || 0,
      numberOfPlayerMax: selected.number_of_player_max || 0,
      description: selected.description || "",
      publisher: selected.publisher || "",
      duration: 0,
      listCategories: null,
    });
  };

  const onSubmit = async (values: productTemplateBodyType) => {
    if (!isValid) {
      message.error("Vui lòng kiểm tra lại thông tin đã nhập.");
      return;
    }
    if (isSubmitting) {
      message.warning("Đang gửi yêu cầu, vui lòng đợi phản hồi từ hệ thống.");
      return;
    }
    if (!user) {
      return message.error("Bạn cần đăng nhập để thực hiện thao tác này.");
    }

    try {
      if (
        productGroupRefId === undefined ||
        productGroupRefId === null ||
        productGroupRefId === ""
      ) {
        message.error("Vui lòng chọn nhóm sản phẩm trước khi tạo sản phẩm.");
        return;
      }
      const imageFiles = fileList
        .map((f) => f.originFileObj)
        .filter((f): f is RcFile => !!f);

      const imageList = await uploadImages(imageFiles, "list");

      if (!imageList) return;

      const body: productTemplateBodyType = {
        ...values,
        productGroupRefId: productGroupRefId,
        images: imageList,
      };

      const res = await productApiRequest.createTemplate(body, user.token);

      message.success("Thêm sản phẩm thành công!");
      const createdId = res.data ?? "";
      onProductTemplateCreated?.(createdId);
    } catch (err) {
      message.error(
        err instanceof Error ? err.message : "Lỗi khi thêm sản phẩm"
      );
    }
  };
  const handleModeChange = (value: Mode) => {
    setMode(value);
    if (value === "create") {
      setSelectedProductId(null);
      setFileList([]);
      setEnableFieldChecker(false);
      reset(defaultValues);
    } else {
      setEnableFieldChecker(false);
      reset(defaultValues);
    }
  };
  const title = () => {
    return (
      <Space className="w-full justify-between">
        Nhóm sản phẩm
        <Select value={mode} onChange={handleModeChange} style={{ width: 150 }}>
          <Option value="select">Chọn sẵn</Option>
          <Option value="create">Tạo mới</Option>
        </Select>
      </Space>
    );
  };
  return (
    <>
      {/* <ConfigProvider prefixCls="form-ant"> */}
      <Card
        title={title()}
        style={{ marginBottom: 16 }}
        styles={{ header: { backgroundColor: "#5c6cfa", color: "#ffffff" } }}
      >
        {mode === "select" && (
          <Select
            showSearch
            placeholder="Chọn sản phẩm"
            style={{ width: "100%", marginBottom: 12 }}
            onChange={handleSelectProduct}
            value={selectedProductId || undefined}
            optionFilterProp="children"
          >
            {productList.map((p) => (
              <Option key={p.id} value={p.id}>
                <span className="flex items-center gap-2 h-10">
                  <Image
                    style={{
                      maxHeight: "1.5em",
                      width: "auto",
                      marginRight: 8,
                      objectFit: "contain",
                      borderRadius: 4,
                    }}
                    src={p.image ?? undefined}
                    alt={p.product_name ?? undefined}
                  />
                  <span className="text">{p.product_name}</span>
                </span>
              </Option>
            ))}
          </Select>
        )}

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Row gutter={[16, 16]}>
            {/* --- THÔNG TIN CHUNG --- */}
            <Col span={24}>
              <Card size="small" title="Thông tin sản phẩm">
                <Row gutter={16}>
                  <Col span={12}>
                    <FormItem
                      control={control}
                      name="productName"
                      label="Tên sản phẩm chi tiết"
                    >
                      <Input />
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      control={control}
                      name="publisher"
                      label="Nhà sản xuất"
                    >
                      <Input />
                    </FormItem>
                  </Col>
                  {/* <Col span={12}>
                    <FormItem
                      control={control}
                      name="age"
                      label="Độ tuổi gợi ý"
                    >
                      <InputNumber min={1} style={{ width: "100%" }} />
                    </FormItem>
                  </Col> */}
                </Row>
              </Card>
            </Col>
            {/* --- GIÁ CẢ --- */}
            <Col span={12}>
              <Card size="small" title="Giá bán và giá thuê">
                <Row gutter={16}>
                  <Col span={8}>
                    <FormItem control={control} name="price" label="Giá bán">
                      <InputNumber style={{ width: "100%" }} />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      control={control}
                      name="rentPrice"
                      label="Giá thuê"
                    >
                      <InputNumber style={{ width: "100%" }} />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      control={control}
                      name="rentPricePerHour"
                      label="Giá thuê theo giờ"
                    >
                      <InputNumber style={{ width: "100%" }} />
                    </FormItem>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* --- THÔNG SỐ KỸ THUẬT --- */}
            <Col span={12}>
              <Card size="small" title="Thông số kỹ thuật">
                {/* Row 1 */}
                <Row gutter={16}>
                  <Col span={8}>
                    <FormItem
                      control={control}
                      name="hardRank"
                      label="Độ khó (1–10)"
                    >
                      <InputNumber min={1} max={10} style={{ width: "100%" }} />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      control={control}
                      name="numberOfPlayerMin"
                      label="Số người chơi tối thiểu"
                    >
                      <InputNumber min={1} style={{ width: "100%" }} />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      control={control}
                      name="numberOfPlayerMax"
                      label="Số người chơi tối đa"
                    >
                      <InputNumber min={1} style={{ width: "100%" }} />
                    </FormItem>
                  </Col>
                </Row>
                {/* Row 2 */}
                <Row gutter={16}>
                  <Col span={8}>
                    <FormItem
                      control={control}
                      name="age"
                      label="Độ tuổi gợi ý"
                    >
                      <InputNumber min={1} max={10} style={{ width: "100%" }} />
                    </FormItem>
                  </Col>
                   <Col span={9}>
                    <FormItem
                      control={control}
                      name="duration"
                      label="Thời gian chơi (phút)"
                    >
                      <InputNumber min={1} style={{ width: "100%" }} />
                    </FormItem>
                  </Col>
                  <Col span={9}>
                    <FormItem
                      control={control}
                      name="listCategories"
                      label="Thể loại (vd: Chiến thuật, Gia đình...)"
                    >
                      <Select
                        mode="multiple"
                        allowClear
                        placeholder="Trạng thái"
                        value={category}
                        // onChange={(v) => {
                        //   setPageNum(1);
                        //   setStatus(v);
                        // }}
                        style={{ minWidth: 220 }}
                        options={statusMeta.map((item) => ({
                          label: item.label,
                          value: item.value,
                        }))}
                      />
                    </FormItem>
                  </Col>
                 
                </Row>
              </Card>
            </Col>

            {/* --- MÔ TẢ --- */}
            <Col span={24}>
              <Card size="small" title="Mô tả chi tiết">
                {/* <FormItem control={control} name="description" label="Mô tả">
                  <TipTapEditor value={getValues("description")} />
                </FormItem> */}
                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <Form.Item
                      label={formatField(field.value, enableFieldChecker)}
                      validateStatus={errors.description ? "error" : ""}
                      help={errors.description?.message}
                    >
                      <TipTapEditor
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        isReadonly={mode === "select"}
                        resetKey={mode + selectedProductId}
                      />
                    </Form.Item>
                  )}
                />
              </Card>
            </Col>

            {/* --- HÌNH ẢNH --- */}
            <Col span={24}>
              <Card size="small" title="Hình ảnh sản phẩm">
                <Form.Item label="Hình ảnh">
                  <Dragger
                    {...uploadProps}
                    fileList={fileList}
                    onChange={(info) => setFileList(info.fileList)}
                    disabled={uploading}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Kéo và thả hoặc chọn ảnh</p>
                    <p className="ant-upload-hint">
                      Tối đa 10 ảnh, mỗi ảnh ≤ 20MB
                    </p>
                  </Dragger>
                </Form.Item>
              </Card>
            </Col>

            {/* --- BUTTON --- */}
            <Col span={24} style={{ textAlign: "right" }}>
              <Space>
                <Button onClick={() => reset()} disabled={isSubmitting}>
                  Làm mới
                </Button>
                <Button type="primary" htmlType="submit" loading={isSubmitting}>
                  {isSubmitting ? "Đang xử lý..." : "Tạo sản phẩm"}
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
      {/* </ConfigProvider> */}
    </>
  );
}
