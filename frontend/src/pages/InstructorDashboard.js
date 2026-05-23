import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

export default function InstructorDashboard(){

 const [assignments,setAssignments] = useState([])
 const navigate = useNavigate()

 const [form,setForm] = useState({
  title:"",
  description:"",
  deadline:""
 })

 const [file,setFile] = useState(null)

 useEffect(()=>{
  fetchAssignments()
 },[])

 const fetchAssignments = async ()=>{
  const res = await API.get("/assignments")
  setAssignments(res.data)
 }

 const createAssignment = async ()=>{

  if(!form.title || !form.description){
   alert("Title and Description required")
   return
  }

  const formData = new FormData()

  formData.append("title",form.title)
  formData.append("description",form.description)
  formData.append("deadline",form.deadline)
  formData.append("file",file)

  await API.post("/assignments", formData, {
   headers: { "Content-Type": "multipart/form-data" }
  })

  alert("Assignment created")

  setForm({
   title:"",
   description:"",
   deadline:""
  })

  setFile(null)

  fetchAssignments()
 }

 // 🔥 DELETE FUNCTION (NEW)
 const deleteAssignment = async(id)=>{
  if(!window.confirm("Delete this assignment?")) return

  try{
   await API.delete(`/assignments/${id}`)
   fetchAssignments()
  }catch(err){
   alert("Delete failed")
  }
 }

 return(

 <div className="instructor-page">

  <div className="dashboard clean">

   <div style={{
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    marginBottom:"20px"
   }}>
    <h1>Instructor Dashboard</h1>

    <div style={{display:"flex", gap:"10px"}}>

     <button onClick={()=>navigate("/change-password")}>
      Change Password
     </button>

     <button onClick={()=>{
      localStorage.clear()
      navigate("/")
     }}>
      Logout
     </button>

    </div>
   </div>

   <div className="form-section">

    <h2>Create Assignment</h2>

    <input
     placeholder="Title"
     value={form.title}
     onChange={(e)=>setForm({...form,title:e.target.value})}
    />

    <input
     placeholder="Description"
     value={form.description}
     onChange={(e)=>setForm({...form,description:e.target.value})}
    />

    <input
     type="date"
     min={new Date().toISOString().split("T")[0]}
     value={form.deadline}
     onChange={(e)=>setForm({...form,deadline:e.target.value})}
    />

    <input
     type="file"
     accept="application/pdf"
     onChange={(e)=>setFile(e.target.files[0])}
    />

    <button onClick={createAssignment}>
     Create Assignment
    </button>

   </div>

   <hr className="section-divider" />

   <h2 style={{marginTop:"30px",}}>Assignments</h2>

   <div className="assignment-list">

    {assignments.map((a)=>(

     <div className="assignment-row" key={a._id}>

      <div>
       <h2>{a.title}</h2>
       <p style={{fontSize:"18px"}}>{a.description}</p>

       {a.fileUrl && (
        <button
         style={{marginTop:"5px"}}
         onClick={()=>window.open(`http://localhost:5000/${a.fileUrl}`)}
        >
         View PDF
        </button>
       )}
      </div>

      <div style={{display:"flex", gap:"10px", padding:"10px", borderRadius:"6px"}}>

       <button onClick={()=>navigate(`/instructor/submissions/${a._id}`)}>
        View Submissions
       </button>

       <button onClick={()=>deleteAssignment(a._id)}>
        Delete
       </button>

      </div>

     </div>

    ))}

   </div>

  </div>

 </div>

 )
}