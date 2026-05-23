import { useState } from "react"
import API from "../services/api"
import { useNavigate } from "react-router-dom"

export default function ForgotPassword(){

 const [step,setStep] = useState(1)
 const navigate = useNavigate()

 const [email,setEmail] = useState("")
 const [otp,setOtp] = useState("")
 const [newPassword,setNewPassword] = useState("")
 const [confirmPassword,setConfirmPassword] = useState("")

 
 const sendOTP = async ()=>{
  try{

   const res = await API.post("/auth/forgot-password",{email})

   if(res.status === 200){
    alert("OTP sent")
    setStep(2)
   }

  }catch(err){

   if(err.response){
    alert(err.response.data)
   }else{
    alert("Something went wrong")
   }

  }
 }

 const resetPassword = async ()=>{

  if(newPassword !== confirmPassword){
   alert("Passwords do not match")
   return
  }

  try{

   await API.post("/auth/reset-password",{
    email,
    otp,
    newPassword
   })

   alert("Password reset successful")

   setTimeout(()=>{
    navigate("/")
   },1000)

  }catch(err){
   alert(err.response?.data || "Error resetting password")
  }
 }

 return(
    <div className="forgot-page">
        <div className="forgot-card">
    
 <form autoComplete="off">

  <h2>Forgot Password</h2>

  {step === 1 && (
   <>
    <input
     name="reset-email"
     autoComplete="off"
     placeholder="Enter your email"
     onChange={(e)=>setEmail(e.target.value)}
    />

    <button type="button" onClick={sendOTP}>
     Send OTP
    </button>
   </>
  )}

  {/* STEP 2 */}
  {step === 2 && (
   <>
    <input
     name="otp"
     autoComplete="one-time-code"
     placeholder="Enter OTP"
     onChange={(e)=>setOtp(e.target.value)}
    />

    <input
     type="password"
     name="new-password"
     autoComplete="new-password"
     placeholder="New Password"
     onChange={(e)=>setNewPassword(e.target.value)}
    />

    <input
     type="password"
     name="confirm-password"
     autoComplete="new-password"
     placeholder="Confirm Password"
     onChange={(e)=>setConfirmPassword(e.target.value)}
    />

    <button type="button" onClick={resetPassword}>
     Reset Password
    </button>
   </>
  )}

 </form>
</div>
</div>
 )
}