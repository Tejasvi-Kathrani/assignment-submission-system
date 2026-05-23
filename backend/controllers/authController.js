const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
exports.register = async (req,res)=>{

 try{
  const {name,email,password,role} = req.body


if(!name || !email || !password){
 return res.status(400).json("All fields are required")
}

if(!/\S+@\S+\.\S+/.test(email)){
 return res.status(400).json("Invalid email format")
}

if(password.length < 6){
 return res.status(400).json("Password must be at least 6 characters")
}

if(!/[A-Za-z]/.test(password)){
 return res.status(400).json("Password must contain a letter")
}

if(!/[0-9]/.test(password)){
 return res.status(400).json("Password must contain a number")
}

  const existing = await User.findOne({email})

  if(existing){
   return res.status(400).json("User already exists")
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password,salt)

let studentId = null

if(role === "student"){

 const lastStudent = await User.findOne({ role: "student" })
  .sort({ studentId: -1 })

 studentId = "STU1001"

 if(lastStudent && lastStudent.studentId){
  const lastNumber = parseInt(lastStudent.studentId.replace("STU",""))
  studentId = "STU" + (lastNumber + 1)
 }
}
  const user = new User({
   name,
   email,
   password:hashedPassword,
   role,
   studentId : role === "student" ? studentId : undefined,   
   isActive:true
  })

  await user.save()

  res.json("User registered successfully")

 }catch(err){

  res.status(500).json(err)
  console.log(err);

 }

}
exports.login = async (req,res)=>{

 try{

 const {email,password} = req.body

 const user = await User.findOne({email})

 if(!user){
  return res.json("User not found")
 }

 if(user.isActive === false){
  return res.status(403).json("User is deactivated")
 }
const isMatch = await bcrypt.compare(password, user.password)

if(!isMatch){
 return res.json("Wrong password")
}

 const token = jwt.sign(
  {id:user.id,role:user.role},
  process.env.JWT_SECRET
 )

 res.json({
  message:"Login successful",
  token,
  user
 })

 }catch(err){

 res.status(500).json(err)

 }

}
//installed nodemailer 
const sendMail = require("../utils/sendMail")

exports.forgotPassword = async (req,res)=>{
 try{

  const {email} = req.body

  const user = await User.findOne({email})


  if(!user){
   return res.status(400).json("Email not registered")
  }

  const otp = Math.floor(100000 + Math.random()*900000).toString()

  user.resetOTP = otp
  user.otpExpiry = Date.now() + 5*60*1000

  await user.save()

  await sendMail(email,"OTP",`Your OTP is ${otp}`)

  return res.status(200).json("OTP sent")  

 }catch(err){
  res.status(500).json("Error sending OTP")
 }
}
exports.resetPassword = async (req,res)=>{
 try{

  const {email,otp,newPassword} = req.body

  const user = await User.findOne({email})


  if(!user){
   return res.status(400).json("User not found")
  }

  if(user.resetOTP !== otp){
   return res.status(400).json("Invalid OTP")
  }

  if(user.otpExpiry < Date.now()){
   return res.status(400).json("OTP expired")
  }

  const salt = await bcrypt.genSalt(10)
  const hashed = await bcrypt.hash(newPassword,salt)

  user.password = hashed

  user.resetOTP = null
  user.otpExpiry = null

  await user.save()

  res.json("Password reset successful")

 }catch(err){
  console.log(err)
  res.status(500).json("Error resetting password")
 }
}

exports.changePassword = async (req,res)=>{

 try{

  const {oldPassword,newPassword} = req.body

  const user = await User.findById(req.user.id)

  if(!user){
   return res.status(404).json("User not found")
  }

  const isMatch = await bcrypt.compare(oldPassword,user.password)

  if(!isMatch){
   return res.status(400).json("Old password incorrect")
  }

  if(newPassword.length < 6){
   return res.status(400).json("Password must be at least 6 characters")
  }

  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(newPassword,salt)

  await user.save()

  res.json("Password updated successfully")

 }catch(err){
  console.log(err)
  res.status(500).json("Server error")
 }

}