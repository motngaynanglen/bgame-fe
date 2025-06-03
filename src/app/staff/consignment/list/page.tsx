"use client";
import consignmentApiRequest from "@/src/apiRequests/consignment";
import productApiRequest from "@/src/apiRequests/product";
import { useAppContext } from "@/src/app/app-provider";
import AntdCustomPagination from "@/src/components/admin/table/pagination";
import SearchBar from "@/src/components/admin/table/search";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import type { CollapseProps, TableProps } from "antd";
import {
  Breadcrumb,
  Button,
  Col,
  Collapse,
  message,
  Row,
  Space,
  Table,
} from "antd";
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import { Suspense, useEffect, useState } from "react";

const role: string = "staff";
const baseUrl: string = "/" + role + "/consignment" + "/product";
const manageUrl = (id: string): string => `${baseUrl}/${id}`;
interface DataType {
  key: string;
  id: string;
  product_name: string;
  description: string;
  condition: number;
  missing: string;
  expected_price: number;
  sale_price: number;
  images: string;
  status: string;
}
interface PagingType {
  pageNum: number;
  pageSize: number;
  pageCount: number;
}
const columns: TableProps<DataType>["columns"] = [
  {
    title: "Tên sản phẩm",
    dataIndex: "product_name",
    key: "product_name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Giá bán",
    dataIndex: "sale_price",
    key: "sale_price",
    render: (text) => (
      <span>
        {text.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}
      </span>
    ),
  },
  {
    title: "Hiện trạng",
    dataIndex: "condition",
    key: "condition",
    render: (text) => {
      switch (text) {
        case 0:
          return <span>New in Shrink</span>;
        case 1:
          return <span>Chưa qua sử dụng</span>;
        case 2:
          return <span>Đã qua sử dụng</span>;
        case 3:
          return <span>Tốt</span>;
        case 4:
          return <span>Khá</span>;  
        case 5:
          return <span>Kém</span>;
        default:
          return <span>Không xác định</span>;
      }
    },
  },
  {
    title: "trạng thái",
    dataIndex: "status",
    key: "status",
  },
  // {
  //     title: 'Tags',
  //     key: 'tags',
  //     dataIndex: 'tags',
  //     render: (_, { tags }) => (
  //         <>
  //             {tags.map((tag) => {
  //                 let color = tag.length > 5 ? 'geekblue' : 'green';
  //                 if (tag === 'loser') {
  //                     color = 'volcano';
  //                 }
  //                 return (
  //                     <Tag color={color} key={tag}>
  //                         {tag.toUpperCase()}
  //                     </Tag>
  //                 );
  //             })}
  //         </>
  //     ),
  // },
  {
    title: "",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <Button type="link" href={manageUrl(record.id)}>
          Manage
        </Button>
        <a>Delete</a>
      </Space>
    ),
  },
];

const breadcrumb: BreadcrumbItemType[] = [
  {
    href: "/manager",
    title: <HomeOutlined />,
  },
  {
    // href: baseUrl,
    title: (
      <>
        <UserOutlined />
        <span>Board Game List</span>
      </>
    ),
  },
];

const AddButtons: CollapseProps["items"] = [
  {
    key: "1",
    label: <p className="p-0 m-0">Bổ xung sản phẩm mới</p>,
    children: (
      <>
        <Row gutter={[12, 12]}>
          <Col>
            <Button>Thêm mới sản phẩm chưa có sẵn</Button>
          </Col>
          <Col>
            <Button>Thêm mới chỉ là sản phẩm mẫu (0 số lượng)</Button>
          </Col>
          <Col>
            <Button>Bổ sung số lượng sản phẩm theo mẫu có sẵn</Button>
          </Col>
        </Row>
      </>
    ),
  },
];

export default function List({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string };
}) {
  const [useData, setData] = useState<DataType[] | undefined>(undefined);
  const [paging, setPaging] = useState<PagingType | undefined>(undefined);
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const { user } = useAppContext();

  const apiBody = {
    paging: {
      pageNum: 1,
      pageSize: 20,
    },
  };

  const fetchTableData = async () => {
    setTableLoading(true);
    if (!user) {
      message.error("Bạn cần đăng nhập để đặt trước.");
      setTableLoading(false);
      return;
    }
    try {
      const response = await consignmentApiRequest.getConsignmentList(
        apiBody,
        user.token
      );
      const data: DataType[] = response.data.map((item: DataType) => ({
        ...item,
        key: item.id, // Gán id vào key
      }));
      console.log(data);
      setPaging(response.paging);
      setTableLoading(false);
      return data;
    } catch (error) {
      setTableLoading(false);
    }
  };
  useEffect(() => {
    fetchTableData().then((result) => {
      setData(result);
    });
  }, [searchParams]);
  // useEffect(() => {
  //     const fetchData = () => {
  //         return new Promise<DataType[]>((resolve) => {
  //             setTimeout(() => {
  //                 resolve(data);
  //             }, 5000); // 3-second delay
  //         });
  //     };

  //     fetchData().then((result) => {
  //         setData(result);
  //     });
  // }, []);
  return (
    <>
      <Breadcrumb items={breadcrumb} className="pb-4" />

      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Suspense>
            <SearchBar placeholder={"Tìm kiếm theo mã sản phẩm..."} />
          </Suspense>
        </Col>
        <Col span={8}>
          <Collapse items={AddButtons}></Collapse>
        </Col>
      </Row>

      <br />
      <Table<DataType>
        loading={tableLoading}
        columns={columns}
        dataSource={useData}
        pagination={false}
      />
      <br />
      <AntdCustomPagination totalPages={paging?.pageCount ?? 1} />
      {/* {useData === undefined ? (
                  <TableSkeleton />
              ) : (
                  <>
                      <Table<DataType> loading={true} columns={columns} dataSource={useData} pagination={false} />
                      <br />
                      <AntdCustomPagination totalPages={20} />
                  </>
              )} */}
    </>
  );
}
