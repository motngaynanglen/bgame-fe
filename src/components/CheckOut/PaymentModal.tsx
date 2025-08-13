"use client";
import React, { useState } from "react";
import { Modal } from "antd";
import PaymentFlow from "./PaymentFlow";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  referenceID: string;
  type: number;
  token?: string;
}

export default function PaymentModal({ open, onClose, referenceID, type, token }: PaymentModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Thanh toán đơn hàng"
      width={600}
    >
      <PaymentFlow
        referenceID={referenceID}
        type={type}
        token={token}
        onSuccess={onClose}
      />
    </Modal>
  );
}
