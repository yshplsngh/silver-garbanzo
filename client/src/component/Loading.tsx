import {SyncLoader} from "react-spinners";

interface styleTypo {
    [key: string]: string;
}

const Loading = () => {
    const loadingStyle: styleTypo = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "999",
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        // background: 'rgb(111,111,111,0.2)', // Here you choose the color and opacity that you want to apply
    };

    return (
        <div style={loadingStyle}>
            <SyncLoader color="#ffffff" speedMultiplier={0.7} margin={4}/>
        </div>
    );
}
export default Loading;