import Button from "../component/Button.tsx";
import {Link} from "react-router-dom";

const Home = () => {
    return (
        <section className={'h-[30rem]'}>
            <div className={'flex h-full'}>
                <div className={'op w-full xl:w-3/4 flex flex-col justify-center items-start pl-[8%]'}>
                    <div className={'op pl-[3%] space-y-10'}>
                        <div className={'text-6xl sm:text-7xl md:text-8xl font-gama tracking-tighter'}>
                            <div className={''}>Human</div>
                            <div className={''}>stories & ideas</div>
                        </div>
                        <div className={'font-default text-xl font-medium'}>
                            A place to read, write, and deepen your understanding
                        </div>
                        <div className={'op'}>
                            <Link to={'/posts'}>
                                <Button variant={"primary"} text={"Start Reading"}
                                        className={'h-10 font-medium rounded-full '} type={'button'}/>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className={'hidden op xl:flex items-center justify-end xl:w-1/4 m-0 p-0'}>
                    <img
                         src="https://miro.medium.com/v2/format:webp/4*SdjkdS98aKH76I8eD0_qjw.png"
                         alt="loading..."/>
                </div>
            </div>
        </section>
    )
}
export default Home;