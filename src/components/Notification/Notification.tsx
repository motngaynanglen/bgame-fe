import { notification } from "antd";
import { NotificationPlacement } from "antd/es/notification/interface";
import { ReactNode } from "react";

export type NotificationType = "success" | "info" | "warning" | "error";

interface NotifyParams {
  type: NotificationType;
  message: string;
  description?: string | ReactNode;
  placement?: NotificationPlacement;
  duration?: number;
}

export const openNotification = ({
  type,
  message,
  description,
  placement = "bottomRight",
  duration = 2,
}: NotifyParams) => {
  notification[type]({
    message,
    description,
    placement,
    duration,
  });
};

export const notifySuccess = (msg: string, desc?: string) =>
  openNotification({ type: "success", message: msg, description: desc });

export const notifyError = (msg: string, desc?: string) =>
  openNotification({ type: "error", message: msg, description: desc });
