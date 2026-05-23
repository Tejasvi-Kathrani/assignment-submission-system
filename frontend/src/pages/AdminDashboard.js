import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import API from "../services/api"

export default function AdminDashboard(){

 const [report,setReport] = useState({})
 const navigate = useNavigate()  

 useEffect(()=>{
  fetchReport()
 },[])

 const fetchReport = async ()=>{
  const res = await API.get("/admin/report")
  setReport(res.data)
 }

 return(

 <div style={{display:"flex"}}>

 {/* SIDEBAR */}
 <div style={{
  width:"220px",
  background:"#1e293b",
  color:"white",
  padding:"20px",
  minHeight:"100vh"
 }}>

  <h2>Admin Panel</h2>

  <ul className="sidebar-list">

   <li>
    <Link to="/admin/users" className="sidebar-link">
     Users
    </Link>
   </li>

   <li>
    <Link to="/admin/assignments" className="sidebar-link">
     Assignments
    </Link>
   </li>

   <li>
    <Link to="/admin/submissions" className="sidebar-link">
     Submissions
    </Link>
   </li>

   <li>
    <span 
     className="sidebar-link"
     style={{cursor:"pointer"}}
     onClick={()=>navigate("/change-password")}
    >
     Change Password
    </span>
   </li>

  </ul>

 </div>

 <div style={{flex:1,padding:"30px"}}>

  <h1>Admin Overview</h1>

  <div style={{display:"flex",gap:"20px"}}>

   <div className="card">
    <h3>Students</h3>
    <p>{report.students}</p>
   </div>

   <div className="card">
    <h3>Instructors</h3>
    <p>{report.instructors}</p>
   </div>

   <div className="card">
    <h3>Assignments</h3>
    <p>{report.assignments}</p>
   </div>

   <div className="card">
    <h3>Submissions</h3>
    <p>{report.submissions}</p>
   </div>

  </div>

 </div>

 </div>

 )
}