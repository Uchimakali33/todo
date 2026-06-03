import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Create(){

    const [task,setTask]=useState("");
    const [message,setMessage]=useState("");
    const navigate=useNavigate();
    const name=localStorage.getItem("name")
    const [show,setShow]=useState([]);
    

    const deleteTask=async ()=>{
        if (task==""){
            alert("enter the task to be deleted")
        }
        else{
            const token=localStorage.getItem("token");
            try{
                const response=await fetch("https://todo-2dd8.onrender.com/delete",{
                method:"DELETE",
                headers:{
                    "content-Type":"application/json",
                    "Authorization":`Bearer ${token}`
                },
                body:JSON.stringify({"data":task})
                
                })
                const res=await response.json()
               
                setMessage(res.message);

            }
            catch(error){
                console.error(error);
            }
            
        }
        

    }
    

    const logout=async ()=>{
        localStorage.removeItem("token");
        navigate("/login");
        
    }
    
    
    const handlecreate= async ()=>{
        if (task==""){
            alert("Task Cannot be Empty")
            
        }
        else{
            const token=localStorage.getItem("token")
            try{
                const response=await fetch('https://todo-2dd8.onrender.com/create',{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":`Bearer ${token}`
                    },
                    body:JSON.stringify({"data":task})
                });
                const res=await response.json()
                setMessage(res.message)
                
            
                if(!response.ok){
                    if (response.status==401){
                        console.log("token expired or invalid..")
                    }
                    throw new Error("Failed to Fetch Protected Data");
                }
            
            }
            catch(error){
                console.error(error);
            }
        }
        
    }

    const showtask = async () => {
        const token = localStorage.getItem("token")
        try{
            const response = await fetch("https://todo-2dd8.onrender.com/show",{
                method:"GET",
                headers:{
                    "content-Type":"application/json",
                    "Authorization":`Bearer ${token}`
                },
            })

            const res=await response.json()
            console.log(res["all_task"])
            setShow(res["all_task"])
            

        }
        catch(error){
            console.error(error);

        }
    }
    
    return (
        <>
        <div className="bg-black/90 w-full min-h-screen flex flex-col items-center justify-center">
            <div className="flex flex-col items-center bg-white/10 rounded-lg p-5">
                <h1 className="text-2xl text-white font-mono">Welcome {JSON.parse(name)}, Let's Start building your day with todo's</h1>

                <input type="text" onChange={(e)=>{setTask(e.target.value),setMessage("")}} className="w-105 mt-5 text-white border-2 text-lg font-sans rounded-lg border-emerald-400 hover:border-emerald-300 px-2 py-2 bg-white/10"/>
                <div className="button-row space-x-4">
                    <button  className="border rounded-lg w-50 h-10 bg-emerald-400 border-black/30 text-xl text-white font-bold font-mono px-6 hover:border-black/20 active:scale-99 transition duration-100 hover:bg-emerald-500 mt-5" onClick={handlecreate}>create</button>
                    <button className="bg-emerald-400 rounded-lg w-50 h-10 text-xl mt-5 text-white font-mono font-bold hover:bg-emerald-500 active:scale-99 transistion duration-100" onClick={deleteTask}>Delete</button>
                </div>
                <h1 className="text-white font-bold pt-4 text-xl">{message}</h1>
                <button className="bg-red-600 rounded-lg w-50 h-10 text-xl mt-3 text-white font-mono font-bold hover:bg-red-700 active:scale-99 transistion duration-100" onClick={logout}>logout</button>
                
                
            </div>
            <div className="text-center mt-8">
                <h1 className="text-emerald-400 font-bold font-mono text-lg mt-2">To See the all task </h1>
                <button className="bg-emerald-400 rounded-lg w-50 h-10 text-xl mt-2 text-white font-mono font-bold hover:bg-emerald-500 active:scale-99 transistion duration-100" onClick={showtask}>Show</button>
            </div>
            <div className="mt-3">
                <ol className="text-white text-xl font-mono m-2">
                    {show.map((t)=><li key={t}>{t}</li>)}
                </ol>
            </div>
                

            
        </div>
        </>
    );
}

export default Create;
