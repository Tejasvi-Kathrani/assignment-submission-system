import { useState } from "react"
import API from "../services/api"
import { useNavigate } from "react-router-dom"

export default function ChangePassword(){

 const navigate = useNavigate()

 const [oldPassword,setOldPassword] = useState("")
 const [newPassword,setNewPassword] = useState("")
 const [confirmPassword,setConfirmPassword] = useState("")

const handleChange = async ()=>{

 if(newPassword !== confirmPassword){
  alert("Passwords do not match")
  return
 }

 try{

  await API.put("/auth/change-password",{
   oldPassword,
   newPassword
  })

  alert("Password updated")

  const user = JSON.parse(localStorage.getItem("user"))

  if(user.role === "student"){
   navigate("/student")
  }else if(user.role === "instructor"){
   navigate("/instructor")
  }else{
   navigate("/admin")
  }

 }catch(err){
  alert(err.response?.data || "Error")
 }
}
 return(

 <div className="login-page">

  <div className="login-box">

   <h2>Change Password</h2>

   <input
    type="password"
    placeholder="Old Password"
    onChange={(e)=>setOldPassword(e.target.value)}
   />

   <input
    type="password"
    placeholder="New Password"
    onChange={(e)=>setNewPassword(e.target.value)}
   />

   <input
    type="password"
    placeholder="Confirm Password"
    onChange={(e)=>setConfirmPassword(e.target.value)}
   />

   <button onClick={handleChange}>
    Update Password
   </button>

  </div>

 </div>

 )
}