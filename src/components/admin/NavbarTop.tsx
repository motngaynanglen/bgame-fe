// import node module libraries
import { Menu } from 'react-feather'; //Icon
import Link from 'next/link';

// import sub components
import QuickMenu from './QuickMenu';

interface NavbarTopProps {
	data: {
		showMenu: boolean;
		SidebarToggleMenu: (state: boolean) => void	
	};
}

function NavbarTop(props: NavbarTopProps) {
	return (
		<nav className="navbar-classic navbar navbar-expand-lg">
			<div className='d-flex justify-content-between w-100'>
				<div className="d-flex align-items-center">
					<Link
						href="#"
						id="nav-toggle"
						className="nav-icon me-2 icon-xs"
						onClick={() => props.data.SidebarToggleMenu(!props.data.showMenu)}>
						<Menu size="18px" />
					</Link>
					<div className="ms-lg-3 d-none d-md-none d-lg-block">

					</div>
				</div>
				<nav className="navbar-right-wrap ms-2 d-flex nav-top-wrap">
					<QuickMenu />
				</nav>
			</div>
		</nav>
	);
};

export default NavbarTop;
