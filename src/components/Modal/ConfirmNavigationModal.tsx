'use client';

import { Modal, Button } from 'antd';

interface ConfirmNavigationModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmNavigationModal: React.FC<ConfirmNavigationModalProps> = ({ isOpen, message, onConfirm, onCancel }) => {
  return (
    <Modal
      title="Xác nhận rời trang"
      open={isOpen}
      onOk={onConfirm}
      onCancel={onCancel}
      maskClosable={false}
      closable={false}
      footer={[
        <Button key="back" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={onConfirm}>
          Tiếp tục
        </Button>,
      ]}
    >
      <p>{message}</p>
    </Modal>
  );
};

export default ConfirmNavigationModal;