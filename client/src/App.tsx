import {Route, Routes} from "react-router-dom";
import Register from "./pages/Register.tsx";
import RequireAuth from "./features/RequireAuth.tsx";
import Post from "./pages/Post.tsx";
import Layout from "./component/Layout.tsx";
import Err404 from "./pages/Err404.tsx";
import {Suspense} from "react";

function App() {
    return <Suspense fallback={<h1>Loading...</h1>}>
        <Routes>
            <Route path={'/'} element={<Layout/>}>
                <Route index element=<Register/>/>
                <Route path='posts' element=<RequireAuth/>>
                    <Route index element=<Post/>/>
                </Route>
                <Route path={'*'} element={<Err404/>}/>
            </Route>
        </Routes>
    </Suspense>
}

export default App
