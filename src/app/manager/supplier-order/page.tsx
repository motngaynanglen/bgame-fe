"use client";
import supplierApiRequest from "@/src/apiRequests/supplier";
import { CreateButton } from "@/src/components/admin/Button";
import { TableSkeleton } from "@/src/components/admin/layout/skeletons";
import SearchBar from "@/src/components/admin/table/search";
import { PagingResType } from "@/src/schemaValidations/common.schema";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Col, message, Row, Table, TableProps } from "antd";
import Breadcrumb, { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useAppContext } from "../../app-provider";

const role: string = "manager";
const baseUrl: string = "/" + role + "/" + "supplier-order";
const createUrl: string = baseUrl + "/" + "create";

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
        <span>Nhà cung cấp</span>
      </>
    ),
  },
];

interface DataType {
  id: string;
  key: string;
  code: string;
  supplier_name: string;
  title: string;
  total_item: number;
  total_price: number;
  status: string;
}
const columns: TableProps<DataType>["columns"] = [
  //   {
  //     title: "Mã",
  //     dataIndex: "code",
  //     key: "code",
  //   },
  {
    title: "Tên nhà cung cấp",
    dataIndex: "supplier_name",
    key: "supplier_name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Đơn hàng",
    dataIndex: "title",
    key: "title",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Tổng số mặt hàng",
    dataIndex: "total_item",
    key: "total_item",
    render: (text) => (
      <span className="overflow-hidden text-ellipsis truncate">{text}</span>
    ),
  },
  {
    title: "Tổng tiền",
    dataIndex: "total_price",
    key: "total_price",
    render: (text) => (
      <span className="overflow-hidden text-ellipsis truncate">{text}</span>
    ),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    // render: (text) => <a>{text}</a>,
  },
];

export default function ManagerSupplier({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const [useData, setData] = useState<DataType[] | undefined>(undefined);
  const [paging, setPaging] = useState<PagingResType | undefined>(undefined);
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const { user } = useAppContext();
  const router = useRouter();

  const apiBody = {
    // search: searchParams?.query ?? "",
    // filter: ["string"],
    paging: {
      pageNum: searchParams?.page ? parseInt(searchParams.page) : 1,
      pageSize: 5,
    },
  };
  const fetchTableData = async () => {
    setTableLoading(true);
    try {
      const response = await supplierApiRequest.getSuppilerOrder(
        apiBody,
        user?.token
      );
      const data: DataType[] = response.data.map((item: DataType) => ({
        ...item,
        key: item.id, // Gán id vào key
      }));
      console.log(data);
      setPaging(response.paging);

      return data;
    } catch (error) {
      message.error(error as string);
    } finally {
      setTableLoading(false);
    }
  };
  useEffect(() => {
    fetchTableData().then((result) => {
      setData(result);
    });
  }, [searchParams]);
  return (
    <>
      <Breadcrumb items={breadcrumb} className="pb-4" />
      <Row gutter={[16, 16]}>
        <Col flex={"auto"}>
          <Suspense>
            <SearchBar placeholder={"searching something..."} />
          </Suspense>
        </Col>
        <Col flex={"150px"}>
          <CreateButton link={createUrl} title="Add" />
        </Col>
      </Row>
      <br />
      {useData === undefined ? (
        <TableSkeleton />
      ) : (
        <>
          <Table<DataType>
            columns={columns}
            dataSource={useData ?? []}
            pagination={false}
            loading={tableLoading}
            onRow={(record) => {
              return {
                onClick: () => {
                  router.push(`/manager/supplier-order/${record.id}`);
                },
              };
            }}
          />
          <br />
          {/* <AntdCustomPagination totalPages={paging?.paging.pageCount ?? 1} /> */}
        </>
      )}
    </>
  );
}
