import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";



function login(){

    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [loading,setLoading]=useState("");
    const [message,setMessage]=useState("");
    const navigate =useNavigate();
   

    let result;
    const handleSubmit = async (e)=>{
        
        setLoading(true);
        
        const loginData=new URLSearchParams();
        loginData.append("username",username);
        loginData.append("password",password);
        


        
        try{
            
            const response = await fetch('https://todo-2dd8.onrender.com/login',{
                method:"POST",
                headers:{"content-type":"application/x-www-form-urlencoded"},
                body:loginData
            });

            if (response.ok){
                const data=await response.json();
                
                localStorage.setItem("name",JSON.stringify(data.username));
                
                localStorage.setItem("token",data.access_token);
                navigate("/create");

            }
            else{
                alert("Invalid Credientials")
            }
        }
        catch (error){
            console.log(error);

        }
        finally{
            setLoading(false);
        }
    }
    


    return (
        <><div className="bg-[#00092d] h-screen flex items-center justify-center">
            <div className="grid grid-cols-1 bg-blue-900/20 w-70 sm:w-75 md:w-80 lg:w-85 h-74 sm:h-76 md:h-78 lg:h-80 rounded-4xl text-center">
                
                <div className="mt-6">
                    <h1 className="ml-9 text-2xl text-start sm:text-xl md:text-2xl lg:text-3xl text-white font-bold font-mono">Login</h1>
                    <input className="border border-gray-600 rounded-lg pr-5 sm:pr-6 md:pr-8 lg:pr-10 px-2 my-2 mx-1 md:mx-2 lg:mx-3 py-2 text-white/70 text-sm sm:text-sm md:text-md lg:text-lg font-semibold bg-[#00092d] focus:outline-none" placeholder="username" value={username} onChange={(e)=>setUsername(e.target.value)}></input>
                    <input className="border border-gray-600 rounded-lg pr-5 sm:pr-6 md:pr-8 lg:pr-10 px-2 my-2 mx-1 md:mx-2 lg:mx-3 py-2 text-white/70 text-sm sm:text-sm md:text-md lg:text-lg font-semibold bg-[#00092d] focus:outline-none" placeholder="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}></input>
                </div>
                <div className="h-20 flex flex-col justify-center items-center">
                    <button className="bg-[#00092d] block px-10 sm:px-13 md:px-16 lg:px-20 h-10 text-white/80 font-bold text-md md:text-lg lg:text-xl active:scale-102 transition duration-100 active:bg-[#024b6d] active:text-white/70 rounded-lg mx-5" onClick={handleSubmit} disabled={loading}><h1>{loading?"logging in":"Log in"}</h1></button>
                    <Link className="text-white/80 font-semibold py-1" to={"/register"}>for new user register?</Link>
                </div>

                
            </div>

            

            
            

             
        </div>
        </>
    )
}

export default login;