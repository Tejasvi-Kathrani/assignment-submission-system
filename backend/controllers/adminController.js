const User = require("../models/User")
const Assignment = require("../models/Assignment")
const Submission = require("../models/Submission")

// GET all users (active)
exports.getUsers = async (req,res)=>{
 try{

  const users = await User.find({ isActive:true })

  res.json(users)

 }catch(err){
  res.status(500).json("Server error")
 }
}
// GET inactive users
exports.getInactiveUsers = async (req,res)=>{
 try{

    
  const users = await User.find({ isActive:false })

  res.json(users)

 }catch(err){
  res.status(500).json("Server error")
 }
}

// updateuser
exports.updateUser = async (req,res)=>{

 try{
  const {email,name,role} = req.body
  
  const updated = await User.findByIdAndUpdate(
   req.params.id,
   { email,name,role },
   { returnDocument:'after'}
  )

  res.json(updated)

 }catch(err){
  res.status(500).json("Update failed")
 }

}


// soft delete
exports.deleteUser = async (req,res)=>{
 try{

  await User.findByIdAndUpdate(req.params.id,{
   isActive:false
  })

  res.json("User deactivated")

 }catch(err){
  res.status(500).json("Server error")
 }
}


// restore
exports.restoreUser = async (req,res)=>{
 try{

  await User.findByIdAndUpdate(req.params.id,{
   isActive:true
  })

  res.json("User restored")

 }catch(err){
  res.status(500).json("Restore failed")
 }
}


// all the assignments
exports.getAssignments = async (req,res)=>{
 try{

  const assignments = await Assignment.find()
  .populate("instructorId","name")

  res.json(assignments)

 }catch(err){
  res.status(500).json("Server error")
 }
}


// all submission
exports.getSubmissions = async (req,res)=>{
 try{

  const submissions = await Submission.find()
  .populate("studentId","name studentId")
  .populate("assignmentId","title")

  res.json(submissions)

 }catch(err){
  res.status(500).json("Server error")
 }
}


// report
exports.getReport = async (req,res)=>{
 try{

  const students = await User.countDocuments({
   role:"student",
   isActive:true
  })

  const instructors = await User.countDocuments({
   role:"instructor",
   isActive:true
  })

  const assignments = await Assignment.countDocuments()
  const submissions = await Submission.countDocuments()

  res.json({
   students,
   instructors,
   assignments,
   submissions
  })

 }catch(err){
  res.status(500).json("Server error")
 }
}