import {useEffect,useState} from "react"
import API from "../services/api"

export default function AdminSubmissions(){

 const [submissions,setSubmissions] = useState([])
 useEffect(()=>{
     fetchSubmissions()
    },[])
    
    const fetchSubmissions = async ()=>{
        const res = await API.get("/admin/submissions")
        setSubmissions(res.data)
    }
    
    return(
        
        <div className="submissions-page">

 <h2>Submissions</h2>

 <table>

  <thead>
   <tr>
    <th>Student Id</th>
    <th>Student name</th>
    <th>Assignment</th>
    <th>File</th>
    <th>Grade</th>
    <th>Feedback</th>
    <th>Status</th>
   </tr>
  </thead>

  <tbody>

  {submissions.map(s=>{
      
      const fileUrl = `http://localhost:5000/${s.fileUrl}`
      const filename = s.fileUrl.split("/").pop()
      
   return(

    <tr key={s._id}>

     <td>{s.studentId?.studentId}</td>
     <td>{s.studentId?.name}</td>


     <td>{s.assignmentId?.title}</td>

     <td>
      {s.fileUrl ? (
       <>
        <a href={fileUrl} target="_blank" rel="noreferrer">
         View
        </a>
 
       </>
      ) : (
       "-"
      )}
     </td>

     <td>
      {s.grade ? (
       <span className="grade">{s.grade}</span>
      ) : "-"}
     </td>

     <td>
      {s.feedback ? s.feedback : "-"}
     </td>

     <td>
      {s.grade ? (
       <span style={{color:"#38670a"}}>Graded ✓</span>
      ) : (
       <span style={{color:"#dd900c"}}>Pending</span>
      )}
     </td>

    </tr>

   )
  })}

  </tbody>

 </table>

 </div>

 )
}