import { useEffect, useState } from "react"
import API from "../services/api"
import { useNavigate } from "react-router-dom"

export default function StudentDashboard(){

 const [assignments,setAssignments] = useState([])
 const [files,setFiles] = useState({})
 const [submitted,setSubmitted] = useState({})

 const navigate = useNavigate()

 const user = JSON.parse(localStorage.getItem("user"))
 const studentId = user?.id || user?._id

 const [search,setSearch] = useState("")
 const [page,setPage] = useState(1)
 const perPage = 3

 useEffect(()=>{
  fetchAssignments()
  fetchSubmissions()
 },[])

 const fetchAssignments = async ()=>{
  const res = await API.get("/assignments")
  setAssignments(res.data)
 }

 const fetchSubmissions = async ()=>{
  if(!studentId) return

  const res = await API.get(`/submissions/student/${studentId}`)

  const submittedMap = {}

  res.data.forEach(s=>{
   submittedMap[s.assignmentId.toString()] = s
  })

  setSubmitted(submittedMap)
 }

 const uploadAssignment = async (assignmentId)=>{

  const file = files[assignmentId]

  if(!file){
   alert("Please choose a file")
   return
  }

  const formData = new FormData()
  formData.append("file",file)
  formData.append("assignmentId",assignmentId)

  await API.post("/submissions",formData)

  alert("Assignment uploaded")

  setFiles({
   ...files,
   [assignmentId]: null
  })

  fetchSubmissions()
 }

 const handleLogout = ()=>{
  localStorage.clear()
  navigate("/", { replace:true })
 }

 const filteredAssignments = assignments.filter(a =>
  a.title.toLowerCase().includes(search.toLowerCase())
 )

 const totalPages = Math.ceil(filteredAssignments.length / perPage)

 const paginatedAssignments = filteredAssignments.slice(
  (page-1)*perPage,
  page*perPage
 )

 return(

 <div className="assignment-list">

  <div style={{
   display:"flex",
   justifyContent:"space-between",
   alignItems:"center",
   marginBottom:"20px"
   
  }}>

   <h1>Student Dashboard</h1>

   <div style={{display:"flex", gap:"10px"}}>

    <button onClick={()=>navigate("/change-password")}>
     Change Password
    </button>

    <button onClick={handleLogout}>
     Logout
    </button>

   </div>

  </div>

  <input
   placeholder="Search assignments..."
   value={search}
   onChange={(e)=>{
    setSearch(e.target.value)
    setPage(1)
   }}
  />

  {assignments.length === 0 ? (

   <p>No assignments available</p>

  ) : (

   paginatedAssignments.map((a)=>{

    const isExpired =
     a.deadline && new Date(a.deadline) < new Date()

    return(

     <div key={a._id} className="assignment-item">

      <h3>{a.title}</h3>

      <p>{a.description}</p>

      <p>
       <b>Deadline:</b>{" "}
       {a.deadline
        ? new Date(a.deadline).toLocaleDateString()
        : "No deadline"}
      </p>

      {a.fileUrl && (
       <button 
        onClick={()=>window.open(`http://localhost:5000/${a.fileUrl}`)}
       >
        View PDF
       </button>
      )}

      {submitted[a._id] ? (

       <>
        <p style={{color:"green"}}>Submitted ✓</p>

        {submitted[a._id].grade && (
         <p><b>Grade:</b> {submitted[a._id].grade}</p>
        )}

        {submitted[a._id].feedback && (
         <p><b>Feedback:</b> {submitted[a._id].feedback}</p>
        )}
       </>

      ) : isExpired ? (

       <p style={{color:"red"}}>Deadline Passed ❌</p>

      ) : (

       <>
        <input
         type="file"
         onChange={(e)=>setFiles({
          ...files,
          [a._id]: e.target.files[0]
         })}
        />

        <button onClick={()=>uploadAssignment(a._id)}>
         Upload Assignment
        </button>
       </>
      )}

     </div>

    )
   })

  )}

  <div className="pagination-admin">

   <button 
    disabled={page === 1}
    onClick={()=>setPage(page-1)}
   >
    Prev
   </button>

    Page {page} of {totalPages || 1}


   <button 
    disabled={page === totalPages}
    onClick={()=>setPage(page+1)}
   >
    Next
   </button>

  </div>

 </div>

 )
}