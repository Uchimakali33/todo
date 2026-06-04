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
        <><div className=" bg-black/90 h-screen flex flex-col items-center pb-50">
            <div className=" bg-black/90 w-77 sm:w-80 md:w-85 lg:w-90 h-100 rounded-lg text-center gap-4 mt-17">
                <h1 className="text-emerald-400 font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl pt-2 sm:pt-4 md:pt-8 lg:pt-10">Login</h1>
                <input className="border border-amber-50 rounded-lg px-2 text-black/70 text-sm sm:text-sm md:text-md lg:text-lg font-semibold w-57 sm:w-60 md:w-65 lg:w-70 h-10 bg-emerald-400 mt-7" placeholder="username" value={username} onChange={(e)=>setUsername(e.target.value)}></input>
                <input className="border border-amber-50 rounded-lg px-2 text-black/70 text-sm sm:text-sm md:text-md lg:text-lg font-semibold md:w-65 w-57 sm:w-60 lg:w-70 h-10 bg-emerald-400 mt-4" placeholder="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}></input>
                <button className="bg-emerald-400 block w-57 sm:w-60 md:w-65 lg:w-70 h-8 text-black/80 font-bold text-md md:text-lg lg:text-xl mt-10 active:scale-102 transition duration-100 active:bg-emerald-500 active:text-black/70 rounded-lg ml-10 mb-2" onClick={handleSubmit} disabled={loading}><h1>{loading?"logging in":"Log in"}</h1></button>
                <Link className="text-emerald-400 font-semibold pt-1" to={"/register"}>for new user register?</Link>

                
            </div>

            

            
            

             
        </div>
        </>
    )
}

export default login;