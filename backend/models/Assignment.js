const mongoose = require("mongoose")

const assignmentSchema = new mongoose.Schema({
 title:String,
 description:String,
 deadline:Date,

 instructorId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User"
 },
 
 fileUrl:{
  type:String
 },

 createdAt:{
  type:Date,
  default:Date.now
 }
})

module.exports = mongoose.model("Assignment",assignmentSchema)