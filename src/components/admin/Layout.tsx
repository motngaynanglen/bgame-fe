'use client'
// import node module libraries
import { useState } from 'react';

import NavbarVertical from './layout/NavbarVertical';
import NavbarTop from './layout/NavbarTop';
import '@/src/styles/layout/admin.css'
import { DashboardRouter } from '@/src/routers/route.schema';
import { ConfigProvider, Layout } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
// import { useMediaQuery } from 'react-responsive';
import Sider from 'antd/es/layout/Sider';

export default function DashboardLayout({ children, menu, theme }: { children: React.ReactNode, menu: DashboardRouter, theme?: "light" | "dark" }) {
	const [showMenu, setShowMenu] = useState(true);
	const ToggleMenu = () => {
		return setShowMenu(!showMenu);
	};
	// const isMobile = useMediaQuery({ maxWidth: 767 });
	return (
		<>
			{/* <!-- ===== Page Wrapper Start ===== --> */}
			<ConfigProvider prefixCls="my-ant">
				<Layout style={{minHeight:"100vh"}}>
					{/* <!-- ===== Sidebar Start ===== --> */}
					<Sider collapsedWidth={0} collapsible collapsed={!showMenu} width={"16.125rem"} trigger={null}>

						<NavbarVertical
							sidebarOpen={showMenu}
							setSidebarOpen={(value: boolean) => setShowMenu(value)}
							menu={menu} theme={theme === "light" ? "light" : "dark"} />

					</Sider>
					{/* <!-- ===== Sidebar End ===== --> */}
					<Layout>
						<Header>
							{/* <!-- ===== Header Start ===== --> */}
							<NavbarTop sidebarOpen={showMenu} setSidebarOpen={ToggleMenu} />
							{/* <!-- ===== Header End ===== --> */}
						</Header>
						{/* <!-- ===== Content Area Start ===== --> */}
						<Content>
							{/* <!-- ===== Main Content Start ===== --> */}

							<div className="mx-auto max-w-screen-2xl px-4 py-4 md:px-6 2xl:px-10 ">
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
			</ConfigProvider>
			{/* <!-- ===== Page Wrapper End ===== --> */}

		</>
	)
}
