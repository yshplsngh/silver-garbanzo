import {Fragment} from "react";
import {Outlet} from "react-router-dom";
import {Toaster} from 'sonner'
const Layout = () => {
    return (
        <Fragment>
            <Outlet/>
            <Toaster richColors closeButton={true}/>
        </Fragment>
    )
}
export default Layout