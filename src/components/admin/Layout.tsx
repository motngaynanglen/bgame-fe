'use client'
// import node module libraries
import { Suspense, useState } from 'react';

import NavbarVertical from './layout/NavbarVertical';
import NavbarTop from './layout/NavbarTop';

import { DashboardRouter } from '@/src/routers/route.schema';
import { Layout } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
// import { useMediaQuery } from 'react-responsive';
import Sider from 'antd/es/layout/Sider';
import AdminLoading from '@/src/app/admin/loading';

export default function DashboardLayout({ children, menu }: { children: React.ReactNode, menu: DashboardRouter }) {
	const [showMenu, setShowMenu] = useState(true);
	const ToggleMenu = () => {
		return setShowMenu(!showMenu);
	};
	// const isMobile = useMediaQuery({ maxWidth: 767 });
	return (
		<>
			{/* <!-- ===== Page Wrapper Start ===== --> */}
			<Layout className='min-h-screen'>
				{/* <!-- ===== Sidebar Start ===== --> */}
				<Suspense fallback={<AdminLoading />}>
					<Sider collapsedWidth={0} collapsible collapsed={!showMenu} width={"16.125rem"} trigger={null}>

						<NavbarVertical sidebarOpen={showMenu}
							setSidebarOpen={(value: boolean) => setShowMenu(value)}
							menu={menu} />

					</Sider>
				</Suspense>
				{/* <!-- ===== Sidebar End ===== --> */}
				<Layout>
					<Header className='p-0 bg-white'>
						{/* <!-- ===== Header Start ===== --> */}
						<NavbarTop sidebarOpen={showMenu} setSidebarOpen={ToggleMenu} />
						{/* <!-- ===== Header End ===== --> */}
					</Header>
					{/* <!-- ===== Content Area Start ===== --> */}
					<Content>
						{/* <!-- ===== Main Content Start ===== --> */}

						<div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
							{children}
						</div>

						{/* <!-- ===== Main Content End ===== --> */}
					</Content>
					<Footer>
						contact to bachdoan, Copyright with antd
					</Footer>
					{/* <!-- ===== Content Area End ===== --> */}

				</Layout>
			</Layout>
			{/* <!-- ===== Page Wrapper End ===== --> */}

		</>
	)
}
