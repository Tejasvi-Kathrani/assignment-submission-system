import { useState } from "react"
import API from "../services/api"
import { useNavigate, Link } from "react-router-dom"
import { FaEye, FaEyeSlash } from "react-icons/fa"

export default function Login(){

 const [email,setEmail] = useState("")
 const [password,setPassword] = useState("")
 const navigate = useNavigate()
 const [showPassword,setShowPassword] = useState(false)

 const login = async () => {

  try{

   const res = await API.post("/auth/login",{email,password})

   if(!res.data.user){
    alert(res.data)
    return
   }

   // save token
   localStorage.setItem("token",res.data.token)
   localStorage.setItem("user",JSON.stringify(res.data.user))

   const role = res.data.user.role

   if(role==="student") navigate("/student")
   else if(role==="instructor") navigate("/instructor")
   else navigate("/admin")

  }
  catch(err){
   alert("Login failed")
  }

 }

 return(

     <div className="login-page">
     <div className="center-box">
   
 <h2> Hello!  welcome back</h2>


    <div className="login-box">
 <input
 placeholder="Email"
 onChange={(e)=>setEmail(e.target.value)}
 />


 <div className="password-box">

 <input
  type={showPassword ? "text" : "password"}
  placeholder="Password"
  onChange={(e)=>setPassword(e.target.value)}
 />

 <span onClick={()=>setShowPassword(!showPassword)}>
  {showPassword ? <FaEyeSlash /> : <FaEye />}
 </span>

</div>
 
 <button onClick={login}>
 Login
 </button>
 <p 
 style={{cursor:"pointer", color:"#2563eb"}}
 onClick={()=>navigate("/forgot")}
>
 Forgot Password?
</p>

 <p className="register-text">
 Don't have an account? <Link to="/register">Register</Link>
 </p>
</div>
 </div>
 </div>

 )

}