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
            
            const response = await fetch('http://127.0.0.1:8000/login',{
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
        <><div className=" bg-black/90 flex flex-col items-center pb-50">
            <div className=" bg-black/90 w-90 h-100 rounded-lg text-center gap-4 mt-20">
                <h1 className="text-emerald-400 font-bold text-3xl pt-10">Login</h1>
                <input className="border border-amber-50 rounded-lg px-2 text-black/70 text-lg font-semibold w-70 h-10 bg-emerald-400 mt-7" placeholder="username" value={username} onChange={(e)=>setUsername(e.target.value)}></input>
                <input className="border border-amber-50 rounded-lg px-2 text-black/70 text-lg font-semibold w-70 h-10 bg-emerald-400 mt-4" placeholder="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}></input>
                <button className="bg-emerald-400 block w-70 h-8 text-black/80 font-bold text-xl mt-10 active:scale-102 transition duration-100 active:bg-emerald-500 active:text-black/70 rounded-lg ml-10 mb-2" onClick={handleSubmit} disabled={loading}><h1>{loading?"logging in":"Log in"}</h1></button>
                <Link className="text-emerald-400 font-semibold pt-1" to={"/register"}>for new user register?</Link>

                
            </div>

            

            
            

             
        </div>
        </>
    )
}

export default login;