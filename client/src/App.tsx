import {Route, Routes} from "react-router-dom";
import Register from "./component/Register.tsx";
import RequireAuth from "./component/RequireAuth.tsx";
import Post from "./component/Post.tsx";
import Layout from "./component/Layout.tsx";
import Err404 from "./component/Err404.tsx";

function App() {
    return <Routes>
        <Route path={'/'} element={<Layout/>}>
            <Route index element=<Register/>/>
            <Route path='/posts' element=<RequireAuth/>>
                <Route index element=<Post/>/>
            </Route>
            <Route path={'*'} element={<Err404/>}/>
        </Route>
    </Routes>
}

export default App
