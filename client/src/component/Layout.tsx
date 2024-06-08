import {Outlet} from "react-router-dom";
import {Toaster} from 'sonner'

const Layout = () => {
    return <div>
        <Toaster richColors closeButton={true}/>
        <Outlet/>
    </div>
}
export default Layout