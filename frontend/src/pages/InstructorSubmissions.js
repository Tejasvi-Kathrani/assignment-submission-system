import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import API from "../services/api"

export default function InstructorSubmissions(){

 const {id} = useParams()

 const [submissions,setSubmissions] = useState([])
 const [grades,setGrades] = useState({})

 useEffect(()=>{
  fetchSubmissions()
 },[])

 const fetchSubmissions = async ()=>{

  const res = await API.get(`/submissions/assignment/${id}`)
  setSubmissions(res.data)

 }

 const handleInput = (submissionId,field,value)=>{

  setGrades({
   ...grades,
   [submissionId]:{
    ...grades[submissionId],
    [field]:value
   }
  })

 }

const gradeSubmission = async (submissionId)=>{

 const data = grades[submissionId]

 // validation
 if(!data?.grade || !data?.feedback){
  alert("Please fill grade and feedback")
  return
 }

 await API.put(`/submissions/${submissionId}`,{
  grade:data.grade,
  feedback:data.feedback
 })

 alert("Graded successfully")

 fetchSubmissions()

}

 return(

 <div className="dashboard">

 <h1>Submissions</h1>

 <table style={{
  width:"100%",
  borderCollapse:"collapse",
  marginTop:"20px"
 }}>

 <thead>

 <tr style={{background:"#f5f5f5"}}>

 <th style={{padding:"10px"}}>Student</th>
 <th style={{padding:"10px"}}>File</th>
 <th style={{padding:"10px"}}>Grade</th>
 <th style={{padding:"10px"}}>Feedback</th>
 <th style={{padding:"10px"}}>Action</th>

 </tr>

 </thead>

 <tbody>

 {submissions.map((s)=>(
 <tr key={s._id}>

 <td style={{padding:"10px"}}>
 {s.studentId?.name}
 </td>

 <td style={{padding:"10px"}}>

 <a
 href={`http://localhost:5000/${s.fileUrl}`}
 target="_blank"
 rel="noreferrer"
 >
 Download
 </a>

 </td>

 <td style={{padding:"10px"}}>

 {s.grade ? (

  <span>{s.grade}</span>

 ) : (

<select
 value={grades[s._id]?.grade || ""}
 onChange={(e)=>handleInput(s._id,"grade",e.target.value)}
>
 <option value="">Select Grade</option>
 <option value="A">A</option>
 <option value="B">B</option>
 <option value="C">C</option>
 <option value="D">D</option>
 <option value="F">F</option>
</select>

 )}

 </td>

 <td style={{padding:"10px"}}>

 {s.feedback ? (

  <span>{s.feedback}</span>

 ) : (

  <input
   placeholder="Feedback"
   value={grades[s._id]?.feedback || ""}
   onChange={(e)=>handleInput(s._id,"feedback",e.target.value)}
  />

 )}

 </td>

 <td style={{padding:"10px"}}>

 {s.grade ? (

  <span style={{color:"green"}}>Graded ✓</span>

 ) : (

  <button onClick={()=>gradeSubmission(s._id)}>
   Submit
  </button>

 )}

 </td>

 </tr>
 ))}

 </tbody>

 </table>

 </div>

 )

}