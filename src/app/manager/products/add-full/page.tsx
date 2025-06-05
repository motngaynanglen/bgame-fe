"use client";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Col, ConfigProvider, Row } from "antd";
import Breadcrumb, { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import ProductGroupFrom from "./ProductGroupForm";
import ProductGroupRefForm from "./ProductGroupRefForm";
import { useState } from "react";
import ProductForm from "./ProductForm";
import ProductAddFrom from "./ProducAddFrom";


const url = {
    home: "/manager",
    list: "/manager/products",
    create: "/manager/products/add-full",
}
const breadcrumb: BreadcrumbItemType[] =
    [
        {
            href: url.home,
            title: <HomeOutlined />,
        },
        {
            href: url.list,
            title: (
                <>
                    <UserOutlined />
                    <span>Danh sách sản phẩm</span>
                </>
            ),
        },
        {
            title: "Nhập BoardGame"
        },

    ];
export default function ManagerAddFull() {
    const [groupId, setGroupId] = useState<string>("");
    const [groupRefId, setGroupRefId] = useState<string>("");
    const [productTemplateId, setProductTemplateId] = useState<string>("");
    const handleGroupCreated = (newId: string) => {
        setGroupId(newId);
    };
    const handleGroupRefCreated = (newId: string) => {
        setGroupRefId(newId);
    }
    const handleProductTemplateCreated = (newId: string) => {
        setProductTemplateId(newId);
    }
    const pageTitle = () => {
        return (
            <div className="flex justify-between">
                <p>Tạo mới sản phẩm</p>

                {/* <Select className="w-75" options={items} onChange={(value) => onChange(value)}
                    menuItemSelectedIcon={<CiSettings />}
                    defaultValue={0} /> */}

            </div>
        )
    }

    return (
        <>
            <Breadcrumb items={breadcrumb} />
            <ConfigProvider prefixCls="form-ant">


                <Card title={pageTitle()}>
                    <Row gutter={[12, 12]} className="mb-4">
                        <Col span={12} className="mb-4">
                            <ProductGroupFrom onGroupCreated={handleGroupCreated} />
                        </Col>
                        <Col span={12} className="mb-4">
                            <ProductGroupRefForm groupId={groupId} onGroupRefCreated={handleGroupRefCreated} />
                        </Col>
                        <Col span={24} className="mb-4">
                            <ProductForm productGroupRefId={groupRefId} onProductTemplateCreated={handleProductTemplateCreated} />
                        </Col>
                        <Col span={24} className="mb-4">
                            <ProductAddFrom productTemplateId={productTemplateId} />
                        </Col>
                    </Row>


                    {/* {step == 1 && (
                        <AddProductTemplate onNext={handleNext} />
                    )}
                    {step == 2 && createdProduct && (

                        <ProductAddNumberForm
                            productModel={createdProduct}
                        />
                    )}
                    <ProgressBar step={step} totalSteps={2} /> */}
                </Card>
            </ConfigProvider>
        </>
    );
}