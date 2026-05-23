import {useEffect,useState} from "react"
import API from "../services/api"

export default function AdminAssignments(){

 const [assignments,setAssignments] = useState([])

 useEffect(()=>{
  fetchAssignments()
 },[])

 const fetchAssignments = async ()=>{
  const res = await API.get("/admin/assignments")
  setAssignments(res.data)
 }

 return(

 <div>

  <h2>Assignments</h2>

  {assignments.map(a=>(
   <div key={a._id} className="admin-assignment">

    <h3>{a.title}</h3>

    <p>{a.description}</p>

    <p>Instructor: {a.instructorId?.name}</p>


    {a.fileUrl && (
     <button className="aa-btn"
      onClick={()=>window.open(`http://localhost:5000/${a.fileUrl}`)}
     >
      View PDF
     </button>
    )}

   </div>
  ))}

 </div>

 )
}