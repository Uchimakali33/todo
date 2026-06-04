import { Link } from "react-router-dom";

function Home(){
    return (
        <>
        <div className="bg-black/90 h-screen flex flex-col items-center pb-100">
            <div className="pt-5 col-span-2 mt-50">
                <h1 className="sm:text-lg md:text-2xl lg:text-3xl font-semibold mb-5 text-white">Hello,<span className="font-bold text-emerald-400 font-sans">Welcome to My First App</span></h1>

            </div>
            <div className="">
                <Link className="border rounded-lg mx-5 sm:w-50 md:w-55 lg:w-60 border-emerald-400  md:text-lg sm:text-md lg:text-xl text-white font-mono py-2 px-6 hover:border-emerald-600 active:scale-99 transition duration-100 hover:bg-black/20 mt-3" to={"/login"}>Login</Link>
                <Link className="border rounded-lg sm:w-50 md:w-55 lg:w-60 bg-emerald-400 border-black/30 md:text-lg sm:text-md lg:text-xl text-white font-mono py-2 px-6 hover:border-black/20 active:scale-99 transition duration-100 hover:bg-emerald-500 mt-3" to={"/register"}>create account</Link>
            </div>
        </div>
        </>
    );
}

export default Home;