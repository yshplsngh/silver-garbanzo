import Button from "../component/Button.tsx";
import {Link} from "react-router-dom";

const Home = () => {
    return (
        <section className={'h-[88vh]'}>
            <div className={'flex h-full'}>
                <div className={'op w-2/3 flex flex-col justify-center items-center'}>
                    <div className={'op pl- space-y-10'}>
                        <div className={'text-9xl font-gama tracking-tighter'}>
                            <div className={''}>Human</div>
                            <div className={''}>stories & ideas</div>
                        </div>
                        <div className={'font-default text-xl font-medium'}>A place to read, write, and deepen your
                            understanding
                        </div>
                        <div>
                            <Link to={'/posts'}>
                                <Button variant={"primary"} text={"Start Reading"}
                                        className={'w-48 h-12 text-xl font-medium rounded-full'}/>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className={'op flex items-center justify-end w-1/3'}>
                    <img
                         src="https://miro.medium.com/v2/format:webp/4*SdjkdS98aKH76I8eD0_qjw.png"
                         alt="loading..."/>
                </div>
            </div>
        </section>
    )
}
export default Home;