const mongoose = require("mongoose")

const SubmissionSchema = new mongoose.Schema({

 assignmentId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Assignment"
 },

 studentId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User"
 },

 fileUrl:String,

 grade:String,

 feedback:String

})

module.exports = mongoose.model("Submission",SubmissionSchema)