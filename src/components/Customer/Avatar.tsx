import React, { useState } from "react";
import { Button, message, Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import { UploadOutlined } from "@ant-design/icons";
import authApiRequest from "@/src/apiRequests/auth";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export default function Avatar() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSubmit = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    console.log("File selected:", file);

    // Tạo FormData và đảm bảo key là 'file'
    const formData = new FormData();
    formData.append("file", file); // API yêu cầu key là 'file'

    try {
      const response = await fetch("", {
        method: "POST",
        body: formData,
        headers: {
          // Không đặt Content-Type ở đây, để trình duyệt tự thêm boundary
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);
    } catch (error) {
      console.error("Upload failed:", error);
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
    showUploadList: false,
    action: "http://14.225.207.72/api/upload/image",

    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file.response.url);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} cập nhật thành công.`);
        setImageUrl(info.file.response.url);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} cập nhật thất bại.`);
      }
    },
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
        {/* <Upload>
          <input type="file" accept="image/*" onChange={handleFileSubmit} />
          {selectedFile && <p>Ảnh đã chọn: {selectedFile.name}</p>}
        </Upload> */}
        <Upload {...props} onPreview={onPreview}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </ImgCrop>
    </div>
  );
}
