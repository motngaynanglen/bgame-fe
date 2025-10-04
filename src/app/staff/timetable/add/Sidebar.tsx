'use client';

import React from 'react';
import { Layout, Menu } from 'antd';
import { CoffeeOutlined, ShopOutlined, CheckSquareOutlined, DollarOutlined } from '@ant-design/icons';

const { Sider } = Layout;

export default function Sidebar() {
  return (
    <Sider breakpoint="lg" collapsedWidth="0" theme="dark">
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['1']}
        items={[
          {
            key: '1',
            icon: <ShopOutlined />,
            label: 'Quản lý bàn',
          },
          {
            key: '2',
            icon: <CoffeeOutlined />,
            label: 'Menu',
          },
          {
            key: '3',
            icon: <CheckSquareOutlined />,
            label: 'Đơn hàng',
          },
          {
            key: '4',
            icon: <DollarOutlined />,
            label: 'Doanh thu',
          },
        ]}
      />
    </Sider>
  );
}