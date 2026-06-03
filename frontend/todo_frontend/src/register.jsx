import { useState } from "react";
import { Link } from "react-router-dom";
function Register(){

    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [rpass,setRpass]=useState("");
    const [loading,setLoading]=useState(false);
    const [message,setMessage]=useState("");

    const handleRegister=async (e)=>{

        
        setLoading(true)
        if (password!=rpass){

            alert("enter the same password in two boxes");

        }
        else{
        const registerdata={username,password};


        try{
            Response=await fetch("http://127.0.0.1:8000/register",{
                method:"POST",
                headers:{"content-type":"application/json"},
                body:JSON.stringify(registerdata)

            })

            const res= await Response.json();

            if (res.success){
                setMessage(res.message);
            }
            else{
                setMessage(res.message);

            }

        }
        catch(error){
            alert(error);


        }
        finally{
            setLoading(false);
        }
    }
    }
    
    return (
        <>
        <div className="bg-black/90 text-center flex flex-col items-center pb-50">

            <div className="bg-black w-90 h-100 rounded-lg mt-20">
                <h1 className="text-2xl text-emerald-400 font-bold mt-9 mb-3">Register</h1>
                <input className="border bg-emerald-400 rounded-lg px-2 mt-4 text-lg text-black/80 font-semibold w-70 h-12" placeholder="create username" onChange={(e)=>setUsername(e.target.value)}></input>
                <input className="border bg-emerald-400 rounded-lg px-2 mt-4 text-lg text-black/80 font-semibold w-70 h-12" placeholder="new password" onChange={(e)=>setPassword(e.target.value)}></input>
                <input className="border bg-emerald-400 rounded-lg px-2 mt-4 text-lg text-black/80 font-semibold w-70 h-12" placeholder="retype password" onChange={(e)=>setRpass(e.target.value)}></input>
                <button className="bg-emerald-400 block w-70 h-8 text-black/80 font-bold text-xl mt-7 active:scale-102 transition duration-100 active:bg-emerald-500 active:text-black/70 rounded-lg ml-10 mb-2" onClick={handleRegister}><h1>Register</h1></button>
                <Link className="text-emerald-400 font-semibold" to={"/login"}>is account exists ?</Link>

            </div>
           

        </div>
        </>
    );
}

export default Register;