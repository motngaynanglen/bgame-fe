'use client'
// import node module libraries
import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import { useMediaQuery } from 'react-responsive';
// import simple bar scrolling used for notification item scrolling
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

// import routes file
import clsx from 'clsx';
import { inter, lusitana } from '@/src/fonts/fonts';
import { DashboardRouter } from '@/src/routers/route.schema';
import SidebarItem from './SidebarItem';
import useLocalStorage from "@/src/hooks/useLocalStorage";
import { Menu } from 'antd';
import MenuItem from 'antd/es/menu/MenuItem';
import Image from 'next/image';
import ClickOutside from '../../ClickOutside';
import useMounted from '@/src/hooks/useMounted';
import Sider from 'antd/es/layout/Sider';
import { User } from 'react-feather';

interface SidebarProps {
	sidebarOpen: boolean;
	setSidebarOpen: (arg: boolean) => void;
}

function NavbarVertical({ showMenu, onClick, menu }: { showMenu: boolean; onClick: any; menu: DashboardRouter }) {
	const location = usePathname();
	const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
	// const [menuList, setList] = useState<DashboardMenuItem[]>();
	const menuList = menu.route;

	// const CustomToggle = ({ children, icon, collapseKey }) => {
	// 	return (
	// 		<li className="nav-item">
	// 			<Link
	// 				href="#"
	// 				className={clsx("nav-link", position === collapseKey ? "" : "collapsed")}
	// 				data-bs-toggle="collapse"
	// 				data-bs-target={collapseKey ? "#key" + collapseKey : "#navDashboard"}
	// 				aria-expanded={"false"}
	// 				aria-controls={collapseKey ? "key" + collapseKey : "navDashboard"}>
	// 				{icon ? <i className={`nav-icon fe fe-${icon} me-2`}></i> : ''}{' '}
	// 				{children}
	// 			</Link>
	// 		</li>
	// 	);
	// };
	// const CustomDropdown = ({ children, collapseKey }) => {
	// 	return (
	// 		<nav id={"key" + collapseKey} className={clsx("nav-item collapse", position === collapseKey ? "show" : "")}>
	// 			{children}
	// 		</nav>
	// 	);
	// }
	// const generateLink = (item, local) => {
	// 	return (
	// 		(<Link
	// 			href={item.link}
	// 			className={`nav-link ${location === item.link ? 'active' : ''
	// 				}`}
	// 			onClick={(e) => {
	// 				setPosition(local);
	// 				isMobile ? onClick(!showMenu) : showMenu
	// 			}
	// 			}>

	// 			{item.name}
	// 			{''}
	// 			{item.badge ? (
	// 				<span
	// 					className={item.badgecolor ? item.badgecolor : 'badge-primary' + " ms-1 badge"}

	// 				>
	// 					{item.badge}
	// 				</span>
	// 			) : (
	// 				''
	// 			)}

	// 		</Link>)
	// 	);
	// };

	const isMobile = useMediaQuery({ maxWidth: 767 });

	const isDesktop = useMediaQuery({
		query: '(min-width: 1224px)'
	})
	return (
		<>
			<Sider className='h-screen' collapsible collapsed={!showMenu} width={"16.125rem"}>
				<Menu
					theme="dark"
					mode="inline"
					defaultSelectedKeys={['1']}
					items={menu.route}
				/>
			</Sider>
			{/* <ClickOutside active={isMobile} onClick={() => {
				if (isMobile)
					onClick(false)
			}}> */}
			{/* <SimpleBar style={{ maxHeight: '100vh' }}> */}
			{/* <nav
					className={`fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark ${showMenu ? "translate-x-0" : "-translate-x-full"
						}`}
				> */}
			{/* <div className="flex items-center justify-center gap-2 px-6 py-5.5 lg:py-6.5">
						<div className="">
							<Link href={`/${menu.role}`} type='button' className="">
								<p className={clsx('text-xl font-black m-0 text-white', inter,)}>
									BGame
									<span className={clsx('text-xl font-black m-0 text-white', inter,)}>
										{" " + menu.role}
									</span>
								</p>

							</Link>
						</div>

						<button
							onClick={() => onClick(!showMenu)}
							aria-controls="sidebar"
							className="block lg:hidden"
						>
							<svg
								className="fill-current"
								width="20"
								height="18"
								viewBox="0 0 20 18"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
									fill=""
								/>
							</svg>
						</button>
					</div> */}

			{/* <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear"> */}
			{/* <!-- Sidebar Menu --> */}
			{/* <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
							{menuList?.map(function (group, groupIndex) {
								if (group.grouptitle) {

									return (
										<h3 key={group.id} className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
											{group.title}
										</h3>
									);
								} else {
									if (group.children) {
										return (
											<ul className="mb-2 flex flex-col gap-1.5" key={group.id}>
												<SidebarItem
													key={group.id}
													item={group}
													pageName={pageName}
													setPageName={setPageName}
												/>
											</ul>
										);
									} else {
										return (
											<ul className="mb-6 flex flex-col gap-1.5" key={group.id}>
												<SidebarItem
													key={group.id}
													item={group}
													pageName={pageName}
													setPageName={setPageName}
												/>
											</ul>
										);
									}
								}

							})}
						</nav> */}
			{/* <!-- Sidebar Menu --> */}
			{/* </div> */}
			{/* </nav> */}
			{/* </SimpleBar> */}
			{/* </ClickOutside> */}
		</>
	);
};

export default NavbarVertical;
