const Submission = require("../models/Submission")
const Assignment = require("../models/Assignment")

exports.submitAssignment = async (req,res)=>{

 try{

  if(!req.file){
   return res.status(400).json("No file uploaded")
  }

  const { assignmentId } = req.body

  const assignment = await Assignment.findById(assignmentId)

  if(!assignment){
   return res.status(404).json("Assignment not found")
  }

  if(assignment.deadline && new Date(assignment.deadline) < new Date()){
   return res.status(400).json("Deadline has passed")
  }

  const existing = await Submission.findOne({
   assignmentId:assignmentId,
   studentId:req.user.id
  })

  if(existing){
   return res.status(400).json("Assignment already submitted")
  }

  const submission = new Submission({
   assignmentId:assignmentId,
   studentId:req.user.id,
   fileUrl:req.file.path
  })

  await submission.save()

  res.json("Assignment submitted")

 }catch(err){

  console.log("SUBMISSION ERROR:", err)
  res.status(500).json("Server error")

 }

}

exports.getSubmissionsByAssignment = async (req,res)=>{

 try{

  const assignment = await Assignment.findById(req.params.id)

  if(!assignment){
   return res.status(404).json("Assignment not found")
  }

  if(!req.user){
   return res.status(401).json("Unauthorized")
  }

  if(String(assignment.instructorId) !== String(req.user.id)){
   return res.status(403).json("Not allowed")
  }

  const submissions = await Submission.find({
   assignmentId:req.params.id
  }).populate("studentId","name")

  res.json(submissions)

 }catch(err){

  console.log("FETCH SUBMISSIONS ERROR:", err)
  res.status(500).json("Server error")

 }

}



exports.getSubmissionsByStudent = async (req,res)=>{

 try{

  const submissions = await Submission.find({
   studentId:req.params.id
  })

  res.json(submissions)

 }catch(err){

  console.log("STUDENT SUBMISSION ERROR:", err)
  res.status(500).json("Server error")

 }

}


exports.gradeSubmission = async (req,res)=>{

 try{

  const {grade,feedback} = req.body

  const submission = await Submission.findByIdAndUpdate(

   req.params.id,
   { grade, feedback },
   { returnDocument:"after" }

  )

  res.json(submission)

 }catch(err){

  console.log("GRADE ERROR:", err)
  res.status(500).json("Server error")

 }

}