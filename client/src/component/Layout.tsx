import {Outlet} from "react-router-dom";
import {Toaster} from 'sonner'
import Header from "./Header.tsx";

const Layout = () => {
    return <main>
        <Toaster richColors closeButton={true}/>
        <Header/>
        <div className={'mt-20'}>
            <Outlet/>
        </div>
    </main>
}
export default Layout