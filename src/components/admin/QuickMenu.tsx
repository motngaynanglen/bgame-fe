// import node module libraries
import Link from 'next/link';
import { Fragment } from 'react';
import { useMediaQuery } from 'react-responsive';

// // simple bar scrolling used for notification item scrolling
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

// import data files
// import NotificationList from '@/src/data/Notification';

// import hooks
import useMounted from '@/src/hooks/useMounted';

function QuickMenu() {

    const hasMounted = useMounted();

    const isDesktop = useMediaQuery({
        query: '(min-width: 1224px)'
    })

    const Notifications = () => {
        return (
            <SimpleBar style={{ maxHeight: '300px', overflowX: 'hidden' }} autoHide={true}>
                <ul className="list-group list-group-flush">
                    {/* {NotificationList.map(function (item, index) {
                        return (
                            <li className={"list-group-item " + (index === 0 ? 'bg-light' : '')} key={index}>
                                <Link href="#" className="text-muted">
                                    <h5 className=" mb-1">{item.sender}</h5>
                                    <p className="mb-0"
                                        style={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap"
                                        }}>
                                        {item.message}
                                    </p>
                                </Link>
                            </li>
                        );
                    })} */}
                </ul>
            </SimpleBar >
        );
    }

    function QuickMenuDesktop() {
        return (
            <div className=" navbar-nav navbar-right-wrap ms-auto d-flex nav-top-wrap" >
                <div className=" stopevent" role="presentation">
                    <span className="dropdown">
                        <button id="dropdownNotification" className="btn btn-light btn-icon rounded-circle indicator indicator-primary text-muted" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="fe fe-bell"></i>
                        </button>
                        <div className="dashboard-dropdown notifications-dropdown dropdown-menu dropdown-menu-lg dropdown-menu-end py-0 show" aria-labelledby="dropdownNotification">
                            <div className="dropdown-item mt-3" role="presentation">
                                <span className="border-bottom px-3 pt-0 pb-3 d-flex justify-content-between align-items-end">
                                    <span className="h4 mb-0">Notifications</span>
                                    <Link href="/" className="text-muted">
                                        <span className="align-middle">
                                            <i className="fe fe-settings me-1"></i>
                                        </span>
                                    </Link>
                                </span>
                                <Notifications />
                                <span className="border-top px-3 pt-3 pb-3">
                                    <a href="/dashboard/notification-history" className="text-link fw-semi-bold">See all Notifications</a>
                                </span>
                            </div>
                        </div>
                    </span>
                </div>
                <div className="ms-2" role="presentation">
                    <div className="dropdown" >
                        <button id="dropdownUser" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ borderRadius: "50%" }}>
                            <img alt="avatar" src='/assets/images/blog/blog-author.png' className="rounded-circle avatar avatar-md avatar-indicators avatar-online" />
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownUser" hidden={false} >
                            <li className="dropdown-item px-4 pb-0 pt-2" role="presentation">
                                <span className="lh-1">
                                    <h5 className="mb-1"> John E. Grainger</h5>
                                    <Link href="#" className="text-inherit fs-6">View my profile</Link>
                                </span>
                                <span className="dropdown-spanider mt-3 mb-2"></span>
                            </li>
                            <li className="dropdown-item"><i className="fe fe-user me-2"></i> Edit Profile</li>
                            <li className="dropdown-item"><i className="fe fe-activity me-2"></i> Activity Log</li>
                            <li className="dropdown-item text-primary"><i className="fe fe-star me-2"></i> Go Pro</li>
                            <li className="dropdown-item"><i className="fe fe-settings me-2"></i> Account Settings</li>
                            <li className="dropdown-item"><i className="fe fe-power me-2"></i><Link href='/logout'>Sign Out</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }

    function QuickMenuMobile() {
        return (
            <>
                {/* not yet support */}
            </>
        )
    }

    return (

        <Fragment>
            {hasMounted && isDesktop ? <QuickMenuDesktop /> : <QuickMenuMobile />}
        </Fragment>
    );
    // return (
    //     <Fragment>
    //         { hasMounted && isDesktop ? <QuickMenuDesktop /> : <QuickMenuMobile />}
    //     </Fragment>
    // )
}

export default QuickMenu;