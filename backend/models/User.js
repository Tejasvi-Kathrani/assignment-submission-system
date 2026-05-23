const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
 name:{type:String,required:true},
 email:{type:String,required:true,unique:true},
 password:{type:String,required:true},

 role:{
  type:String,
  enum:["student","instructor","admin"],
  default:"student"
 },

 studentId:{
  type:String,
  unique:true,
  sparse:true
 },
 resetOTP:{
  type:String
 },

 otpExpiry:{
  type:Date
 },

 isActive:{          
  type:Boolean,
  default:true
 }

})

module.exports = mongoose.model("User",userSchema);