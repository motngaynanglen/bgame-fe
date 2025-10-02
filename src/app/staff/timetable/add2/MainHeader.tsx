'use client';

import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { CoffeeOutlined, ShopOutlined, CheckSquareOutlined, DollarOutlined, MenuOutlined } from '@ant-design/icons';

const { Header } = Layout;

interface MainHeaderProps {
    onOpenProductDrawer: () => void;
    onFocusSplitter: () => void;
}

export default function MainHeader({ onOpenProductDrawer, onFocusSplitter }: MainHeaderProps) {
    return (
        <Header style={{ background: '#222831', padding: '0 24px', display: 'flex', alignItems: 'center' }}>

            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['1']}
                style={{ flex: 1, minWidth: 0 }}
                items={[
                    {
                        key: '1',
                        icon: <ShopOutlined />,
                        label: 'Quản lý bàn',
                    },
                    {
                        key: '2',
                        icon: <CheckSquareOutlined />,
                        label: 'Đơn hàng',
                    },
                    {
                        key: '3',
                        icon: <DollarOutlined />,
                        label: 'Doanh thu',
                    },
                    
                ]}
            />
            <Button className='h-full rounded-none' icon={<MenuOutlined />} onClick={onFocusSplitter} />

        </Header>
    );
}