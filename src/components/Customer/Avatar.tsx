import uploadApiRequest from "@/src/apiRequests/upload";
import { useAppContext } from "@/src/app/app-provider";
import { UploadOutlined } from "@ant-design/icons";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { Button, message, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { useState } from "react";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export default function Avatar() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { user } = useAppContext(); // Lấy thông tin user từ context


  const handleAutoUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("files", file);

    try {
      const response = await uploadApiRequest.uploadImage(formData, user?.token);
      setImageUrl(response.urls[0]);
      message.success("Tải lên hình ảnh thành công.");
    } catch (error) {
      console.error("Upload failed:", error);
      message.error("Tải lên hình ảnh thất bại.");
    }
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const props: UploadProps = {
    name: "file",
    accept: "image/*",
    showUploadList: false,
    customRequest: async ({ file, onSuccess }) => {
      await handleAutoUpload(file as File);
      onSuccess?.("ok");
    },
    onPreview,
  };

  return (
    <div className="flex flex-col items-center  p-4 rounded-lg shadow-md">
      <img
        alt="User avatar"
        className="w-40 h-40 rounded-full m-5 bg-slate-500 "
        height="50"
        src={imageUrl || "/assets/images/tqs.jpg"} // Nếu không có imageUrl thì sử dụng ảnh mặc định
        width="50"
      />
      <ImgCrop rotationSlider>
        <Upload {...props} >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </ImgCrop>

    </div>
  );
}
