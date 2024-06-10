import {Outlet} from "react-router-dom";
import {Toaster} from 'sonner'
import Header from "./Header.tsx";

const Layout = () => {
    return <main>
        <Toaster richColors closeButton={true}/>
        <Header/>
        <Outlet/>
    </main>
}
export default Layout