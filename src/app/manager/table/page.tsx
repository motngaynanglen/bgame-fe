"use client";
import { HomeOutlined } from "@ant-design/icons";
import { Button, Col, Row, Space, Table, TableProps, Tag } from "antd";
import Breadcrumb, { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import React, { Suspense, useState } from "react";
import { GiTabletopPlayers } from "react-icons/gi";
import SearchBar from "@/src/components/admin/table/search";
import { CreateButton } from "@/src/components/admin/Button";
import { TableSkeleton } from "@/src/components/admin/layout/skeletons";
import { useAppContext } from "../../app-provider";
import { PagingResType } from "@/src/schemaValidations/common.schema";
import AntdCustomPagination from "@/src/components/admin/table/pagination";
import { useQuery } from "@tanstack/react-query";
import bookListApiRequest from "@/src/apiRequests/bookList";

interface DataType {
  id: string;
  storeId: string;
  name: string;
  capacity: number;
  status: string;
  createdAt: string;
  createdBy: string;
  updatedBy: string;
  updatedAt: string;
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Bàn",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Số lượng người",
    dataIndex: "capacity",
    key: "capacity",
  },

  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <>
        <Row gutter={[12, 12]}>
          <Col span={12}>
            <Button color="blue" variant="filled">
              Edit
            </Button>
          </Col>
          <Col span={12} className="flex justify-center">
            {(() => {
              switch (record.status) {
                case "ACTIVE":
                  return (
                    <Button color="red" variant="filled">
                      DEACTIVE
                    </Button>
                  );
                case "DEACTIVE":
                  return (
                    <Space className="flex justify-between">
                      <Button color="yellow" variant="filled">
                        ACTIVE
                      </Button>
                    </Space>
                  );
                default:
                  return null;
              }
            })()}
          </Col>
        </Row>
      </>
    ),
  },
];

const createUrl: string = "/manager/table" + "/" + "create";

const breadcrumb: BreadcrumbItemType[] = [
  {
    href: "/admin",
    title: <HomeOutlined />,
  },
  {
    // href: baseUrl,
    title: (
      <>
        <GiTabletopPlayers />
        <span>Tabletop List</span>
      </>
    ),
  },
];

export default function ManagerTabletop({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const [tabletop, setTabletop] = useState<DataType[] | undefined>(undefined);
  const [paging, setPaging] = useState<PagingResType | undefined>(undefined);
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const { user } = useAppContext();

  const { data } = useQuery<DataType[]>({
    queryKey: ["tabletop", searchParams?.query, searchParams?.page],
    queryFn: async () => {
      const res = await bookListApiRequest.getListStoreTable({
        storeId: null,
        // paging: {
        //   pageNum: searchParams?.page ? parseInt(searchParams.page) : 1,
        //   pageSize: 10,
        // },
      });
      return res;
      
    },
  });
  return (
    <div>
      <Breadcrumb items={breadcrumb} className="pb-4" />
      <Row gutter={[16, 16]}>
        <Col flex={"auto"}>
          <Suspense>
            <SearchBar placeholder={"searching something..."} />
          </Suspense>
        </Col>
        <Col flex={"150px"}>
          <CreateButton link={createUrl} title="add" />
        </Col>
      </Row>
      <br />
      {data === undefined ? (
        <TableSkeleton />
      ) : (
        <>
          <Table<DataType>
            columns={columns}
            dataSource={data ?? []}
            pagination={false}
            loading={tableLoading}
          />
          <br />
          <AntdCustomPagination totalPages={paging?.paging.pageCount ?? 1} />
        </>
      )}
    </div>
  );
}
