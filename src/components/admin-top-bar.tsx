import {Link, useLocation} from "react-router-dom";

function AdminTopBar() {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <>
            <div className={"p-6 pe-20 bg-primary flex justify-between flex-col sm:flex-row items-start sm:items-center font-extrabold  text-xl"}>
                <Link to={"/"} className={"font-extrabold text-2xl mb-4 sm:m-0"}>UBERT</Link>
                <Link to={"/admin"}
                      className={`${currentPath === '/admin' ? 'bg-secondary p-2 rounded' : 'hover:underline'} `}>Dashboard</Link>
                <Link to={"/admin/drivers"}
                      className={`${currentPath === '/admin/drivers' ? 'bg-secondary p-2 rounded' : 'hover:underline'} `}>Drivers</Link>
                <Link to={"/admin/users"}
                      className={`${currentPath === '/admin/users' ? 'bg-secondary p-2 rounded' : 'hover:underline'} `}>Users</Link>
                <Link to={"/"}
                      className={`${currentPath === '/' ? 'bg-secondary p-2 rounded' : 'hover:underline'}`}>Home</Link>
            </div>
        </>
    );
}

export default AdminTopBar;
