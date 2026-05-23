import {useState} from "react"
import API from "../services/api"
import {useNavigate} from "react-router-dom"
import { FaEye, FaEyeSlash } from "react-icons/fa"

export default function Register(){

 const navigate = useNavigate()

 const [showPassword,setShowPassword] = useState(false)

 const [form,setForm] = useState({
  name:"",
  email:"",
  password:"",
  role:"student"
 })

 // PASSWORD VALIDATION
 const validatePassword = (password)=>{
  if(password.length < 6){
   return "Password must be at least 6 characters"
  }

  if(!/[A-Za-z]/.test(password)){
   return "Password must contain a letter"
  }

  if(!/[0-9]/.test(password)){
   return "Password must contain a number"
  }

  return null
 }
 const validateForm = (form)=>{

 if(!form.name.trim()){
  return "Name is required"
 }

 if(!form.email.trim()){
  return "Email is required"
 }

 // simple email regex
 if(!/\S+@\S+\.\S+/.test(form.email)){
  return "Enter valid email"
 }

 if(!form.password.trim()){
  return "Password is required"
 }

 return null
}

 const handleRegister = async () => {

    const formError = validateForm(form)
 if(formError){
  alert(formError)
  return
 }
 
  const error = validatePassword(form.password)

  if(error){
   alert(error)
   return
  }

  try{

   await API.post("/auth/register",form)

   alert("Registration successful")

   navigate("/")

  }catch(err){

   alert(err.response?.data || "Registration failed")

  }

 }

 return(

 <div className="login-page">

  <div className="center-box">

   <h2>Create Your Account</h2>

   <div className="login-box">

    <input
     placeholder="Name"
     onChange={(e)=>setForm({...form,name:e.target.value})}
    />

    <input
     placeholder="Email"
     onChange={(e)=>setForm({...form,email:e.target.value})}
    />
    <div className="password-box">

     <input
      type={showPassword ? "text" : "password"}
      placeholder="Password"
      onChange={(e)=>setForm({...form,password:e.target.value})}
     />

     <span onClick={()=>setShowPassword(!showPassword)}>
      {showPassword ? <FaEyeSlash /> : <FaEye />}
     </span>

    </div>

    <select
     onChange={(e)=>setForm({...form,role:e.target.value})}
    >
     <option value="student">Student</option>
     <option value="instructor">Instructor</option>
     {/* <option value="admin">admin</option> */}
    </select>

    <button onClick={handleRegister}>
     Register
    </button>

    <p className="register-text">
     Already have an account? 
     <span 
      style={{color:"#1758e5",cursor:"pointer"}}
      onClick={()=>navigate("/")}
     >
      Login
     </span>
    </p>

   </div>

  </div>

 </div>

 )
}