'use client'
// import node module libraries
import { useState } from 'react';

import NavbarVertical from './layout/NavbarVertical';
import NavbarTop from './layout/NavbarTop';

import { DashboardRouter } from '@/src/routers/route.schema';
import clsx from 'clsx';
import { Layout } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';

export default function DashboardLayout({ children, menu }: { children: React.ReactNode, menu: DashboardRouter }) {
	const [showMenu, setShowMenu] = useState(true);
	const ToggleMenu = () => {
		return setShowMenu(!showMenu);
	};

	return (
		<>
			{/* <!-- ===== Page Wrapper Start ===== --> */}
			<Layout>
					
				{/* <!-- ===== Sidebar Start ===== --> */}
				<NavbarVertical showMenu={showMenu}
					onClick={(value: any) => setShowMenu(value)}
					menu={menu} />
				{/* <!-- ===== Sidebar End ===== --> */}

				{/* <!-- ===== Content Area Start ===== --> */}
				<Content>
					{/* <!-- ===== Header Start ===== --> */}
					<NavbarTop sidebarOpen={showMenu} setSidebarOpen={ToggleMenu} />
					{/* <!-- ===== Header End ===== --> */}

					{/* <!-- ===== Main Content Start ===== --> */}
					<main>
						<div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
							{children}
						</div>
					</main>
					{/* <!-- ===== Main Content End ===== --> */}
					</Content>
				{/* <!-- ===== Content Area End ===== --> */}
			

			</Layout>
			{/* <!-- ===== Page Wrapper End ===== --> */}

		</>
	)
}
