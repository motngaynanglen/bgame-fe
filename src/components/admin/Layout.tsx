'use client'
// import node module libraries
import { useState } from 'react';

import NavbarVertical from './layout/NavbarVertical';
import NavbarTop from './layout/NavbarTop';

import { DashboardRouter } from '@/src/routers/route.schema';

export default function DashboardLayout({ children, menu }: { children: React.ReactNode, menu:DashboardRouter }) {
	const [showMenu, setShowMenu] = useState(true);
	const ToggleMenu = () => {
		return setShowMenu(!showMenu);
	};

	return (
		<>
		
			{/* <!-- ===== Page Wrapper Start ===== --> */}
			<div className="flex">
				{/* <!-- ===== Sidebar Start ===== --> */}
				<NavbarVertical showMenu={showMenu}
					onClick={(value: any) => setShowMenu(value)}
					menu={menu} />
				{/* <!-- ===== Sidebar End ===== --> */}

				{/* <!-- ===== Content Area Start ===== --> */}
				<div className="relative flex flex-1 flex-col lg:ml-72.5">
					{/* <!-- ===== Header Start ===== --> */}
					{/* <NavbarTop sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
					{/* <!-- ===== Header End ===== --> */}

					{/* <!-- ===== Main Content Start ===== --> */}
					<main>
						<div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
							{children}
						</div>
					</main>
					{/* <!-- ===== Main Content End ===== --> */}
				</div>
				{/* <!-- ===== Content Area End ===== --> */}
			</div>
			{/* <!-- ===== Page Wrapper End ===== --> */}
		</>
		// <div id="db-wrapper" className={`${showMenu ? '' : 'toggled'}`}>
		// 	<div className="navbar-vertical navbar">
		// 		<NavbarVertical
		// 			showMenu={showMenu}
		// 			onClick={(value: any) => setShowMenu(value)}
		// 			menu={menu}
		// 		/>
		// 	</div>
		// 	<div id="page-content" className=' bg-light'>
		// 		<div className="header">
		// 			<NavbarTop
		// 				data={{
		// 					showMenu: showMenu,
		// 					SidebarToggleMenu: ToggleMenu
		// 				}}
		// 			/>
		// 		</div>

		// 		{children}


		// 	</div>
		// </div>
	)
}
