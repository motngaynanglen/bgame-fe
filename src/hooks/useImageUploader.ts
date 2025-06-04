import uploadApiRequest from "@/src/apiRequests/upload";
import { RcFile } from "antd/es/upload";
import { message } from "antd";
import { useState } from "react";

export const useImageUploader = () => {
    const [uploading, setUploading] = useState(false);

    const uploadImages = async (files: RcFile[], returnType: "list" | "string") => {
        if (!files.length) {
            message.warning("Không có ảnh nào được chọn");
            return "";
        }
        const formData = new FormData();

        files.forEach(file => formData.append("files", file));

        try {
            setUploading(true);
            const res = await uploadApiRequest.uploadImage(formData);
            message.success("Upload hình ảnh thành công");
            if (returnType === "list") {
                return res.urls
            }
            return res.urls.join("||");

        } catch (error) {
            console.error("Upload image error:", error);
            message.error("Lỗi khi upload hình ảnh");
            return "";
        } finally {
            setUploading(false);
        }
    };

    return { uploadImages, uploading };
};
