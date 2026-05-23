const Assignment = require("../models/Assignment")

// assignment create
exports.createAssignment = async (req,res)=>{

 try{

  if(req.user.role !== "instructor"){
   return res.status(403).json("Only instructors can create assignments")
  }

  const { title, description, deadline } = req.body

  if(!title || !description || !deadline){
   return res.status(400).json("Title, description, and deadline are required")
  }
if(isNaN(Date.parse(deadline))){
   return res.status(400).json("Invalid deadline format")
  } 
  if(new Date(deadline) < new Date()){
   return res.status(400).json("Deadline must be in the future")
  }

  const assignment = new Assignment({
   title,
   description,
   deadline,
   instructorId: req.user.id,
   fileUrl: req.file ? req.file.path : null
  })

  await assignment.save()

  res.json(assignment)

 }catch(err){
  console.log(err)
  res.status(500).json("Server error")
 }

}

// get assignments of particular instructor and all assignments for students
exports.getAssignments = async (req,res)=>{

 try{

  if(req.user.role === "instructor"){

   const assignments = await Assignment.find({
    instructorId:req.user.id
   })

   return res.json(assignments)

  }
  const assignments = await Assignment.find()

  res.json(assignments)

 }catch(err){

  console.log("ASSIGNMENT FETCH ERROR:",err)
  res.status(500).json("Server error")

 }

}

exports.getAssignmentById = async (req,res)=>{

 try{

  const assignment = await Assignment.findById(req.params.id)

  if(!assignment){
   return res.status(404).json("Assignment not found")
  }

  res.json(assignment)

 }catch(err){
  console.log(err)
  res.status(500).json("Server error")
 }

}
exports.deleteAssignment = async (req,res)=>{
 try{

  const assignment = await Assignment.findById(req.params.id)

  if(!assignment){
   return res.status(404).json("Assignment not found")
  }

  // 🔥 only instructor who created it can delete
  if(String(assignment.instructorId) !== String(req.user.id)){
   return res.status(403).json("Not allowed")
  }

  await assignment.deleteOne()

  res.json("Assignment deleted")

 }catch(err){
  console.log(err)
  res.status(500).json("Server error")
 }
}