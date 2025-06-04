
'use client'

import { Col, Row, Tag } from "antd";
import CategoriesTable from "./CategoriesTable";
import AddCategoriesForm from "./AddCategoriesForm";
import { useWarnOnUnload } from "@/src/hooks/navigation/useWarnOnUnload";
import { useWarnOnRouteChange } from "@/src/hooks/navigation/useWarnOnRouteChange";
import { useCallback, useState } from "react";
import { useNavigationWarning } from "@/src/hooks/navigation/useNavigationWarning";
import ConfirmNavigationModal from "@/src/components/Modal/ConfirmNavigationModal";


export default function CategoriesPage() {
    const [pendingItems, setPendingItems] = useState<string[]>([])
    const onChangeItem = useCallback((item: string[]) => {
        setPendingItems(item);
    }, []);
    const shouldWarn = pendingItems.length > 0;
    useWarnOnUnload({
        shouldWarn,
        message: "Bạn có chắc chắn muốn rời khỏi? Danh sách chưa được gửi sẽ bị hủy."
    });
    // const warningMessage = "Bạn có thay đổi chưa lưu. Bạn có chắc muốn rời khỏi trang?";

    // const { confirmAndNavigate, showModal, handleConfirmNavigation, handleCancelNavigation } = useNavigationWarning({
    //     shouldWarn: shouldWarn,
    //     message: warningMessage
    // });
    // useWarnOnRouteChange(shouldWarn);
    return (
        <>
            <p>
                {shouldWarn + " wtf đâu mất r"}
            </p>
            <Row>

                <Col span={16}>
                    <CategoriesTable />
                </Col>
                <Col span={8}>
                    <AddCategoriesForm onChangeItem={onChangeItem} />
                </Col>
            </Row>
            {/* <ConfirmNavigationModal
                isOpen={showModal}
                message={warningMessage}
                onConfirm={handleConfirmNavigation}
                onCancel={handleCancelNavigation}
            /> */}
        </>
    );
}