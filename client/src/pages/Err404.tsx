import "../assets/project.css"

const Err404 = () => {
    return (
        <div className="not-found-container">
            <h1 className={'text-4xl font-semibold'}>404 Page Not Found</h1>
            <div className="content">
                <div className={'text-lg'}>
                    <h2>HYDRA has stolen this page from S.H.I.E.L.D. database</h2>
                    <p>
                        Check that you typed the address correctly, go back to your previous page.
                    </p>
                </div>
                <div className="error-image-animate"></div>
            </div>
        </div>
    );
};

export default Err404;
