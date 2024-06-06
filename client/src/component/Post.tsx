import {Fragment} from "react";
import {Link} from "react-router-dom";
import useProfile from "../features/useProfile.ts";

const Post = () => {
    const {query} = useProfile();
    console.log(query?.data.user.name)
    return <Fragment>
        <Link to={'/posts/testing'}>Testing</Link>
        posts my boss
    </Fragment>;
}
export default Post;