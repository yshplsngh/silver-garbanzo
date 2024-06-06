import useProfile from "../features/useProfile.ts";

const Testing= () => {
    const {query} = useProfile();
    console.log(query?.data.user.name)
    return <h1>Testing</h1>
}
export default Testing;

